import { getData } from "../helpers.js";

const groups = await getData();

export default function FindNames() {
  const status = <p style='margin:1em 0' /> as HTMLParagraphElement;
  const list = <ul /> as HTMLUListElement;
  const input = <input
    value='eri(c|k)a?'
    autocomplete='new-password'
  /> as HTMLInputElement;

  const updateMatches = () => {
    const matched = (groups.entries()
      .filter(g => g[0].match(input.value))
      .toArray());

    const matches = (Iterator.from(matched)
      .map(match => <Item match={match} />)
      .take(20)
      .toArray());

    list.replaceChildren(...matches);
    status.textContent = `${matched.length} / ${groups.size}`;
  };

  input.oninput = updateMatches;
  updateMatches();

  return <>{input}{status}{list}</>;
}

function Item({ match: [name, group] }: { match: [string, any[]] }) {
  return <li>{name} ({group.length})</li>;
}
