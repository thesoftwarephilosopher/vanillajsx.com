export default () => <>
  <TodoList />
</>;

function TodoList() {
  const list = new List();

  list.add('foo');
  list.add('bar').toggle();
  list.add('qux');

  const input = <input class='next' autofocus /> as HTMLInputElement;
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
      <ActionButton onclick={() => list.clearDone()}>Clear done</ActionButton>
      <ActionButton onclick={() => list.invertAll()}><i>Invert</i> all</ActionButton>
    </div>
    {list.ul}
  </div>;
}

class List {

  ul = <ul class='list' /> as HTMLUListElement;
  #items: Item[] = [];

  onchange?: () => void;

  add(text: string) {
    const item = new Item(this, text);
    this.#items.push(item);
    this.ul.append(item.li);
    this.onchange?.();
    return item;
  }

  rem(item: Item) {
    this.#items = this.#items.filter(it => it !== item);
    this.onchange?.();
  }

  clearDone() {
    this.doneItems().forEach(it => it.remove());
  }

  invertAll() {
    this.#items.forEach(it => it.toggle());
  }

  doneItems() {
    return this.#items.filter(it => it.done);
  }

  itemChanged() {
    this.onchange?.();
  }

}

class Item {

  done = false;
  #checkbox = <input type='checkbox' /> as HTMLInputElement;
  li;

  constructor(private list: List, public text: string) {
    this.li = (
      <li class='item'>
        {this.#checkbox}
        <span onclick={() => this.toggle()}>{text}</span>
        <button class='close' onclick={() => this.remove()}>✕</button>
      </li> as HTMLLIElement
    );
    this.#checkbox.onclick = () => this.toggle();
  }

  remove() {
    this.li.remove();
    this.list.rem(this);
  }

  toggle() {
    this.done = !this.done;
    this.li.classList.toggle('done', this.done);
    this.#checkbox.checked = this.done;
    this.list.itemChanged();
  }

}

function Counter({ list }: { list: List }) {
  const span = <span /> as HTMLSpanElement;

  const updateText = () => {
    span.textContent = `Done: ${list.doneItems().length}`;
  };

  updateText();
  list.onchange = updateText;

  return span;
}

function ActionButton(attrs: { onclick: () => void }, children: any) {
  return <a
    href='#'
    class='action-button'
    onclick={(e: Event) => {
      e.preventDefault();
      attrs.onclick();
    }}
  >{children}</a>;
}
