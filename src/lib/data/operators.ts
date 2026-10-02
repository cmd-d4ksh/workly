import { DB } from "@/lib/mock-data";
import { PlanTier } from "@/lib/types";

export function updateOperatorProfile(
  operatorId: string,
  fields: { companyName: string; contactEmail: string; contactPhone: string }
) {
  const operator = DB.operators.find((o) => o.id === operatorId);
  if (!operator) return undefined;
  operator.companyName = fields.companyName;
  operator.contactEmail = fields.contactEmail;
  operator.contactPhone = fields.contactPhone;
  return operator;
}

export function updateOperatorPlan(operatorId: string, plan: PlanTier) {
  const operator = DB.operators.find((o) => o.id === operatorId);
  if (!operator) return undefined;
  operator.plan = plan;
  return operator;
}

export function getOperatorByUserId(userId: string) {
  return DB.operators.find((o) => o.userId === userId);
}

export function getOperatorById(id: string) {
  return DB.operators.find((o) => o.id === id);
}

export function getOperatorProfile(userId: string) {
  return DB.users.all.find((u) => u.id === userId);
}
