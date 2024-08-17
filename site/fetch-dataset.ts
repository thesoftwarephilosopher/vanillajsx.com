const rows = await fetch('names.txt').then(res => res.text());
const names = rows.split(/\r?\n/).map(row => row.split(',')[0]);
export const data = new Map(
  Map.groupBy<string, any>(names, (n: any) => n)
    .entries()
    .map(([k, v]) => [k, v.length])
);
