"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Users } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LeadStatusBadge, MatchBandBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Lead, LEAD_STATUSES, LeadMatch, OPERATOR_STATUS_LABELS, Space } from "@/lib/types";
import { formatDate, formatINR } from "@/lib/format";
import { updateLeadStatusAction } from "@/app/actions/operator";

export interface LeadRow {
  lead: Lead;
  match?: LeadMatch;
  space?: Space;
}

type SortKey = "name" | "budget" | "matchScore" | "created";

const SORTERS: Record<SortKey, (r: LeadRow) => string | number> = {
  name: (r) => r.lead.contactName,
  budget: (r) => r.lead.budgetMax,
  matchScore: (r) => r.match?.score ?? 0,
  created: (r) => r.lead.createdAt,
};

function StatusCell({ lead }: { lead: Lead }) {
  const [pending, startTransition] = useTransition();
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select
        value={lead.status}
        onValueChange={(v) => v && startTransition(async () => { await updateLeadStatusAction(lead.id, v as Lead["status"]); })}
      >
        <SelectTrigger className="h-auto w-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 [&>svg]:hidden">
          <SelectValue>
            <span className={pending ? "opacity-50" : ""}><LeadStatusBadge status={lead.status} /></span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{OPERATOR_STATUS_LABELS[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const COLUMN_HEADERS: { key: SortKey | null; label: string }[] = [
  { key: "name", label: "Name" },
  { key: null, label: "Team size" },
  { key: null, label: "Location" },
  { key: "budget", label: "Budget" },
  { key: null, label: "Type" },
  { key: "matchScore", label: "Match" },
  { key: null, label: "Status" },
  { key: "created", label: "Created" },
];

export function LeadTable({ rows }: { rows: LeadRow[] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = rows.filter((r) => {
      if (statusFilter !== "all" && r.lead.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.lead.contactName.toLowerCase().includes(q) && !r.lead.company.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    result = [...result].sort((a, b) => {
      const av = SORTERS[sortKey](a);
      const bv = SORTERS[sortKey](b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDesc ? -cmp : cmp;
    });
    return result;
  }, [rows, search, statusFilter, sortKey, sortDesc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDesc((d) => !d);
    else { setSortKey(key); setSortDesc(true); }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{OPERATOR_STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">{filtered.length} leads</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No leads match these filters" description="Try clearing the search or status filter." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMN_HEADERS.map((col) => (
                  <TableHead key={col.label}>
                    {col.key ? (
                      <button className="flex items-center gap-1 whitespace-nowrap" onClick={() => toggleSort(col.key!)}>
                        {col.label} <ArrowUpDown className="size-3" />
                      </button>
                    ) : col.label}
                  </TableHead>
                ))}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow
                  key={row.lead.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/operator/leads/${row.lead.id}`)}
                >
                  <TableCell>
                    <p className="font-medium">{row.lead.contactName}</p>
                    <p className="text-xs text-muted-foreground">{row.lead.company}</p>
                  </TableCell>
                  <TableCell>{row.lead.teamSize}</TableCell>
                  <TableCell>{row.lead.city}</TableCell>
                  <TableCell>{formatINR(row.lead.budgetMin)}–{formatINR(row.lead.budgetMax)}</TableCell>
                  <TableCell className="capitalize">{row.lead.workspaceType.replace("_", " ")}</TableCell>
                  <TableCell>{row.match ? <MatchBandBadge band={row.match.band} score={row.match.score} /> : "—"}</TableCell>
                  <TableCell><StatusCell lead={row.lead} /></TableCell>
                  <TableCell>{formatDate(row.lead.createdAt)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/operator/leads/${row.lead.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
