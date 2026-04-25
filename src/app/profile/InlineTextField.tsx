"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface InlineTextFieldProps {
  /** Profile column to update — `display_name` or `bio`. */
  column: "display_name" | "bio";
  initialValue: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  maxLength: number;
  /** Tailwind classes applied to BOTH the resting display and the input. */
  textClassName: string;
  /** Optional resting-state empty content (when initialValue is blank). */
  emptyClassName?: string;
}

export default function InlineTextField({
  column,
  initialValue,
  placeholder,
  multiline = false,
  required = false,
  maxLength,
  textClassName,
  emptyClassName,
}: InlineTextFieldProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      const el = inputRef.current;
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [editing]);

  function flashError(message: string) {
    setError(message);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
  }

  function startEditing() {
    if (saving) return;
    setDraft(value);
    setError(null);
    setEditing(true);
  }

  function returnFocusToButton() {
    queueMicrotask(() => buttonRef.current?.focus());
  }

  async function commit() {
    if (saving) return;
    const trimmed = draft.trim();

    if (required && trimmed.length === 0) {
      setEditing(false);
      setDraft(value);
      returnFocusToButton();
      return;
    }
    if (trimmed.length > maxLength) {
      flashError(`Too long — keep it under ${maxLength} characters.`);
      return;
    }
    if (trimmed === value) {
      setEditing(false);
      returnFocusToButton();
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setEditing(false);
      flashError("You must be signed in.");
      returnFocusToButton();
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        [column]: trimmed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      flashError(updateError.message);
      return;
    }

    setValue(trimmed);
    setEditing(false);
    setJustSaved(true);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setJustSaved(false), 700);
    router.refresh();
    returnFocusToButton();
  }

  function cancel() {
    setEditing(false);
    setDraft(value);
    setError(null);
    returnFocusToButton();
  }

  const flashClass = justSaved
    ? "border-ember/80 shadow-[0_4px_24px_-8px_rgba(245,210,139,0.45)]"
    : "border-ember/30";
  const sharedClasses = `${textClassName} cursor-text border-b border-dashed bg-transparent transition-colors transition-shadow duration-500 ${flashClass}`;
  const hasValue = value.trim().length > 0;

  if (editing) {
    return (
      <div className="flex flex-col">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
            rows={3}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`${sharedClasses} resize-none focus:outline-none`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              } else if (e.key === "Enter" && !multiline) {
                e.preventDefault();
                commit();
              }
            }}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`${sharedClasses} focus:outline-none`}
          />
        )}
        {error ? (
          <span className="mt-1 font-figtree text-[11px] text-red-300">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  const editLabel =
    column === "display_name" ? "Edit display name" : "Edit bio";

  return (
    <div className="flex flex-col">
      <button
        ref={buttonRef}
        type="button"
        onClick={startEditing}
        aria-label={editLabel}
        className={`${sharedClasses} text-left ${
          hasValue ? "" : emptyClassName ?? "italic text-brand-50/35"
        }`}
      >
        {hasValue ? value : placeholder}
      </button>
      {error ? (
        <span className="mt-1 font-figtree text-[11px] text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
