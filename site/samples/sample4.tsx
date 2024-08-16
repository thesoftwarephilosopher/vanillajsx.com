// const url = 'https://data.cityofnewyork.us/api/views/25th-nujf/rows.json';
const url = './sample.json';
console.log(url)
const { data } = await fetch(url).then(res => res.json());
const allNames = data.map((d: any) => d[11].toLowerCase());
const groups = Map.groupBy<string, any[]>(allNames, (n: any) => n);

console.log(groups.size)

export default function FindNames() {
  const list = <ul /> as HTMLUListElement;
  const input = <input /> as HTMLInputElement;
  input.oninput = () => {
    const matches = (groups
      .entries()
      .filter(g => g[0].includes(input.value))
      .map(g => <li>{g[0]} ({g[1].length})</li>)
      .take(10)
      .toArray());
    list.replaceChildren(...matches);
  };
  return <>
    {input}
    {list}
  </>;
}
