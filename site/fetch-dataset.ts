const url = 'https://data.cityofnewyork.us/api/views/25th-nujf/rows.json';
const { data: rawData } = await fetch(url).then(res => res.json());
const allNames = rawData.map((d: any) => d[11].toLowerCase());

export const data = new Map(
  Map.groupBy<string, any>(allNames, (n: any) => n)
    .entries()
    .map(([k, v]) => [k, v.length])
);
