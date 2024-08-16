import { data } from "../fetch-dataset.js";

export default function FindNames() {
  const status = <p style='margin:1em 0' /> as HTMLParagraphElement;
  const results = <ul /> as HTMLUListElement;
  const input = <input
    value='eri(c|k)a?'
    autocomplete='new-password'
  /> as HTMLInputElement;

  const updateMatches = () => {
    const matched = (data.entries()
      .filter(([k]) => k.match(input.value))
      .toArray());

    const matches = (Iterator.from(matched)
      .map(match => <Item regex={input.value} match={match} />)
      .take(30));

    results.replaceChildren(...matches);
    status.textContent = `${matched.length} / ${data.size}`;
  };

  input.oninput = updateMatches;
  updateMatches();

  return <div class='sample4'>
    {input}
    {status}
    {results}
  </div>;
}

function Item(attrs: { match: [string, number], regex: string }) {
  const [name, count] = attrs.match;
  const total = <small style='color:#fff3'>({count})</small>;
  return <li>
    <span innerHTML={highlight(name, attrs.regex)} /> {total}
  </li>;
}

function highlight(str: string, regex: string) {
  if (!regex) return str;
  const r = new RegExp(`(${regex})`, 'gi');
  return str.replace(r, '<span class="match">$1</span>');
}
