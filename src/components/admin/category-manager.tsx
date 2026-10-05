"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import type { ShopData, Category } from "@/lib/types";
export function CategoryManager({ data }: { data: ShopData }) {
  const [editing, setEditing] = useState<Category | null>(null),
    [name, setName] = useState(""),
    [position, setPosition] = useState(data.categories.length),
    [error, setError] = useState(""),
    [pending, start] = useTransition();
  const router = useRouter();
  function reset() {
    setEditing(null);
    setName("");
    setPosition(data.categories.length);
    setError("");
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        const result = await saveCategory({ id: editing?.id, name, position });
        if (result.error) setError(result.error);
        else {
          toast.success("Category saved.");
          reset();
          router.refresh();
        }
      } catch {
        setError("Could not save. Please try again.");
      }
    });
  }
  function remove(id: string) {
    start(async () => {
      try {
        const result = await deleteCategory(id);
        if (result.error) toast.error(result.error);
        else {
          toast.success("Category deleted.");
          router.refresh();
        }
      } catch {
        toast.error("Could not delete. Please try again.");
      }
    });
  }
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Help customers find what they’re looking for.
      </p>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid content-start gap-3">
          {data.categories.map((c) => (
            <Card key={c.id} className="py-0 shadow-none">
              <CardContent className="flex items-center justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h2 className="break-words font-semibold">{c.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {data.products.filter((p) => p.categoryId === c.id).length}{" "}
                    products · Position {c.position}
                  </p>
                </div>
                <div className="flex shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${c.name}`}
                    onClick={() => {
                      setEditing(c);
                      setName(c.name);
                      setPosition(c.position);
                      setError("");
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${c.name}`}
                        disabled={data.demo || pending}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {c.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Products must be moved to another category first.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep category</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(c.id)}>
                          Delete category
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-fit shadow-none">
          <CardContent>
            <h2 className="font-semibold">
              {editing ? "Edit category" : "Add category"}
            </h2>
            <form onSubmit={submit} className="mt-5 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Category name</Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={60}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Display position</Label>
                <Input
                  id="position"
                  type="number"
                  min={0}
                  max={999}
                  value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first.
                </p>
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button disabled={data.demo || pending}>
                <Plus size={16} />
                {pending ? "Saving…" : "Save category"}
              </Button>
              {editing && (
                <Button type="button" variant="ghost" onClick={reset}>
                  Cancel editing
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
