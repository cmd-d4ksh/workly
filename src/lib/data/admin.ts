import { DB } from "@/lib/mock-data";
import { daysAgoIso } from "@/lib/mock-data/rng";
import { SpaceStatus } from "@/lib/types";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

function paginate<T>(items: T[], { page = 1, pageSize = 10 }: PaginationParams) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { rows: items.slice(start, start + pageSize), total, page, pageSize };
}

export function listUsersAdmin(params: PaginationParams) {
  let rows = DB.users.all;
  if (params.search) {
    const q = params.search.toLowerCase();
    rows = rows.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  return paginate(rows, params);
}

export function listOperatorsAdmin(params: PaginationParams) {
  let rows = DB.operators.map((o) => ({
    ...o,
    spaceCount: DB.spaces.filter((s) => s.operatorId === o.id).length,
  }));
  if (params.search) {
    const q = params.search.toLowerCase();
    rows = rows.filter((o) => o.companyName.toLowerCase().includes(q));
  }
  return paginate(rows, params);
}

export function listSpacesAdmin(params: PaginationParams & { status?: SpaceStatus }) {
  let rows = DB.spaces;
  if (params.status) rows = rows.filter((s) => s.status === params.status);
  if (params.search) {
    const q = params.search.toLowerCase();
    rows = rows.filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
  }
  return paginate(rows, params);
}

export function listLeadsAdmin(params: PaginationParams) {
  let rows = DB.leads;
  if (params.search) {
    const q = params.search.toLowerCase();
    rows = rows.filter(
      (l) => l.contactName.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)
    );
  }
  return paginate(rows, params);
}

export function approveOperator(operatorId: string) {
  const operator = DB.operators.find((o) => o.id === operatorId);
  if (operator) operator.approved = true;
  return operator;
}

export function approveSpace(spaceId: string) {
  const space = DB.spaces.find((s) => s.id === spaceId);
  if (space) space.status = "published";
  return space;
}

export function rejectSpace(spaceId: string) {
  const space = DB.spaces.find((s) => s.id === spaceId);
  if (space) space.status = "rejected";
  return space;
}

export function suspendSpace(spaceId: string) {
  const space = DB.spaces.find((s) => s.id === spaceId);
  if (space) space.status = "draft";
  return space;
}

export function platformMetrics() {
  const totalUsers = DB.users.all.length;
  const activeOperators = DB.operators.filter((o) => o.approved).length;
  const publishedSpaces = DB.spaces.filter((s) => s.status === "published").length;
  const now = Date.now();
  const monthMs = 30 * 24 * 60 * 60 * 1000;
  const monthlyLeads = DB.leads.filter((l) => now - Date.parse(l.createdAt) <= monthMs).length;
  const qualifiedLeads = DB.leads.filter((l) =>
    ["qualified", "tour_scheduled", "proposal", "won"].includes(l.status)
  ).length;
  const won = DB.leads.filter((l) => l.status === "won").length;
  const conversionRate = DB.leads.length ? Math.round((won / DB.leads.length) * 100) : 0;

  return { totalUsers, activeOperators, publishedSpaces, monthlyLeads, qualifiedLeads, conversionRate };
}

export function leadsOverTimePlatform(days = 30) {
  const buckets: { date: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgoIso(i).slice(0, 10);
    const value = DB.leads.filter((l) => l.createdAt.slice(0, 10) === date).length;
    buckets.push({ date, value });
  }
  return buckets;
}

export function pendingSpacesCount() {
  return DB.spaces.filter((s) => s.status === "pending_review").length;
}
