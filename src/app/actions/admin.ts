"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { approveOperator, approveSpace, rejectSpace, suspendSpace } from "@/lib/data/admin";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized.");
}

export async function approveOperatorAction(operatorId: string) {
  await assertAdmin();
  approveOperator(operatorId);
  revalidatePath("/admin/operators");
}

export async function approveSpaceAction(spaceId: string) {
  await assertAdmin();
  approveSpace(spaceId);
  revalidatePath("/admin/spaces");
}

export async function rejectSpaceAction(spaceId: string) {
  await assertAdmin();
  rejectSpace(spaceId);
  revalidatePath("/admin/spaces");
}

export async function suspendSpaceAction(spaceId: string) {
  await assertAdmin();
  suspendSpace(spaceId);
  revalidatePath("/admin/spaces");
}
