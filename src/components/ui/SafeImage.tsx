import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Image that tolerates missing content.
 *
 * Admin-created records start with no photo, and passing an empty string to
 * next/image makes the browser re-request the whole page. This renders a quiet
 * placeholder instead, so a half-finished record degrades gracefully rather than
 * breaking the page or shipping a broken-image icon.
 */
export function SafeImage({
  src,
  alt,
  sizes,
  className,
  priority,
  placeholderClassName,
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  placeholderClassName?: string;
}) {
  const clean = typeof src === "string" ? src.trim() : "";

  if (!clean) {
    return (
      <div
        aria-hidden
        className={cn(
          "grid size-full place-items-center bg-[var(--color-cream-200)] text-[var(--color-body-soft)]/50",
          placeholderClassName,
        )}
      >
        <ImageOff className="size-6" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={clean}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
