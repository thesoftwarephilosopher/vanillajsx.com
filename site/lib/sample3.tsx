function TodoInput(attrs: { add: (v: string) => void }) {
  const input = <input /> as HTMLInputElement;
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      attrs.add(input.value);
      input.value = '';
    }
  };
  return input;
}

class List {
  ul = <ul /> as HTMLUListElement;
  add(v: string) {
    const item = <li>{v}</li> as HTMLLIElement;
    item.onclick = () => item.remove();
    this.ul.append(item);
  }
}

export default () => {
  const list = new List();
  return <>
    <TodoInput add={(v) => list.add(v)} />
    {list.ul}
  </>;
};

// Fuller example at https://sdegutis.github.io/imlib-todolist/
