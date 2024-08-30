// live playground

const b1 = <a {...attrs} href='/foo'>Click me</a>;

const b2 = <Button w={3} h={4}>Click me</Button>;

const b3 = <div class='foo' style='color:red' />;

function Button(attrs, children) {
  return <>Button title: {...children}.</>;
}
