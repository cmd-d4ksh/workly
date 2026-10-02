import { Check } from "lucide-react";
import { CompanySettingsForm, PlanActionButton } from "@/components/operator/settings-actions";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";
import { PLANS } from "@/lib/billing";
import { formatINRFull } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function OperatorSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const operator = getOperatorByUserId(user.id);
  if (!operator) return null;

  return (
    <div className="flex flex-col gap-10">
      <section className="max-w-xl">
        <h2 className="font-heading text-xl font-medium">Company settings</h2>
        <CompanySettingsForm operator={operator} />
      </section>

      <section>
        <h2 className="font-heading text-xl font-medium">Billing plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Current plan: <span className="font-medium capitalize text-foreground">{operator.plan}</span>
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "rounded-2xl border p-5",
                plan.id === operator.plan ? "border-brand bg-brand-muted/40" : "border-border"
              )}
            >
              <p className="font-heading text-lg font-medium">{plan.name}</p>
              <p className="mt-1 text-2xl font-semibold">
                {plan.priceMonthly === 0 ? "Free" : formatINRFull(plan.priceMonthly)}
                {plan.priceMonthly > 0 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>
              <PlanActionButton plan={plan.id} isCurrent={plan.id === operator.plan} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
