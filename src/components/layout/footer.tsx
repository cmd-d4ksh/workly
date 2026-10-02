import Link from "next/link";
import { Logo } from "@/components/layout/logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Find a space", href: "/search" },
      { label: "How it works", href: "/how-it-works" },
    ],
  },
  {
    title: "For seekers",
    links: [
      { label: "Browse spaces", href: "/spaces" },
      { label: "Get matched", href: "/get-started" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "For operators",
    links: [
      { label: "List your space", href: "/signup?role=operator" },
      { label: "Why list with Workly", href: "/for-business" },
      { label: "Operator dashboard", href: "/operator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="page-shell grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
          <Logo />
          <p className="max-w-[26ch] text-sm text-muted-foreground">
            Find your next workspace. Fill your next desk.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-foreground/80 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="page-shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Workly, Inc. Demo product — not a real company.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-foreground">Privacy</Link>
            <Link href="/about" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
