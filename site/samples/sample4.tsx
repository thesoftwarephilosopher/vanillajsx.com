import { data } from "../fetch-dataset.js";
// Names of US citizens born in 1882 from ssa.gov

export default function FindNames() {
  const status = <p class='status' /> as HTMLParagraphElement;
  const results = <ul /> as HTMLUListElement;
  const input = <input
    type='text'
    value='.?mary?'
    autocomplete='new-password'
    oninput={updateMatches}
  /> as HTMLInputElement;

  updateMatches();
  function updateMatches() {
    const regex = new RegExp(`(${input.value})`, 'gi');
    const matched = (data.entries()
      .filter(([k]) => k.match(regex))
      .toArray());

    const matches = (Iterator.from(matched)
      .map(match => <Item regex={regex} match={match} />)
      .take(25));

    results.replaceChildren(...matches);
    status.textContent = `${matched.length} / ${data.size}`;
  }

  return <div>{input}{status}{results}</div>;
}

function Item(attrs: { match: [string, number], regex: RegExp }) {
  const [name, count] = attrs.match;
  const total = <small style='color:#fff3'>({count})</small>;
  return <li>
    <span innerHTML={highlight(name, attrs.regex)} /> {total}
  </li>;
}

function highlight(str: string, regex: RegExp) {
  return str.replace(regex, '<span class="match">$1</span>');
}
