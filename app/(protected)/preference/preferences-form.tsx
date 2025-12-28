"use client";

import { updatePreferences } from "@/actions/user/updatePreferences";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    <form action={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {/* Profile & Cover Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Appearance</CardTitle>
              <CardDescription>
                Customize how your profile looks to others.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="relative group rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                  <div className="aspect-[3/1] w-full bg-muted relative">
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
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Label
                        htmlFor="cover-upload"
                        className="cursor-pointer flex items-center gap-2 text-white font-medium hover:underline"
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
                  />
                </div>
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
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer p-2 text-white"
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
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Connect your social media accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </Label>
                <Input
                  id="github"
                  name="github"
                  defaultValue={socialLinks.github || ""}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  defaultValue={socialLinks.linkedin || ""}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" /> Twitter
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  defaultValue={socialLinks.twitter || ""}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" /> Instagram
                </Label>
                <Input
                  id="instagram"
                  name="instagram"
                  defaultValue={socialLinks.instagram || ""}
                  placeholder="username"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preferences Sidebar */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your dashboard settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
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
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between space-x-2"
                >
                  <div className="flex flex-col space-y-1">
                    <Label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    id={item.key}
                    name={item.key}
                    defaultChecked={
                      (preferences as any)[item.key] ?? item.default
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
