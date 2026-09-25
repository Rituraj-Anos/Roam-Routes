"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { site } from "@/lib/site";
import { waLink } from "@/lib/utils";
import { EASE_OUT, DUR } from "@/lib/motion";

/**
 * Short inquiry form.
 *
 * Validation is inline rather than on submit, and WhatsApp is always offered
 * alongside as a guaranteed path — if the API is down, the lead still reaches
 * us. Field contrast is checked against the cream surface.
 */
export function InquiryForm({
  packages,
}: {
  packages: { slug: string; title: string }[];
}) {
  const reduce = useReducedMotion();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    travelDates: "",
    pax: "2",
    packageSlug: "",
    message: "",
  });

  const update =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const nameError = touched.name && !form.name.trim() ? "Please tell us your name." : null;
  const phoneError =
    touched.whatsapp && form.whatsapp.replace(/\D/g, "").length < 10
      ? "Enter a number we can reach you on."
      : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, whatsapp: true });
    if (!form.name.trim() || form.whatsapp.replace(/\D/g, "").length < 10) return;

    setState("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setState("done");
    } catch {
      setState("error");
    }
  };

  const chosen = packages.find((p) => p.slug === form.packageSlug);
  const waMsg = [
    `Hi ${site.name}, I'd like to plan a trip.`,
    form.name && `Name: ${form.name}`,
    form.travelDates && `Dates: ${form.travelDates}`,
    `Travellers: ${form.pax}`,
    chosen ? `Trip: ${chosen.title}` : "Trip: not decided yet",
    form.message && form.message,
  ]
    .filter(Boolean)
    .join("\n");

  const field =
    "w-full rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-[0.9375rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-body-soft)] focus:border-[var(--color-teal-600)]";
  const label =
    "mb-1.5 block text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-body-soft)]";
  const errorCls = "mt-1.5 text-[0.8125rem] text-[var(--color-accent-dim)]";

  return (
    <div className="rounded-[var(--radius-xl2)] bg-[var(--color-cream)] p-6 ring-1 ring-[var(--color-line)] sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0,8px,0)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translate3d(0,0,0)" }}
            transition={{ duration: DUR.slow, ease: EASE_OUT }}
            className="py-8 text-center"
          >
            <CheckCircle2
              className="mx-auto size-11 text-[var(--color-teal-700)]"
              strokeWidth={1.5}
              aria-hidden
            />
            <h3 className="t-h2 mt-4">Enquiry received</h3>
            <p className="t-body mx-auto mt-3 max-w-sm text-[var(--color-body)]">
              Thanks {form.name.split(" ")[0] || "for reaching out"}. We will reply on
              WhatsApp shortly. For a faster answer, start the chat yourself.
            </p>
            <a
              href={waLink(site.whatsapp, waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[#1faa53] px-5 py-3 text-sm font-semibold text-white"
            >
              <SiWhatsapp className="size-[1.0625rem]" aria-hidden />
              Continue on WhatsApp
            </a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={false}
            className="space-y-4"
          >
            <div>
              <label className={label} htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={update("name")}
                onBlur={blur("name")}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? "name-error" : undefined}
                className={field}
                placeholder="Ananya Sen"
                autoComplete="name"
              />
              {nameError && (
                <p id="name-error" className={errorCls}>
                  {nameError}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="whatsapp">
                  WhatsApp number
                </label>
                <input
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={update("whatsapp")}
                  onBlur={blur("whatsapp")}
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? "whatsapp-error" : undefined}
                  className={field}
                  placeholder="+91 90000 00000"
                  inputMode="tel"
                  autoComplete="tel"
                />
                {phoneError && (
                  <p id="whatsapp-error" className={errorCls}>
                    {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label className={label} htmlFor="pax">
                  Travellers
                </label>
                <select id="pax" value={form.pax} onChange={update("pax")} className={field}>
                  {["1", "2", "3", "4", "5", "6 or more"].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="dates">
                  Travel dates
                </label>
                <input
                  id="dates"
                  value={form.travelDates}
                  onChange={update("travelDates")}
                  className={field}
                  placeholder="Mid-October, 6 nights"
                />
              </div>

              <div>
                <label className={label} htmlFor="package">
                  Trip of interest
                </label>
                <select
                  id="package"
                  value={form.packageSlug}
                  onChange={update("packageSlug")}
                  className={field}
                >
                  <option value="">Not decided yet</option>
                  {packages.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={label} htmlFor="message">
                Anything else <span className="font-normal normal-case">(optional)</span>
              </label>
              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={update("message")}
                className={field}
                placeholder="Budget, must-sees, dietary needs, travelling with kids"
              />
            </div>

            {state === "error" && (
              <p role="alert" className="text-[0.8125rem] text-[var(--color-accent-dim)]">
                That did not send. Please use WhatsApp instead, the button is right
                below.
              </p>
            )}

            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
              <button
                type="submit"
                disabled={state === "sending"}
                className="pressable inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-teal-800)] px-5 py-3.5 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-60"
              >
                <Send className="size-4" aria-hidden />
                {state === "sending" ? "Sending" : "Send enquiry"}
              </button>
              <a
                href={waLink(site.whatsapp, waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[#1faa53] px-5 py-3.5 text-sm font-semibold text-white"
              >
                <SiWhatsapp className="size-[1.0625rem]" aria-hidden />
                WhatsApp instead
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
