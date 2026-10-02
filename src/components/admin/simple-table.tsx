import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface SimpleColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
}

export function SimpleTable<T extends { id: string }>({
  columns,
  rows,
}: {
  columns: SimpleColumn<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => <TableHead key={c.header}>{c.header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((c) => <TableCell key={c.header}>{c.cell(row)}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
