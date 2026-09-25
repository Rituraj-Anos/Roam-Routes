import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getPublicPost, getPublishedPosts } from "@/lib/store/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) return { title: "Guide" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) notFound();

  const more = (await getPublishedPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <section className="relative isolate flex min-h-[52svh] items-end overflow-hidden bg-[var(--color-ink)] pt-28">
        <Image
          src={post.coverImage}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-45"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-black/55 to-black/35"
        />

        <div className="relative mx-auto w-full max-w-3xl px-5 pb-12 sm:px-8">
          <Link
            href="/blog"
            className="t-small inline-flex items-center gap-1.5 text-white/65 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
            All guides
          </Link>

          <span className="t-small mt-5 block font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
            {post.tag}
          </span>
          <h1 className="t-display mt-2 text-balance text-[var(--color-cream)]">
            {post.title}
          </h1>
          <p className="t-small mt-4 inline-flex items-center gap-1.5 text-white/55">
            <Clock className="size-4" strokeWidth={1.5} aria-hidden />
            {post.readMinutes} min read ·{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      <Section tone="light">
        <article className="mx-auto max-w-[42rem]">
          <p className="t-body-lg text-[var(--color-body)]">{post.excerpt}</p>
          <div className="t-body mt-6 space-y-5 text-[var(--color-body)]">
            {post.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      </Section>

      <Section tone="cream">
        <h2 className="t-h2">Keep reading</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {more.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="hover-lift group flex items-start justify-between gap-3 rounded-[var(--radius-card)] bg-[var(--color-paper)] p-5 ring-1 ring-[var(--color-line)]"
            >
              <span>
                <span className="t-small block font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  {p.tag}
                </span>
                <span className="font-display mt-1.5 block text-[0.9375rem] font-semibold leading-snug tracking-[-0.014em]">
                  {p.title}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-[var(--color-teal-700)] transition-transform duration-[240ms] group-hover:rotate-45"
                strokeWidth={1.75}
              />
            </Link>
          ))}
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
