import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Image as ImageIcon,
  Link2,
  ShieldCheck,
  Trophy,
  User,
} from "lucide-react";

const FEATURES = [
  {
    title: "Edit Profile & Cover",
    description:
      "Update your profile picture and cover image directly from the intra experience.",
    icon: User,
  },
  {
    title: "Add Social Links",
    description:
      "Show your GitHub, LinkedIn, and other links in one clean place.",
    icon: Link2,
  },
  {
    title: "User Rank + All Ranks",
    description: "Instantly see any user’s rank and browse all users ranks.",
    icon: Trophy,
  },
  {
    title: "Pomodoro Timer",
    description: "Stay focused on the intra with a built‑in Pomodoro timer.",
    icon: Clock,
  },
  {
    title: "Quran Verses",
    description: "Lightweight verse reminders while you browse.",
    icon: ShieldCheck,
  },
];

const VERSES = [
  {
    ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    en: "Indeed, with hardship comes ease.",
    ref: "Ash-Sharh 94:5",
  },
  {
    ar: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    en: "And say: My Lord, increase me in knowledge.",
    ref: "Ta-Ha 20:114",
  },
  {
    ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    en: "Indeed, Allah is with the patient.",
    ref: "Al-Baqarah 2:153",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-16">
        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Chrome Extension</Badge>
            <Badge variant="outline">1337</Badge>
            <Badge variant="outline">IMPROVED INTRA</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                1337 IMPROVED INTRA
              </h1>
              <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
                A Chrome extension that upgrades the intra with profile editing,
                ranks, productivity tools, and lightweight spiritual reminders.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/login">Get started</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/(protected)/preference">Preferences</Link>
                </Button>
              </div>
            </div>

            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">What you get</p>
                  <p className="text-lg font-medium">Fast, clean, useful</p>
                </div>
                <Badge variant="secondary">MVP</Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span>Ranks & leaderboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Pomodoro focus timer</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Profile & cover editing</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span>Quran verse reminders</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-10 md:my-12" />

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
            <p className="text-muted-foreground">
              Built to make the intra more useful — without clutter.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md border p-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{f.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <Separator className="my-10 md:my-12" />

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Pomodoro on the intra</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A simple focus timer that lives where you work.
              </p>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Focus</p>
                <p className="text-lg font-medium">25m</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Break</p>
                <p className="text-lg font-medium">5m</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Long</p>
                <p className="text-lg font-medium">15m</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Quran verses</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A few gentle reminders — you can swap these anytime.
              </p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              {VERSES.map((v) => (
                <div key={v.ref} className="rounded-md border p-3">
                  <p className="text-base font-medium" dir="rtl" lang="ar">
                    {v.ar}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{v.en}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{v.ref}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Separator className="my-10 md:my-12" />

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Screenshots
            </h2>
            <p className="text-muted-foreground">
              Placeholders for your extension screenshots.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card
                key={n}
                className="flex min-h-[180px] items-center justify-center p-6"
              >
                <div className="text-center text-sm text-muted-foreground">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-md border">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <p className="font-medium">Screenshot {n}</p>
                  <p className="text-xs">Drop your image here later</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-10 md:my-12" />

        <section className="rounded-lg border p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ready to try it?</p>
              <p className="text-xl font-semibold">Improve your intra today</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/(protected)/book-gym">Book gym</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
