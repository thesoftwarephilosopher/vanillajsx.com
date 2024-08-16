export default function ClickMe() {
  let i = 0;
  return (
    <button onclick={function (this: HTMLElement) {
      this.textContent = `Clicked ${++i} times`;
    }}>click me</button>
  );
}
