"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const supabase = supabaseBrowser;

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (result.error) {
      setMsg(result.error.message);
      return;
    }

    setMsg(
      mode === "signup"
        ? "Account created. If email confirmation is ON, check your inbox."
        : "Logged in! Go to /dashboard."
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
        <h1 className="text-2xl font-bold">{mode === "signup" ? "Create account" : "Log in"}</h1>

        <input
          className="w-full border rounded-md px-3 py-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full border rounded-md px-3 py-2"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button
          className="w-full rounded-md bg-black text-white py-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Working..." : mode === "signup" ? "Sign up" : "Log in"}
        </button>

        <button
          type="button"
          className="w-full border rounded-md py-2"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        >
          Switch to {mode === "signup" ? "Log in" : "Sign up"}
        </button>

        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </form>
    </main>
  );
}