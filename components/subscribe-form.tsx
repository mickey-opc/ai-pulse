"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const payload = (await response.json()) as { error?: string };

    setPending(false);
    setMessage(response.ok ? "Subscribed. Near-real-time email updates enabled." : payload.error ?? "Request failed");

    if (response.ok) {
      setEmail("");
    }
  }

  return (
    <form className="subscribe-form" onSubmit={onSubmit}>
      <input
        aria-label="Email address"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        required
        type="email"
        value={email}
      />
      <button disabled={pending} type="submit">
        {pending ? "Subscribing..." : "Subscribe"}
      </button>
      {message ? <span className="meta">{message}</span> : null}
    </form>
  );
}
