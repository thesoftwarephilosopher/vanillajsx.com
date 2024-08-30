// live playground

const b1 = <a href='/foo'>Click me</a>;

const b2 = <Button>Click me</Button>;

const b3 = <div class='foo' style='color:red' />;

function Button(attrs, children) {
  return <>{children}</>;
}
