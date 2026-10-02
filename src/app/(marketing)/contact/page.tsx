import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="page-shell py-20">
      <div className="mx-auto max-w-md">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">Questions about Workly? Send us a message.</p>
        <form className="mt-7 flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} className="mt-1.5" />
          </div>
          <Button type="button" className="bg-brand text-brand-foreground hover:bg-brand/90">Send message</Button>
        </form>
      </div>
    </div>
  );
}
