import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Execute the real Server Action with its request-bound dependencies replaced.
const compiled = ts.transpileModule(
  readFileSync("src/app/admin/login/actions.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;

function loginAction(result: unknown) {
  let signedOut = false;
  let sessionReads = 0;
  const exports: {
    signIn?: (state: object, form: FormData) => Promise<unknown>;
  } = {};
  runInNewContext(compiled, {
    exports,
    process: { env: { ADMIN_USER_ID: "owner-id" } },
    require: (name: string) => {
      if (name === "@/lib/auth")
        return {
          authConfigured: () => true,
          getAuth: () => ({
            signIn: { email: async () => result },
            getSession: async () => {
              sessionReads++;
              return { data: null };
            },
            signOut: async () => {
              signedOut = true;
            },
          }),
        };
      if (name === "next/navigation")
        return {
          redirect: (url: string) => {
            throw new Error(`REDIRECT:${url}`);
          },
        };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  const form = new FormData();
  form.set("email", "owner@example.com");
  form.set("password", "test-password");
  return {
    run: () => exports.signIn!({}, form),
    signedOut: () => signedOut,
    sessionReads: () => sessionReads,
  };
}

test("owner login succeeds before the new session cookie reaches the next request", async () => {
  const action = loginAction({
    data: { user: { id: "owner-id" } },
    error: null,
  });
  await assert.rejects(action.run(), /REDIRECT:\/admin/);
  assert.equal(action.sessionReads(), 0);
  assert.equal(action.signedOut(), false);
});

test("a different signed-in account is signed out and denied access", async () => {
  const action = loginAction({
    data: { user: { id: "other-id" } },
    error: null,
  });
  const result = (await action.run()) as { error: string };
  assert.equal(result.error, "This account doesn’t have access to the shop.");
  assert.equal(action.signedOut(), true);
});

test("failed sign-in and a missing user cannot grant admin access", async () => {
  for (const result of [
    { data: null, error: { message: "Invalid password" } },
    { data: null, error: null },
  ]) {
    const action = loginAction(result);
    const response = (await action.run()) as { error: string };
    assert.ok(response.error);
  }
});
