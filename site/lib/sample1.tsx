export default function ClickMe() {
  let i = 0;
  const el = <button>click me</button> as HTMLButtonElement;
  el.onclick = (e) => {
    el.textContent = `clicked ${++i} times`;
  };
  return el;
}
