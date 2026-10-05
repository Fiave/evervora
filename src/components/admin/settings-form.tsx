"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { saveSettings } from "@/app/admin/actions";
import type { ShopSettings } from "@/lib/types";
export function SettingsForm({
  settings,
  demo,
}: {
  settings: ShopSettings;
  demo: boolean;
}) {
  const [values, setValues] = useState(settings),
    [error, setError] = useState(""),
    [pending, start] = useTransition();
  const router = useRouter();
  function update(key: keyof ShopSettings, value: string) {
    setValues((s) => ({ ...s, [key]: value }));
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        const result = await saveSettings(values);
        if (result.error) setError(result.error);
        else {
          setError("");
          toast.success("Shop settings saved.");
          router.refresh();
        }
      } catch {
        setError("Could not save. Please try again.");
      }
    });
  }
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Shop settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Keep your customers connected to the right places.
      </p>
      <form onSubmit={submit} className="mt-7 max-w-2xl">
        <Card className="shadow-none">
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp Business number</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+233…"
                value={values.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include the country code. Leave empty to disable chat links
                until you’re ready.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delivery">Delivery information</Label>
              <Textarea
                id="delivery"
                rows={3}
                maxLength={500}
                value={values.delivery}
                onChange={(e) => update("delivery", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact or location information</Label>
              <Input
                id="contact"
                maxLength={300}
                value={values.contact}
                onChange={(e) => update("contact", e.target.value)}
              />
            </div>
            <div className="grid gap-5 border-t pt-6">
              {(["instagram", "facebook", "tiktok"] as const).map((key) => (
                <div key={key} className="grid gap-2">
                  <Label htmlFor={key} className="capitalize">
                    {key} link
                  </Label>
                  <Input
                    id={key}
                    type="url"
                    placeholder="https://…"
                    value={values[key]}
                    onChange={(e) => update(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button disabled={demo || pending}>
              {pending ? "Saving…" : "Save settings"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
