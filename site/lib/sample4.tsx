export default function Uppercaser() {
  const input = <input /> as HTMLInputElement;
  const p = <p /> as HTMLParagraphElement;
  input.oninput = () =>
    p.textContent = input.value.toUpperCase();
  return <>{input}{p}</>;
}
