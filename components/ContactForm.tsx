"use client";

import { useState } from "react";

const EMAIL = "hello@persidian.com";

interface ContactFormProps {
  accent?: string;
}

export function ContactForm({ accent }: ContactFormProps) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `Persidian — deck request from ${org || name || "interested party"}`;
    const body = [
      `Name: ${name || "Not provided"}`,
      `Organisation: ${org || "Not provided"}`,
      "",
      message || "I’d like to learn more about Persidian and request the deck.",
    ].join("\n");

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
        <p className="text-lg font-medium text-foreground">Email ready to send.</p>
        <p className="mt-2 text-muted leading-relaxed">
          Your mail app should have opened with a pre-filled message to{" "}
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
            {EMAIL}
          </a>
          . If it didn&apos;t, copy the address and say hello.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
        >
          Back to form
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-background p-6 sm:p-8 space-y-5"
      data-enter
    >
      <div>
        <label htmlFor="contact-name" className="section-label text-muted block mb-2">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="contact-org" className="section-label text-muted block mb-2">
          Organisation
        </label>
        <input
          id="contact-org"
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Company or fund"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="section-label text-muted block mb-2">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="What would you like to know?"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-transform"
        style={accent ? { backgroundColor: accent } : undefined}
      >
        Request the deck →
      </button>
      <p className="text-xs text-muted">
        Or email directly at{" "}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
          {EMAIL}
        </a>
      </p>
    </form>
  );
}
