import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return { title: post?.title ?? "Blog post" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="page-shell max-w-2xl py-20">
      <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
      <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">{post.title}</h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">{post.body}</p>
    </article>
  );
}
