export default () => <>
  <TodoList />
</>;

function TodoList() {
  const list = new List();

  list.add('foo');
  list.add('bar').toggle();
  list.add('qux');

  const input = <input class='next' /> as HTMLInputElement;
  input.onkeydown = (e) => {
    if (e.key === 'Enter' && input.value.trim().length > 0) {
      list.add(input.value);
      input.value = '';
    }
  };

  return <div id='real-todolist'>
    <div>{input}</div>
    <div class='actions'>
      <Counter list={list} />
      <Button onclick={() => list.clearDone()}>Clear</Button>
      <Button onclick={() => list.invertAll()}><i>Invert</i></Button>
    </div>
    {list.ul}
  </div>;
}

class List extends EventTarget {

  ul = <ul class='list' /> as HTMLUListElement;
  items: Item[] = [];

  add(text: string) {
    const item = new Item(this, text);
    this.items.push(item);
    this.ul.append(item.li);
    this.dispatchEvent(new Event('item-added'));

    item.addEventListener('begin-edit', () => {
      this.items.filter(it => it !== item).forEach(it => it.cancel());
    });

    return item;
  }

  rem(item: Item) {
    this.items = this.items.filter(it => it !== item);
    this.dispatchEvent(new Event('item-removed'));
  }

  clearDone = () => this.doneItems().forEach(it => it.remove());
  invertAll = () => this.items.forEach(it => it.toggle());

  itemChanged = () => this.dispatchEvent(new Event('item-toggled'));

  doneItems = () => this.items.filter(it => it.done);

}

class Item extends EventTarget {

  done = false;
  #checkbox = <input type='checkbox' /> as HTMLInputElement;
  #span = <span onclick={() => this.edit()} /> as HTMLSpanElement;
  #input = <input type='text' onkeydown={(e: KeyboardEvent) => {
    const actions: Record<string, () => void> = {
      Escape: () => this.cancel(),
      Enter: () => this.commit(),
    };
    actions[e.key]?.();
  }} /> as HTMLInputElement;
  li;

  constructor(private list: List, private text: string) {
    super();
    this.li = (
      <li class='item'>
        {this.#checkbox}
        {this.#span}
        <button class='close' onclick={() => this.remove()}>✕</button>
      </li> as HTMLLIElement
    );
    this.#span.textContent = text;
    this.#checkbox.onclick = () => this.toggle();
  }

  remove() {
    this.li.remove();
    this.list.rem(this);
  }

  toggle() {
    if (this.#input.parentNode) {
      this.cancel();
    }

    this.done = !this.done;
    this.li.classList.toggle('done', this.done);
    this.#checkbox.checked = this.done;
    this.list.itemChanged();
  }

  edit() {
    this.dispatchEvent(new Event('begin-edit'));
    this.#input.value = this.text;
    this.#span.replaceWith(this.#input);
    this.#input.focus();
  }

  cancel() {
    this.#input.replaceWith(this.#span);
  }

  commit() {
    this.#input.replaceWith(this.#span);
    this.#span.textContent = this.text = this.#input.value;
  }

}

function Counter({ list }: { list: List }) {
  const span = <span /> as HTMLSpanElement;

  const updateText = () => {
    const done = list.doneItems().length;
    const total = list.items.length;
    span.textContent = `Done: ${done}/${total}`;
  };

  updateText();
  list.addEventListener('item-added', updateText);
  list.addEventListener('item-removed', updateText);
  list.addEventListener('item-toggled', updateText);

  return span;
}

function Button(attrs: { onclick: () => void }, children: any) {
  return <a
    href='#'
    class='action-button'
    onclick={(e: Event) => {
      e.preventDefault();
      attrs.onclick();
    }}
  >{children}</a>;
}
