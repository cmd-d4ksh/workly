import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function SeekerProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-xl">
      <h2 className="font-heading text-xl font-medium">Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your account details.</p>

      <div className="mt-6 flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="bg-brand-muted text-lg font-semibold text-brand">
            {initials(user.fullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form className="mt-8 flex flex-col gap-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" defaultValue={user.fullName} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" defaultValue={user.company ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="jobTitle">Job title</Label>
          <Input id="jobTitle" defaultValue={user.jobTitle ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" defaultValue={user.phone ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={user.email} disabled className="mt-1.5" />
        </div>
        <Button type="button" className="mt-2 w-fit bg-brand text-brand-foreground hover:bg-brand/90">
          Save changes
        </Button>
      </form>
    </div>
  );
}
