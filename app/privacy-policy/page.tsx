import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy — Intra Enhanced [1337] (beta)",
  description: "Privacy Policy for Intra Enhanced [1337] (beta)",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:py-16">
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Privacy Policy — Intra Enhanced [1337] (beta)
            </h1>
            <p className="text-sm text-muted-foreground">
              Effective date: January 1, 2026
            </p>
            <p className="text-muted-foreground">
              This Privacy Policy explains what data the “Intra Enhanced [1337]
              (beta)” Chrome extension (“Extension”) processes, why it’s
              processed, and how it’s handled.
            </p>
          </header>

          <Card className="p-6">
            <div className="space-y-8">
              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  1) Summary
                </h2>
                <p className="text-sm text-muted-foreground">
                  The Extension enhances the 42 Intra website by adding profile
                  customization and productivity features. To work, it may
                  authenticate you via 42 OAuth and call the 42 API and a
                  companion backend service. The Extension stores settings and
                  session tokens in your browser’s extension storage.
                </p>
              </section>

              <Separator />

              <section className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight">
                  2) Data the Extension processes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Depending on which features you use, the Extension may
                  process:
                </p>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">
                    A. Authentication data (42 OAuth)
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>
                      OAuth authorization code (temporary, used during login)
                    </li>
                    <li>
                      OAuth access token and refresh token (used to access the
                      42 API on your behalf)
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">
                    B. 42 account/profile data (from the 42 API)
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>
                      Your 42 login/username and basic profile data returned by
                      the API (e.g., display name, avatar URL, campus/pool year
                      when needed by features)
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">
                    C. Preferences and local feature data (stored in extension
                    storage)
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>
                      Feature toggles / preferences (e.g., show ranking, show
                      Quran widget, theme)
                    </li>
                    <li>Pomodoro state and settings</li>
                    <li>
                      Sticky note content (what you type into the sticky note)
                    </li>
                    <li>
                      Quran widget settings / cached verse data (if applicable)
                    </li>
                    <li>
                      Cached user/profile customization data used to render your
                      chosen look faster
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">
                    D. Network/technical data
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Like most web requests, the services you contact (42 API,
                    backend, Google Fonts) may receive standard request metadata
                    such as your IP address and user-agent as part of normal
                    internet communications.
                  </p>
                </div>
              </section>

              <Separator />

              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  3) How we use this data
                </h2>
                <p className="text-sm text-muted-foreground">
                  We use the data only to provide the Extension’s functionality,
                  for example:
                </p>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                  <li>Authenticate you and keep you signed in (tokens)</li>
                  <li>
                    Fetch and display your 42 data needed for features (ranking,
                    user info, etc.)
                  </li>
                  <li>
                    Load/store your preferences and local tools (Pomodoro,
                    sticky notes, Quran widget)
                  </li>
                  <li>Check whether an update is available</li>
                </ul>
              </section>

              <Separator />

              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  4) Where data is stored
                </h2>
                <p className="text-sm text-muted-foreground">
                  Local storage (in your browser):
                </p>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                  <li>
                    Tokens, preferences, and feature data are stored in
                    chrome.storage.local on your device.
                  </li>
                  <li>
                    This data remains until you clear the Extension’s data or
                    uninstall the Extension.
                  </li>
                </ul>
              </section>

              <Separator />

              <section className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight">
                  5) Data sharing / third-party services
                </h2>
                <p className="text-sm text-muted-foreground">
                  The Extension shares data only with services needed to
                  operate:
                </p>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">A. 42 Intra API</h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>
                      The Extension communicates with https://api.intra.42.fr/
                      for OAuth/token actions and for retrieving user data.
                    </li>
                    <li>
                      Your OAuth tokens are used to authorize these requests.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">
                    B. Companion backend
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>
                      The Extension communicates with
                      https://improved-1337.vercel.app/ for certain features
                      (e.g., user data/preferences endpoints, ranking data,
                      update checking).
                    </li>
                    <li>
                      Requests to this backend may include your 42 OAuth access
                      token in the Authorization header and may include your 42
                      login in the URL query (e.g., ?login=...) depending on the
                      endpoint.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">
                    C. Fonts and media resources
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>
                      The Extension may load fonts from Google Fonts
                      (https://fonts.googleapis.com) for styling.
                    </li>
                    <li>
                      The Extension may load images hosted on 42’s CDN
                      (https://cdn.intra.42.fr) when displaying/using
                      profile-related visuals.
                    </li>
                    <li>
                      These providers may receive basic request metadata (like
                      IP address) when your browser downloads those resources.
                    </li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  6) What we do NOT do
                </h2>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                  <li>We do not sell your personal data.</li>
                  <li>We do not run third-party ads in the Extension.</li>
                  <li>
                    We do not download and execute remote JavaScript code (no
                    remotely hosted code execution). The Extension’s code is
                    packaged with the Extension; network requests are used for
                    APIs/data/resources only.
                  </li>
                </ul>
              </section>

              <Separator />

              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  7) Security
                </h2>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                  <li>Network requests are made over HTTPS.</li>
                  <li>
                    Tokens are stored in extension local storage on your device.
                    No method of storage is perfect; avoid using the Extension
                    on shared/untrusted machines.
                  </li>
                </ul>
              </section>

              <Separator />

              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  8) Your choices and controls
                </h2>
                <p className="text-sm text-muted-foreground">
                  You can control your data by:
                </p>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                  <li>
                    Logging out (if provided in the UI) or clearing the
                    Extension’s storage via Chrome’s extension settings / site
                    data tools.
                  </li>
                  <li>
                    Uninstalling the Extension (removes locally stored Extension
                    data).
                  </li>
                </ul>
              </section>

              <Separator />

              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  9) Changes to this policy
                </h2>
                <p className="text-sm text-muted-foreground">
                  If the Extension’s data practices change, this Privacy Policy
                  will be updated and the effective date will be revised.
                </p>
              </section>

              <Separator />

              <section className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  10) Contact
                </h2>
                <p className="text-sm text-muted-foreground">
                  If you have questions about privacy, contact:
                  jawad.pro17@gmail.com
                </p>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
