import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blog" };

export default function BlogIndexPage() {
  return (
    <div className="page-shell py-20">
      <h1 className="font-heading text-4xl font-medium tracking-tight">Blog</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-border p-6 hover:border-foreground/20">
            <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
            <h2 className="mt-2 font-heading text-xl font-medium">{post.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
