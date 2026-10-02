import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/config";
import { getAllPublishedSpaces } from "@/lib/data/spaces";
import { BLOG_POSTS } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/search", "/about", "/how-it-works", "/for-business", "/contact", "/blog"].map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: new Date(),
  }));

  const spaceRoutes = getAllPublishedSpaces().map((space) => ({
    url: `${APP_URL}/spaces/${space.slug}`,
    lastModified: space.updatedAt,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [...staticRoutes, ...spaceRoutes, ...blogRoutes];
}
