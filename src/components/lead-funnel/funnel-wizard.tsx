"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  AMENITY_KEYS,
  AMENITY_LABELS,
  AmenityKey,
  City,
  CITIES,
  MOVE_IN_LABELS,
  MoveInTimeline,
  TEAM_SIZE_BANDS,
  TeamSizeBand,
  WORKSPACE_TYPE_LABELS,
  WORKSPACE_TYPES,
  WorkspaceType,
} from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/mock-data/geo";
import { submitLeadFunnelAction } from "@/app/actions/leads";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FunnelState {
  city: City | "";
  neighborhoods: string[];
  workspaceType: WorkspaceType | "";
  teamSize: TeamSizeBand | "";
  budgetMin: number;
  budgetMax: number;
  moveIn: MoveInTimeline | "";
  amenities: AmenityKey[];
  contactName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
}

const STEP_TITLES = [
  "Where are you looking?",
  "What do you need?",
  "Team size",
  "Budget",
  "When do you need it?",
  "Preferences",
  "Contact information",
];
const TOTAL_STEPS = STEP_TITLES.length;

function OptionCard({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors",
        selected ? "border-brand bg-brand-muted text-brand" : "border-border hover:border-foreground/30"
      )}
    >
      {children}
    </button>
  );
}

export function FunnelWizard({ initial }: { initial: Partial<FunnelState> }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<{ leadId: string; matchCount: number } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<FunnelState>({
    city: "",
    neighborhoods: [],
    workspaceType: "",
    teamSize: "",
    budgetMin: 10000,
    budgetMax: 50000,
    moveIn: "",
    amenities: [],
    contactName: "",
    company: "",
    email: "",
    phone: "",
    jobTitle: "",
    ...initial,
  });

  function update<K extends keyof FunnelState>(key: K, value: FunnelState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  const canAdvance = useMemo(() => {
    switch (step) {
      case 1: return !!state.city;
      case 2: return !!state.workspaceType;
      case 3: return !!state.teamSize;
      case 4: return state.budgetMax > 0 && state.budgetMax >= state.budgetMin;
      case 5: return !!state.moveIn;
      case 6: return true;
      case 7:
        return !!(
          state.contactName &&
          state.company &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) &&
          state.phone &&
          state.jobTitle
        );
      default: return false;
    }
  }, [step, state]);

  function next() {
    if (step === 1) track("lead_started", { city: state.city });
    if (step < TOTAL_STEPS) setStep(step + 1);
    else handleSubmit();
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  function handleSubmit() {
    const formData = new FormData();
    formData.set("city", state.city);
    state.neighborhoods.forEach((n) => formData.append("neighborhoods", n));
    formData.set("workspaceType", state.workspaceType);
    formData.set("teamSize", state.teamSize);
    formData.set("budgetMin", String(state.budgetMin));
    formData.set("budgetMax", String(state.budgetMax));
    formData.set("moveIn", state.moveIn);
    state.amenities.forEach((a) => formData.append("amenities", a));
    formData.set("contactName", state.contactName);
    formData.set("company", state.company);
    formData.set("email", state.email);
    formData.set("phone", state.phone);
    formData.set("jobTitle", state.jobTitle);

    setSubmitError(null);
    startTransition(async () => {
      const result = await submitLeadFunnelAction(formData);
      if (result.error || !result.leadId) {
        setSubmitError(result.error ?? "Something went wrong — please try again.");
        return;
      }
      track("lead_submitted", { leadId: result.leadId, matchCount: result.matchCount ?? 0 });
      setSubmitted({ leadId: result.leadId, matchCount: result.matchCount ?? 0 });
    });
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <CheckCircle2 className="size-14 text-brand" />
        <h1 className="mt-5 font-heading text-2xl font-medium">You&rsquo;re all set.</h1>
        <p className="mt-2 text-muted-foreground">
          We found <span className="font-semibold text-foreground">{submitted.matchCount} spaces</span> that
          match your requirements.
        </p>
        <Button
          size="lg"
          className="mt-7 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => router.push(`/get-started/matches/${submitted.leadId}`)}
        >
          View matches <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl py-10">
      <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Step {step} of {TOTAL_STEPS}
      </p>
      <h1 className="mt-2 font-heading text-2xl font-medium">{STEP_TITLES[step - 1]}</h1>

      <div className="mt-7 min-h-[280px]">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {CITIES.map((c) => (
                <OptionCard key={c} selected={state.city === c} onClick={() => { update("city", c); update("neighborhoods", []); }}>
                  {c}
                </OptionCard>
              ))}
            </div>
            {state.city && (
              <div>
                <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Preferred areas (optional)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {NEIGHBORHOODS[state.city].map((n) => {
                    const active = state.neighborhoods.includes(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          update("neighborhoods", active ? state.neighborhoods.filter((x) => x !== n) : [...state.neighborhoods, n])
                        }
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          active ? "border-brand bg-brand-muted text-brand" : "border-border text-muted-foreground hover:border-foreground/30"
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-2.5">
            {WORKSPACE_TYPES.map((t) => (
              <OptionCard key={t} selected={state.workspaceType === t} onClick={() => update("workspaceType", t)}>
                {WORKSPACE_TYPE_LABELS[t]}
              </OptionCard>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {TEAM_SIZE_BANDS.map((b) => (
              <OptionCard key={b.value} selected={state.teamSize === b.value} onClick={() => update("teamSize", b.value)}>
                {b.label}
              </OptionCard>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetMin">Minimum (₹/mo)</Label>
              <Input
                id="budgetMin" type="number" min={0} step={1000} className="mt-1.5"
                value={state.budgetMin}
                onChange={(e) => update("budgetMin", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="budgetMax">Maximum (₹/mo)</Label>
              <Input
                id="budgetMax" type="number" min={0} step={1000} className="mt-1.5"
                value={state.budgetMax}
                onChange={(e) => update("budgetMax", Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {Object.entries(MOVE_IN_LABELS).map(([value, label]) => (
              <OptionCard key={value} selected={state.moveIn === value} onClick={() => update("moveIn", value as MoveInTimeline)}>
                {label}
              </OptionCard>
            ))}
          </div>
        )}

        {step === 6 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AMENITY_KEYS.map((a) => {
              const active = state.amenities.includes(a);
              return (
                <label key={a} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={active}
                    onCheckedChange={() =>
                      update("amenities", active ? state.amenities.filter((x) => x !== a) : [...state.amenities, a])
                    }
                  />
                  {AMENITY_LABELS[a]}
                </label>
              );
            })}
          </div>
        )}

        {step === 7 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactName">Full name</Label>
              <Input id="contactName" className="mt-1.5" value={state.contactName} onChange={(e) => update("contactName", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" className="mt-1.5" value={state.company} onChange={(e) => update("company", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-1.5" value={state.email} onChange={(e) => update("email", e.target.value)} />
              {state.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) && (
                <p className="mt-1 text-xs text-destructive">Enter a valid email address</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" className="mt-1.5" value={state.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="jobTitle">Job title</Label>
              <Input id="jobTitle" className="mt-1.5" value={state.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {submitError && <p className="mt-4 text-sm text-destructive">{submitError}</p>}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 1} className="gap-1.5">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button
          onClick={next}
          disabled={!canAdvance || pending}
          className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : step === TOTAL_STEPS ? "Submit" : "Continue"}
          {!pending && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
