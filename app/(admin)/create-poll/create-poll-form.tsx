"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createPoll } from "@/actions/poll/createPoll";
import { CoverPicker } from "@/components/customs/cover-picker";

export default function CreatePollForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdShortId, setCreatedShortId] = useState<string | null>(null);
  const [coverA, setCoverA] = useState("");
  const [coverB, setCoverB] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const name = String(formData.get("name") ?? "").trim();

      const optionA = {
        name: String(formData.get("optionA_name") ?? "").trim(),
        cover: coverA,
        description: String(formData.get("optionA_description") ?? "").trim(),
      };

      const optionB = {
        name: String(formData.get("optionB_name") ?? "").trim(),
        cover: coverB,
        description: String(formData.get("optionB_description") ?? "").trim(),
      };

      if (!name) {
        toast.error("Poll name is required");
        setIsSubmitting(false);
        return;
      }

      if (!optionA.cover) {
        toast.error("Option A needs a cover image");
        setIsSubmitting(false);
        return;
      }
      if (!optionB.cover) {
        toast.error("Option B needs a cover image");
        setIsSubmitting(false);
        return;
      }

      const res = await createPoll({
        name,
        optionA: {
          name: optionA.name,
          cover: optionA.cover,
          description: optionA.description || undefined,
        },
        optionB: {
          name: optionB.name,
          cover: optionB.cover,
          description: optionB.description || undefined,
        },
      });

      if ("error" in res) {
        toast.error(res.error ?? "Failed to create poll");
        setIsSubmitting(false);
        return;
      }

      toast.success("Poll created");
      setCreatedShortId(res.poll.shortId);
      setCoverA("");
      setCoverB("");
      formRef.current?.reset();
    } catch (e) {
      toast.error("Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <fieldset disabled={isSubmitting} aria-busy={isSubmitting}>
        <Card>
          <CardHeader>
            <CardTitle>Create poll</CardTitle>
            <CardDescription>
              Create a poll with 2 options. After creation you will get a short
              shareable id.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Poll Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="E.g. Who is the best football player?"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="text-sm font-medium">Option A</div>

                <div className="space-y-2">
                  <Label htmlFor="optionA_name">Name</Label>
                  <Input
                    id="optionA_name"
                    name="optionA_name"
                    placeholder="Option name"
                    required
                  />
                </div>

                <CoverPicker
                  label="Cover"
                  value={coverA}
                  onChange={setCoverA}
                />

                <div className="space-y-2">
                  <Label htmlFor="optionA_description">
                    Description (optional)
                  </Label>
                  <textarea
                    id="optionA_description"
                    name="optionA_description"
                    placeholder="Write a short description..."
                    className={cn(
                      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      "min-h-24 resize-y",
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium">Option B</div>

                <div className="space-y-2">
                  <Label htmlFor="optionB_name">Name</Label>
                  <Input
                    id="optionB_name"
                    name="optionB_name"
                    placeholder="Option name"
                    required
                  />
                </div>

                <CoverPicker
                  label="Cover"
                  value={coverB}
                  onChange={setCoverB}
                />

                <div className="space-y-2">
                  <Label htmlFor="optionB_description">
                    Description (optional)
                  </Label>
                  <textarea
                    id="optionB_description"
                    name="optionB_description"
                    placeholder="Write a short description..."
                    className={cn(
                      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      "min-h-24 resize-y",
                    )}
                  />
                </div>
              </div>
            </div>

            {createdShortId && (
              <div className="rounded-md border px-4 py-3">
                <div className="text-sm text-muted-foreground">
                  Share this poll id
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {createdShortId}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create poll"}
            </Button>
          </CardFooter>
        </Card>
      </fieldset>
    </form>
  );
}
