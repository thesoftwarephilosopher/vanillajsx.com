export default function ClickMe() {
  let i = 0;
  const el = <button>Click me</button> as HTMLButtonElement;
  el.onclick = (e) => {
    el.textContent = `Clicked ${++i} times`;
  };
  return el;
}
