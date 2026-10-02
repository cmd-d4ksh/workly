import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Logo />
      <p className="font-heading text-6xl font-medium">404</p>
      <h1 className="font-heading text-xl font-medium">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Button className="mt-2 bg-brand text-brand-foreground hover:bg-brand/90" render={<Link href="/" />}>
        Back to home
      </Button>
    </div>
  );
}
