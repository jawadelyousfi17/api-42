"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

import Lottie from "lottie-react";
import animationData from "@/public/animations/user.json";
import { loginAction } from "@/actions/auth/login";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    await loginAction();
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="leading-tight">
                <p className="text-xl font-semibold ">1337 IMPROVED INTRA</p>
                <p className="text-xs text-muted-foreground">
                  Sign in with your Intra account
                </p>
              </div>
            </div>

            <Button
              disabled={loading}
              className="flex items-center px-10 h-12 rounded-full gap-4"
              variant="outline"
              onClick={handleLogin}
            >
              {<img src={"/icons/42_logo.png"} className="w-6" />}
              Login with Intra
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex"></div>
      </div>
    </div>
  );
}
