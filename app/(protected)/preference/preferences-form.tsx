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
import { useTransition, useState } from "react";
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

  const setImagePreviewFromFile = async (
    file: File,
    setPreview: (value: string) => void
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) {
      e.target.value = "";
      return;
    }
    void setImagePreviewFromFile(file, (value) => setAvatarPreview(value));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) {
      e.target.value = "";
      return;
    }
    void setImagePreviewFromFile(file, (value) => setCoverPreview(value));
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updatePreferences(formData);
        toast.success("Preferences updated successfully");
      } catch (error) {
        toast.error("Failed to update preferences");
      }
    });
  };

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <fieldset
        disabled={isPending}
        aria-busy={isPending}
        className="grid gap-8 md:grid-cols-[1fr_320px] disabled:opacity-70"
      >
        <div className="md:col-span-2 flex items-center justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
        <div className="space-y-6">
          {/* Profile & Cover Section */}
          <Card>
            <CardContent className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="relative group rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 focus-within:border-primary/50 transition-colors">
                  <div className="aspect-3/1 w-full bg-muted relative">
                    {coverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverPreview}
                        alt="Cover"
                        className="w-full h-full object-cover"
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
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: wide image (3:1). PNG/JPG.
                </p>
                <p id="cover-help" className="sr-only">
                  Upload a cover image (image file, up to 2MB).
                </p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-sm bg-muted relative">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
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
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG or GIF. Max 6MB.
                  </p>
                  <p id="avatar-help" className="sr-only">
                    Upload a profile image (image file, up to 2MB).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Add usernames or profile URLs.</CardDescription>
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
        </div>

        {/* Preferences Sidebar */}
        <div className="space-y-6 md:sticky md:top-24 self-start">
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
                  <div className="flex items-start justify-between gap-4">
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
                  </div>

                  {index < array.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving Changes..." : "Save Changes"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Changes apply to your dashboard experience.
              </p>
            </CardFooter>
          </Card>
        </div>
      </fieldset>
    </form>
  );
}
