"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CITIES, City } from "@/lib/types";
import { createSpaceAction } from "@/app/actions/operator";

export function NewSpaceForm() {
  const [pending, startTransition] = useTransition();
  const [fields, setFields] = useState({
    name: "",
    city: "" as City | "",
    neighborhood: "",
    description: "",
  });

  const canSubmit = fields.name && fields.city && fields.neighborhood;

  function submit(status: "draft" | "pending_review") {
    if (!fields.city) return;
    startTransition(() => createSpaceAction({ ...fields, city: fields.city as City }, status));
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Space name</Label>
        <Input
          id="name"
          placeholder="e.g. Atlas House BKC"
          className="mt-1.5"
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Select value={fields.city} onValueChange={(v) => setFields((f) => ({ ...f, city: (v as City) ?? "" }))}>
            <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Select a city" /></SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            id="neighborhood"
            className="mt-1.5"
            value={fields.neighborhood}
            onChange={(e) => setFields((f) => ({ ...f, neighborhood: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          className="mt-1.5"
          value={fields.description}
          onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" disabled={!canSubmit || pending} onClick={() => submit("draft")}>
          Save as draft
        </Button>
        <Button
          type="button"
          disabled={!canSubmit || pending}
          onClick={() => submit("pending_review")}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          Submit for review
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        You can add pricing, amenities, and photos from the space&rsquo;s page after creating it.
      </p>
    </div>
  );
}
