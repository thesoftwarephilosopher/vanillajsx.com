function TodoInput(attrs: { add: (v: string) => void }) {
  const input = <input type='text' /> as HTMLInputElement;
  input.placeholder = 'Add todo item...';
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      attrs.add(input.value);
      input.value = '';
    }
  };
  return input;
}

class TodoList {
  ul = <ul class='todolist' /> as HTMLUListElement;
  add(v: string) {
    const item = <li>{v}</li> as HTMLLIElement;
    item.onclick = () => item.remove();
    this.ul.append(item);
  }
}

export default () => {
  const list = new TodoList();
  list.add('foo');
  list.add('bar');
  return <>
    <TodoInput add={(v) => list.add(v)} />
    {list.ul}
  </>;
};
