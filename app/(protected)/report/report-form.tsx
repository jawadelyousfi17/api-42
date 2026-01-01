"use client";

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
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ReportForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 1200);
    });

    toast.success("Bug report submitted");
    formRef.current?.reset();
    setIsSubmitting(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <fieldset disabled={isSubmitting} aria-busy={isSubmitting}>
        <Card>
          <CardHeader>
            <CardTitle>Report a bug</CardTitle>
            <CardDescription>
              Help us fix issues faster by sharing details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Short summary (e.g. Booking page crashes)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Steps to reproduce</Label>
              <textarea
                id="steps"
                name="steps"
                placeholder="1) ...\n2) ...\n3) ..."
                required
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  "min-h-28 resize-y"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">What happened?</Label>
              <textarea
                id="details"
                name="details"
                placeholder="What did you expect, and what actually happened?"
                required
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  "min-h-32 resize-y"
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit report
            </Button>
          </CardFooter>
        </Card>
      </fieldset>
    </form>
  );
}
