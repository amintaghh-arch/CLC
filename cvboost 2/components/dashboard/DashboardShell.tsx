"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/storage";
import { User } from "@/lib/types";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    setReady(true);
  }, [router]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-display text-lg">
            CVBoost <span className="text-signal">AI</span>
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <span className="font-mono text-xs text-muted border border-line rounded-full px-3 py-1">
              {user.plan === "premium" ? "Premium · illimite" : `${user.credits} credits`}
            </span>
            <Link href="/dashboard/billing" className="text-muted hover:text-[#E7E9EE]">Recharger</Link>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="text-muted hover:text-[#E7E9EE] focus-ring"
            >
              Deconnexion
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
