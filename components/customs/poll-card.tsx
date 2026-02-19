"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Power,
  PowerOff,
  Copy,
  Check,
  Users,
  QrCode,
  Download,
} from "lucide-react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { togglePollStatus } from "@/actions/poll/togglePollStatus";
import type { PollWithDetails } from "@/actions/poll/getAllPolls";

interface PollCardProps {
  poll: PollWithDetails;
}

export function PollCard({ poll: initialPoll }: PollCardProps) {
  const [poll, setPoll] = useState(initialPoll);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const pollUrl = `${
    process.env.NEXT_PUBLIC_HOST ??
    (typeof window !== "undefined" ? window.location.origin : "")
  }/poll/${poll.shortId}`;

  const optionA = poll.options[0];
  const optionB = poll.options[1];
  const totalVotes = poll._count.votes;

  const votesA = poll.votes.filter((v) => v.option.position === "A").length;
  const votesB = poll.votes.filter((v) => v.option.position === "B").length;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 0;
  const pctB = totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : 0;

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await togglePollStatus(poll.id);
      if ("error" in res) {
        toast.error(res.error ?? "Something went wrong");
        return;
      }
      setPoll((prev) => ({ ...prev, active: res.poll.active }));
      toast.success(res.poll.active ? "Poll activated" : "Poll disabled");
    } finally {
      setToggling(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(poll.shortId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pollUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `poll-${poll.shortId}.png`;
    a.click();
  };

  return (
    <Card className={cn(!poll.active && "opacity-60")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={poll.active ? "default" : "secondary"}>
              {poll.active ? "Active" : "Disabled"}
            </Badge>

            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              {copied ? (
                <Check className="size-3 text-green-500" />
              ) : (
                <Copy className="size-3" />
              )}
              {poll.shortId}
            </button>

            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <QrCode className="size-3" />
              QR
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Users className="size-3" />
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="size-5">
            <AvatarImage src={poll.creator.image ?? ""} />
            <AvatarFallback className="text-[10px]">
              {poll.creator.login[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {poll.creator.name ?? poll.creator.login}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(poll.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { option: optionA, votes: votesA, pct: pctA, label: "A" },
            { option: optionB, votes: votesB, pct: pctB, label: "B" },
          ].map(({ option, votes, pct, label }) => (
            <div key={option.id} className="space-y-2">
              <div className="relative aspect-video rounded-md overflow-hidden border">
                <Image
                  src={option.cover}
                  alt={option.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-semibold leading-tight line-clamp-1">
                    {option.name}
                  </p>
                </div>
                <Badge className="absolute top-2 left-2 text-[10px] px-1.5 py-0">
                  {label}
                </Badge>
              </div>

              {option.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {option.description}
                </p>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {votes} vote{votes !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Voter avatars */}
        {poll.votes.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Voters</p>
            <div className="flex flex-wrap gap-1">
              {poll.votes.map((vote) => (
                <div
                  key={vote.id}
                  className="flex items-center gap-1.5 bg-muted rounded-full pl-0.5 pr-2 py-0.5"
                  title={`${vote.user?.login ?? "unknown"} → Option ${vote.option.position}`}
                >
                  <Avatar className="size-5">
                    <AvatarImage src={vote.user?.image ?? ""} />
                    <AvatarFallback className="text-[9px]">
                      {(vote.user?.login?.[0] ?? "?").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{vote.user?.login ?? "?"}</span>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1 py-0 h-4 leading-none"
                  >
                    {vote.option.position}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end pt-3">
        <Button
          variant={poll.active ? "destructive" : "outline"}
          size="sm"
          onClick={handleToggle}
          disabled={toggling}
        >
          {poll.active ? (
            <>
              <PowerOff className="size-4" />
              {toggling ? "Disabling…" : "Disable"}
            </>
          ) : (
            <>
              <Power className="size-4" />
              {toggling ? "Activating…" : "Activate"}
            </>
          )}
        </Button>
      </CardFooter>

      {/* QR Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Share poll</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div ref={qrRef} className="rounded-xl border p-3 bg-white">
              <QRCodeCanvas value={pollUrl} size={200} />
            </div>
            <div className="w-full space-y-1.5">
              <p className="text-xs text-muted-foreground">Poll link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted rounded px-2 py-1.5 truncate">
                  {pollUrl}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  {linkCopied ? (
                    <Check className="size-3.5 text-green-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadQr}
            >
              <Download className="size-4" />
              Download QR (.png)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
