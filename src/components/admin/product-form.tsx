"use client";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProductPhoto } from "@/components/shop/product-photo";
import { saveProduct } from "@/app/admin/actions";
import type { Product, ProductImage, Category } from "@/lib/types";
export function ProductForm({
  product,
  categories,
  demo,
}: {
  product?: Product;
  categories: Category[];
  demo: boolean;
}) {
  const router = useRouter();
  const photoInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [name, setName] = useState(product?.name ?? ""),
    [description, setDescription] = useState(product?.description ?? ""),
    [categoryId, setCategory] = useState(
      product?.categoryId ?? categories[0]?.id ?? "",
    );
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []),
    [available, setAvailable] = useState(product?.available ?? true),
    [published, setPublished] = useState(product?.published ?? false),
    [featured, setFeatured] = useState(product?.featured ?? false);
  const [uploading, setUploading] = useState(false),
    [progress, setProgress] = useState(0),
    [uploadLabel, setUploadLabel] = useState(""),
    [error, setError] = useState(""),
    [failedFile, setFailedFile] = useState<File | null>(null);
  async function uploadFile(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      throw new Error(
        "Choose a JPG, PNG or WebP photo. Export HEIC photos as JPG first.",
      );
    if (file.size > 10 * 1024 * 1024)
      throw new Error("Choose a photo smaller than 10 MB.");
    const authResponse = await fetch("/api/imagekit/auth", { method: "POST" });
    const auth = await authResponse.json();
    if (!authResponse.ok)
      throw new Error(auth.error || "Unable to authorize upload.");
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    form.append("folder", "/evervora/products");
    form.append("useUniqueFileName", "true");
    for (const key of ["token", "expire", "signature", "publicKey"])
      form.append(key, String(auth[key]));
    return new Promise<ProductImage>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
      xhr.timeout = 120000;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onerror = () =>
        reject(new Error("Upload failed. Check your connection and retry."));
      xhr.ontimeout = () =>
        reject(new Error("Upload timed out. Please retry."));
      xhr.onload = () => {
        try {
          const result = JSON.parse(xhr.responseText);
          if (
            xhr.status < 200 ||
            xhr.status >= 300 ||
            !result.fileId ||
            !result.url
          )
            reject(new Error(result.message || "Upload failed."));
          else resolve({ fileId: result.fileId, url: result.url, position: 0 });
        } catch {
          reject(new Error("Invalid upload response. Please retry."));
        }
      };
      xhr.send(form);
    });
  }
  async function upload(files: File[]) {
    if (demo || uploading) return;
    if (images.length + files.length > 5) {
      setError("You can add up to five photos.");
      return;
    }
    setUploading(true);
    setError("");
    setFailedFile(null);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadLabel(`Uploading ${file.name}`);
      setProgress(0);
      try {
        const image = await uploadFile(file);
        setImages((current) => [...current, image]);
      } catch (e) {
        setError(
          `${e instanceof Error ? e.message : "Upload failed."}${files.length > i + 1 ? " The remaining photos were not uploaded; select them again after retrying." : ""}`,
        );
        setFailedFile(file);
        break;
      }
    }
    setUploading(false);
  }
  function move(index: number, direction: number) {
    setImages((current) => {
      const next = [...current];
      [next[index], next[index + direction]] = [
        next[index + direction],
        next[index],
      ];
      return next;
    });
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      try {
        const result = await saveProduct({
          id: product?.id,
          name,
          description,
          categoryId,
          images: images.map((i, index) => ({ ...i, position: index })),
          available,
          published,
          featured,
        });
        if (result.error) setError(result.error);
        else {
          toast.success("Product saved.");
          router.push("/admin");
          router.refresh();
        }
      } catch {
        setError("Could not save. Your changes are still here; try again.");
      }
    });
  }
  return (
    <>
      <Link
        href="/admin"
        className="text-sm text-muted-foreground hover:underline"
      >
        Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        {product ? "Edit product" : "Add a new find"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Add photos and the details customers need to know.
      </p>
      <form
        onSubmit={submit}
        className="mt-7 grid gap-6 xl:grid-cols-[1.6fr_1fr]"
      >
        <div className="grid gap-6">
          <Card className="shadow-none">
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Product name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder="e.g. Wireless earbuds"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!categories.length && (
                  <Link
                    className="text-sm text-primary"
                    href="/admin/categories"
                  >
                    Add a category first
                  </Link>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={5}
                  maxLength={5000}
                  rows={7}
                  placeholder="Describe the product. Include available sizes, colours or specifications."
                />
                <p className="text-xs text-muted-foreground">
                  Prices are discussed directly with customers on WhatsApp.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <Label>Product photos</Label>
                <span className="text-xs text-muted-foreground">
                  {images.length}/5 photos
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((photo, i) => (
                  <div
                    key={photo.fileId}
                    className="relative overflow-hidden rounded-xl border"
                  >
                    <ProductPhoto
                      src={photo.url}
                      alt={`Product photo ${i + 1}`}
                      className="aspect-square"
                      sizes="200px"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7"
                      disabled={uploading}
                      aria-label={`Remove photo ${i + 1}`}
                      onClick={() =>
                        setImages((current) =>
                          current.filter((_, index) => index !== i),
                        )
                      }
                    >
                      <X size={14} />
                    </Button>
                    <div className="flex flex-wrap items-center justify-between gap-1 px-2 py-1">
                      <span className="text-xs">
                        {i === 0 ? "Cover photo" : `Photo ${i + 1}`}
                      </span>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={i === 0 || uploading}
                          aria-label={`Move photo ${i + 1} earlier`}
                          onClick={() => move(i, -1)}
                        >
                          <ChevronLeft size={14} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={i === images.length - 1 || uploading}
                          aria-label={`Move photo ${i + 1} later`}
                          onClick={() => move(i, 1)}
                        >
                          <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={demo || uploading || images.length >= 5}
                  onClick={() => photoInput.current?.click()}
                >
                  <Upload size={17} />
                  Choose photos
                </Button>
                <Input
                  id="photo-files"
                  ref={photoInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  disabled={demo || uploading || images.length >= 5}
                  onChange={(e) => {
                    void upload(Array.from(e.target.files ?? []));
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={demo || uploading || images.length >= 5}
                  onClick={() => cameraInput.current?.click()}
                >
                  <Camera size={17} />
                  Take a photo
                </Button>
                <Input
                  id="camera-photo"
                  ref={cameraInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="hidden"
                  disabled={demo || uploading || images.length >= 5}
                  onChange={(e) => {
                    void upload(Array.from(e.target.files ?? []));
                    e.target.value = "";
                  }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                JPG, PNG or WebP, up to 10 MB each. The first photo is the
                cover.
              </p>
              {uploading && (
                <div role="status" className="mt-4">
                  <p className="mb-2 text-xs">
                    {uploadLabel} · {progress}%
                  </p>
                  <Progress value={progress} />
                </div>
              )}
              {failedFile && !uploading && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 h-auto min-h-11 max-w-full whitespace-normal break-all py-2"
                  onClick={() => void upload([failedFile])}
                >
                  Retry {failedFile.name}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-none">
            <CardContent className="grid gap-6">
              {[
                {
                  id: "published",
                  title: "Publish in shop",
                  detail: "Turn off to keep this product as a draft.",
                  value: published,
                  set: setPublished,
                },
                {
                  id: "available",
                  title: "Available",
                  detail: "Turn off to display a sold-out badge.",
                  value: available,
                  set: setAvailable,
                },
                {
                  id: "featured",
                  title: "Feature this product",
                  detail: "Show it among the homepage favourites.",
                  value: featured,
                  set: setFeatured,
                },
              ].map((option) => (
                <div key={option.id} className="flex justify-between gap-4">
                  <div>
                    <Label htmlFor={option.id}>{option.title}</Label>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {option.detail}
                    </p>
                  </div>
                  <Switch
                    id={option.id}
                    checked={option.value}
                    onCheckedChange={option.set}
                  />
                </div>
              ))}
              <div className="border-t pt-5">
                {error && (
                  <p role="alert" className="mb-4 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={demo || pending || uploading || !categories.length}
                  className="w-full"
                >
                  {pending ? (
                    <LoaderCircle className="animate-spin" size={17} />
                  ) : (
                    <Plus size={17} />
                  )}{" "}
                  {pending ? "Saving…" : "Save product"}
                </Button>
                {demo && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Saving is disabled in this read-only preview.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  );
}
