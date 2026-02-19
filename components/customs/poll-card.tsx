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
  Share2,
  Download,
  Trash,
  ExternalLink,
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
import { deletePoll } from "@/actions/poll/deletePoll";
import type { PollWithDetails } from "@/actions/poll/getAllPolls";

interface PollCardProps {
  poll: PollWithDetails;
}

export function PollCard({ poll: initialPoll }: PollCardProps) {
  const [poll, setPoll] = useState(initialPoll);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [voteLinkCopied, setVoteLinkCopied] = useState(false);
  const [resultsLinkCopied, setResultsLinkCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_HOST ??
    (typeof window !== "undefined" ? window.location.origin : "");
  const pollUrl = `${baseUrl}/poll/${poll.shortId}`;
  const resultsUrl = `${baseUrl}/anonymous-results/${poll.shortId}`;

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

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this poll? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await deletePoll(poll.id);
      if (res && "error" in res) {
        toast.error(res.error ?? "Something went wrong");
        return;
      }
      toast.success("Poll deleted successfully");
    } catch (e) {
      toast.error("Failed to delete poll");
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyVoteLink = () => {
    navigator.clipboard.writeText(pollUrl);
    setVoteLinkCopied(true);
    setTimeout(() => setVoteLinkCopied(false), 2000);
  };

  const handleCopyResultsLink = () => {
    navigator.clipboard.writeText(resultsUrl);
    setResultsLinkCopied(true);
    setTimeout(() => setResultsLinkCopied(false), 2000);
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
      <CardHeader className="pb-3 space-y-2">
        <h3 className="font-semibold text-lg leading-tight">{poll.name}</h3>

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={poll.active ? "default" : "secondary"}>
              {poll.active ? "Active" : "Disabled"}
            </Badge>

            <button
              type="button"
              onClick={() => window.open(resultsUrl, "_blank")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="size-3" />
              Open
            </button>

            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="size-3" />
              Share
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

      <CardFooter className="flex justify-between pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={deleting || toggling}
        >
          {deleting ? (
            <span className="animate-pulse">Deleting…</span>
          ) : (
            <>
              <Trash className="size-4 mr-1.5" />
              Delete
            </>
          )}
        </Button>
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

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share poll</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Vote Link */}
            <div className="w-full space-y-2">
              <p className="text-sm font-medium">Vote Link</p>
              <p className="text-xs text-muted-foreground">
                Share this link for people to vote
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted rounded px-3 py-2 truncate">
                  {pollUrl}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyVoteLink}
                  title="Copy vote link"
                >
                  {voteLinkCopied ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Anonymous Results Link */}
            <div className="w-full space-y-2">
              <p className="text-sm font-medium">Anonymous Results Link</p>
              <p className="text-xs text-muted-foreground">
                Share results without revealing voter identities
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted rounded px-3 py-2 truncate">
                  {resultsUrl}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyResultsLink}
                  title="Copy results link"
                >
                  {resultsLinkCopied ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code */}
            <div className="w-full space-y-2">
              <p className="text-sm font-medium">QR Code (Vote Link)</p>
              <div className="flex flex-col items-center gap-3">
                <div
                  ref={qrRef}
                  className="rounded-xl border p-3 bg-white dark:bg-slate-50"
                >
                  <QRCodeCanvas value={pollUrl} size={180} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleDownloadQr}
                >
                  <Download className="size-4" />
                  Download QR (.png)
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
