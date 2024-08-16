const Colorize = (attrs: { color?: string }, children: any) => {
  return <span style={`color: ${attrs.color ?? '#91f'}`}>
    {children}
  </span>;
};

export default function ManyColors() {
  return <>
    <p><Colorize>normal</Colorize></p>
    <p><Colorize color="green">green</Colorize></p>
  </>;
}
