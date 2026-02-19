"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, User } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadAvatar } from "@/actions/file/imageUpload";
import { getUserByLogin } from "@/actions/42/getUserByLogin";

type Tab = "upload" | "login";

interface CoverPickerProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
}

export function CoverPicker({
  label = "Cover",
  value,
  onChange,
}: CoverPickerProps) {
  const [tab, setTab] = useState<Tab>("upload");
  const [uploading, setUploading] = useState(false);
  const [loginQuery, setLoginQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Upload tab ─────────────────────────────────────────────── */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadAvatar(file);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      onChange(res.url!);
      toast.success("Image uploaded");
    } finally {
      setUploading(false);
      // reset so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* ── 42 Login tab ───────────────────────────────────────────── */
  const handleLoginSearch = async () => {
    const login = loginQuery.trim();
    if (!login) return;

    setSearching(true);
    try {
      const result = await getUserByLogin(login);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if (!result.avatar) {
        toast.error("User has no avatar");
        return;
      }

      onChange(result.avatar);
      toast.success(`Got avatar for ${result.login}`);
    } catch {
      toast.error("Failed to fetch user");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-md border p-1 w-fit">
        {(["upload", "login"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              tab === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "upload" ? "Upload image" : "42 Login"}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center w-full h-28 rounded-md border border-dashed gap-2 text-sm text-muted-foreground transition-colors",
              "hover:border-ring hover:text-foreground",
              "disabled:opacity-50 disabled:pointer-events-none",
            )}
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Upload className="size-5" />
            )}
            <span>{uploading ? "Uploading…" : "Click to upload an image"}</span>
          </button>
        </div>
      )}

      {/* 42 Login tab */}
      {tab === "login" && (
        <div className="flex gap-2">
          <Input
            placeholder="ex: jdoe"
            value={loginQuery}
            onChange={(e) => setLoginQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLoginSearch();
              }
            }}
            disabled={searching}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoginSearch}
            disabled={searching || !loginQuery.trim()}
          >
            {searching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <User className="size-4" />
            )}
            {searching ? "Searching…" : "Search"}
          </Button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative group w-fit">
          <Image
            src={value}
            alt="cover preview"
            width={128}
            height={128}
            className="rounded-md object-cover aspect-square border"
            unoptimized
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-xs px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
