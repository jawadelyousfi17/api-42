"use client";

import { updatePreferences } from "@/actions/user/updatePreferences";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IntraUser, Preferences } from "@/lib/generated/prisma";
import {
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Twitter,
  Upload,
  User,
  Image as ImageIcon,
} from "lucide-react";
import Cropper, { Area } from "react-easy-crop";
import { motion } from "framer-motion";
import { useEffect, useMemo, useTransition, useState } from "react";
import toast from "react-hot-toast";

type UserWithPreferences = IntraUser & {
  preferences: Preferences[];
};

type PreferencesFormProps = {
  user: UserWithPreferences;
};

export default function PreferencesForm({ user }: PreferencesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    user?.cover || null
  );

  const [croppedAvatarFile, setCroppedAvatarFile] = useState<File | null>(null);
  const [croppedCoverFile, setCroppedCoverFile] = useState<File | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<"avatar" | "cover" | null>(null);
  const [cropSourceUrl, setCropSourceUrl] = useState<string | null>(null);
  const [cropSourceFile, setCropSourceFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const cropAspect = useMemo(() => {
    if (cropTarget === "avatar") return 1;
    if (cropTarget === "cover") return 20 / 9;
    return 1;
  }, [cropTarget]);

  const preferences = user?.preferences?.[0] || {};
  let socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  } = {};
  try {
    socialLinks = user?.socialLinks ? JSON.parse(user.socialLinks) : {};
  } catch (e) {
    console.error("Failed to parse social links", e);
  }

  const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return false;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image is too large (max 6MB)");
      return false;
    }
    return true;
  };

  const closeCropper = () => {
    setCropOpen(false);
    setCropTarget(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    if (cropSourceUrl) {
      URL.revokeObjectURL(cropSourceUrl);
    }
    setCropSourceUrl(null);
    setCropSourceFile(null);
  };

  useEffect(() => {
    return () => {
      if (cropSourceUrl) URL.revokeObjectURL(cropSourceUrl);
    };
  }, [cropSourceUrl]);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedBlob = async (imageSrc: string, area: Area) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(area.width));
    canvas.height = Math.max(1, Math.floor(area.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.drawImage(
      image,
      area.x,
      area.y,
      area.width,
      area.height,
      0,
      0,
      area.width,
      area.height
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to crop image"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.92
      );
    });
  };

  const openCropperForFile = (
    target: "avatar" | "cover",
    file: File,
    input: HTMLInputElement
  ) => {
    const url = URL.createObjectURL(file);
    setCropTarget(target);
    setCropSourceFile(file);
    setCropSourceUrl(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropOpen(true);
    input.value = "";
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) {
      e.target.value = "";
      return;
    }
    openCropperForFile("avatar", file, e.target);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) {
      e.target.value = "";
      return;
    }
    openCropperForFile("cover", file, e.target);
  };

  const handleSubmit = async (formData: FormData) => {
    const nextFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (key === "avatar" || key === "cover") continue;
      nextFormData.append(key, value);
    }

    const originalAvatar = formData.get("avatar");
    const originalCover = formData.get("cover");

    if (croppedAvatarFile) {
      nextFormData.append("avatar", croppedAvatarFile);
    } else if (originalAvatar instanceof File && originalAvatar.size > 0) {
      nextFormData.append("avatar", originalAvatar);
    }

    if (croppedCoverFile) {
      nextFormData.append("cover", croppedCoverFile);
    } else if (originalCover instanceof File && originalCover.size > 0) {
      nextFormData.append("cover", originalCover);
    }

    startTransition(async () => {
      try {
        await updatePreferences(nextFormData);
        toast.success("Preferences updated successfully");
      } catch (error) {
        toast.error("Failed to update preferences");
      }
    });
  };

  const fadeUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const softHover = {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 },
  };

  return (
    <motion.form
      action={handleSubmit}
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <fieldset
        disabled={isPending}
        aria-busy={isPending}
        className="grid gap-8 md:grid-cols-[1fr_320px] disabled:opacity-70"
      >
        <div className="md:col-span-2 flex items-center justify-end">
          <motion.div {...softHover}>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </motion.div>
        </div>
        <div className="space-y-6">
          {/* Profile & Cover Section */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card>
              <CardContent className="space-y-6">
                {/* Cover Image */}
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <motion.div
                    className="relative group rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 focus-within:border-primary/50 transition-colors"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="aspect-20/9 w-full bg-muted relative">
                      {coverPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <motion.img
                          src={coverPreview}
                          alt="Cover"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0.6 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center">
                        <Label
                          htmlFor="cover-upload"
                          className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm font-medium shadow-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Change Cover
                        </Label>
                      </div>
                    </div>
                    <input
                      id="cover-upload"
                      name="cover"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
                      aria-describedby="cover-help"
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Cropped to 20:9. PNG/JPG.
                  </p>
                  <p id="cover-help" className="sr-only">
                    Upload a cover image (image file, up to 6MB).
                  </p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-sm bg-muted relative">
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <motion.img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0.6 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <Label
                          htmlFor="avatar-upload"
                          className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary p-2 text-primary-foreground shadow-sm"
                        >
                          <Upload className="w-4 h-4" />
                        </Label>
                      </div>
                    </div>
                    <input
                      id="avatar-upload"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      aria-describedby="avatar-help"
                    />
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG or GIF. Max 6MB.
                    </p>
                    <p id="avatar-help" className="sr-only">
                      Upload a profile image (image file, up to 6MB).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Links Section */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Add usernames or profile URLs.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <div className="relative">
                    <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="github"
                      name="github"
                      defaultValue={socialLinks.github || ""}
                      placeholder="username"
                      className="pl-9"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      name="linkedin"
                      defaultValue={socialLinks.linkedin || ""}
                      placeholder="username"
                      className="pl-9"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="relative">
                    <Twitter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="twitter"
                      name="twitter"
                      defaultValue={socialLinks.twitter || ""}
                      placeholder="username"
                      className="pl-9"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="instagram"
                      name="instagram"
                      defaultValue={socialLinks.instagram || ""}
                      placeholder="username"
                      className="pl-9"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preferences Sidebar */}
        <motion.div
          className="space-y-6 md:sticky md:top-24 self-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your dashboard settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  {
                    key: "changeProfile",
                    label: "Change Profile",
                    desc: "Allow changing profile details",
                    default: true,
                  },
                  {
                    key: "changeCover",
                    label: "Change Cover",
                    desc: "Allow changing cover image",
                    default: true,
                  },
                  {
                    key: "showQuranInFullScreen",
                    label: "Full Screen Quran",
                    desc: "Show Quran in full screen mode",
                    default: false,
                  },
                  {
                    key: "showQuranWidget",
                    label: "Quran Widget",
                    desc: "Display the Quran widget",
                    default: true,
                  },
                  {
                    key: "showRanking",
                    label: "Show Ranking",
                    desc: "Display user rankings",
                    default: true,
                  },
                  {
                    key: "showPomodor",
                    label: "Pomodoro Timer",
                    desc: "Enable Pomodoro timer",
                    default: true,
                  },
                  {
                    key: "showNotes",
                    label: "Show Notes",
                    desc: "Enable personal notes",
                    default: true,
                  },
                ] as const
              ).map((item, index, array) => (
                <div key={item.key} className="space-y-4">
                  <motion.div
                    className="flex items-start justify-between gap-4 rounded-md"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex flex-col space-y-1">
                      <Label
                        htmlFor={item.key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      id={item.key}
                      name={item.key}
                      defaultChecked={
                        (preferences as any)[item.key] ?? item.default
                      }
                    />
                  </motion.div>

                  {index < array.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <motion.div {...softHover} className="w-full">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isPending ? "Saving Changes..." : "Save Changes"}
                </Button>
              </motion.div>
              <p className="text-xs text-muted-foreground text-center">
                Changes apply to your dashboard experience.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </fieldset>

      <Dialog
        open={cropOpen}
        onOpenChange={(open) => (!open ? closeCropper() : null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {cropTarget === "cover"
                ? "Crop cover (20:9)"
                : "Crop profile photo (1:1)"}
            </DialogTitle>
            <DialogDescription>
              Drag to reposition and use the zoom slider to fit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative h-[360px] w-full overflow-hidden rounded-md bg-muted">
              {cropSourceUrl ? (
                <Cropper
                  image={cropSourceUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={cropAspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels) =>
                    setCroppedAreaPixels(areaPixels)
                  }
                  cropShape={cropTarget === "avatar" ? "round" : "rect"}
                  showGrid={cropTarget !== "avatar"}
                />
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="crop-zoom">Zoom</Label>
                <span className="text-xs text-muted-foreground">
                  {zoom.toFixed(2)}x
                </span>
              </div>
              <input
                id="crop-zoom"
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeCropper}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                try {
                  if (!cropTarget || !cropSourceUrl || !croppedAreaPixels) {
                    toast.error("Please finish cropping first");
                    return;
                  }

                  const blob = await getCroppedBlob(
                    cropSourceUrl,
                    croppedAreaPixels
                  );
                  const baseName =
                    cropSourceFile?.name?.replace(/\.[^/.]+$/, "") ||
                    cropTarget;
                  const file = new File([blob], `${baseName}.jpg`, {
                    type: "image/jpeg",
                  });

                  const previewUrl = URL.createObjectURL(file);
                  if (cropTarget === "avatar") {
                    if (avatarPreview?.startsWith("blob:"))
                      URL.revokeObjectURL(avatarPreview);
                    setAvatarPreview(previewUrl);
                    setCroppedAvatarFile(file);
                  } else {
                    if (coverPreview?.startsWith("blob:"))
                      URL.revokeObjectURL(coverPreview);
                    setCoverPreview(previewUrl);
                    setCroppedCoverFile(file);
                  }

                  closeCropper();
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to crop image");
                }
              }}
            >
              Apply crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.form>
  );
}
