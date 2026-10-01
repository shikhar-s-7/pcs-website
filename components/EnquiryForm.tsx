"use client";

import { useState, type FormEvent } from "react";
import { brand } from "@/config/brand";
import { spec } from "@/lib/spec";

/** Inlined at build time. Unset: the form is disabled and points to the email address. */
const endpoint = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "failed";

const messages: Record<Status, string> = {
  idle: "",
  sending: "",
  sent: "Enquiry received. Our engineering team will respond within one business day.",
  failed: "The form could not be sent. Please try again in a few minutes.",
};

const interests = [
  spec("enq-interest-range").label,
  "Compliance & validation (EMT / HIL / witness tests)",
  "Dispatch & asset management software",
  "Integrated project (multiple)",
  "Other",
];

function Required() {
  return <span className="text-signal-text"> *</span>;
}

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("_honey")) {
      setStatus("sent");
      return;
    }
    if (!endpoint) return;

    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
      <input type="hidden" name="_subject" value={`${brand.name} website enquiry`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-px w-px opacity-0"
      />

      <label className="field">
        <span>
          Name
          <Required />
        </span>
        <input name="name" type="text" autoComplete="name" enterKeyHint="next" required />
      </label>
      <label className="field">
        <span>
          Company
          <Required />
        </span>
        <input name="company" type="text" autoComplete="organization" enterKeyHint="next" required />
      </label>
      <label className="field">
        <span>
          Work email
          <Required />
        </span>
        <input name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} enterKeyHint="next" required />
      </label>
      <label className="field">
        <span>Phone</span>
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" />
      </label>
      <label className="field">
        <span>
          Interest
          <Required />
        </span>
        <select name="interest" required defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {interests.map((interest) => (
            <option key={interest}>{interest}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Project size (MW / MWh)</span>
        <input name="size" type="text" autoComplete="off" enterKeyHint="next" placeholder={spec("enq-size-placeholder").label} />
      </label>
      <label className="field md:col-span-2">
        <span>
          Project details
          <Required />
        </span>
        <textarea
          name="message"
          required
          placeholder="Site location, grid connection voltage, timeline, tender or compliance driver"
        />
      </label>

      <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:gap-8">
        <button
          type="submit"
          className="btn btn-signal w-full md:w-auto"
          disabled={!endpoint || status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send enquiry"}
        </button>
        <p className="max-w-[52ch] text-small text-muted">
          Submissions go directly to our engineering team by email. We do not share your details.
        </p>
      </div>

      {!endpoint ? (
        <p className="font-mono text-small md:col-span-2">
          The form is not accepting submissions yet. Email{" "}
          <a href={`mailto:${brand.email}`} className="text-link">
            {brand.email}
          </a>{" "}
          instead.
        </p>
      ) : null}

      <p
        role="status"
        aria-live="polite"
        className={`font-mono text-small md:col-span-2 ${status === "failed" ? "text-signal-text" : ""}`}
      >
        {messages[status]}
      </p>
      <noscript>
        <p className="font-mono text-small md:col-span-2">
          This form needs JavaScript to send. Please enable it and reload.
        </p>
      </noscript>
    </form>
  );
}
