export async function getData() {
  const url = 'https://data.cityofnewyork.us/api/views/25th-nujf/rows.json';
  const { data } = await fetch(url).then(res => res.json());
  const allNames = data.map((d: any) => d[11].toLowerCase());
  return Map.groupBy<string, any>(allNames, (n: any) => n);
}
