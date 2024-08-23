// sample 0

document.querySelectorAll<HTMLElement /* foo */>('.sample');
function foo$<K, V, T extends Map<K, V>>(): Required<ReturnType<T['clear']>> {
  return null as any;
}

const foo1 = 3;
let foo2 = 3;
var foo3 = 3;

foo3 = foo2 = foo1;

(function () { const foo = 3; })();
(class { bar = 4; });

function foo$two<T>(a: any) {
  return undefined as T;
}

foo$two(foo$());

// sample 1

export function ClickMe() {
  let i = 0;
  const el = <button>Click me</button> as HTMLButtonElement;
  el.onclick = (e) => {
    el.textContent = `Clicked ${++i} times`;
  };
  return el;
}

// sample 2

export default () => <>
  <p><ClickMe /></p>
  <p><ClickMe /></p>
  <p><ClickMe /></p>
</>;

// sample 3

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

class todoList$1<T extends {}> {
  ul = <ul class='todolist' /> as HTMLUListElement;
  add(v: string) {
    const item = <li>{v}</li> as HTMLLIElement;
    item.onclick = () => item.remove();
    this.ul.append(item);
  }
}

export const sample3 = () => {
  const list = new todoList$1();
  list.add('foo');
  list.add('bar');
  return <>
    <TodoInput add={(v) => list.add(v)} />
    {list.ul}
  </>;
};

// sample 4

declare const data: Map<string, number>;
// Names of US citizens born in 1882 from ssa.gov

export function FindNames() {
  const status = <p class='status' /> as HTMLParagraphElement;
  const results = <ul /> as HTMLUListElement;
  const input = <input
    type='text'
    value='.?mary?'
    autocomplete='new-password'
    oninput={updateMatches}
  /> as HTMLInputElement;

  updateMatches();
  function updateMatches() {
    const regex = new RegExp(`(${input.value})`, 'gi');
    const matched = ([...data.entries()]
      .filter(([k]) => k.match(regex)));

    const matches = (matched
      .slice(0, 25)
      .map(match => <Item1 regex={regex} match={match} />));

    results.replaceChildren(...matches);
    status.textContent = `${matched.length} / ${data.size}`;
  }

  return <div>{input}{status}{results}</div>;
}

function Item1(attrs: { match: [string, number], regex: RegExp }) {
  const [name, count] = attrs.match;
  const total = <small style='color:#fff3'>({count})</small>;
  return <li>
    <span innerHTML={highlight(name, attrs.regex)} /> {total}
  </li>;
}

function highlight(str: string, regex: RegExp) {
  return str.replace(regex, '<span class="match">$1</span>');
}

// sample 5

export const sample5 = () => <>
  <TodoList />
</>;

function TodoList() {
  const list = new List();

  list.add('foo');
  list.add('bar').toggle();
  list.add('qux');

  const input = <input type='text' /> as HTMLInputElement;
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
      <button onclick={() => list.clearDone()}>Clear</button>
      <button onclick={() => list.invertAll()}><i>Invert</i></button>
    </div>
    {list.ul}
  </div>;
}

class List extends EventTarget {

  ul = <ul class='list' /> as HTMLUListElement;
  items: Item[] = [];
  itemUnlisteners = new Map<Item, () => void>();

  add(text: string) {
    const item = new Item(this, text);
    this.items.push(item);
    this.ul.append(item.li);
    this.dispatchEvent(new Event('item-added'));

    this.itemUnlisteners.set(item, listen(item, 'toggled', () => {
      this.dispatchEvent(new Event('item-toggled'));
    }));

    return item;
  }

  rem(item: Item) {
    const unlisten = this.itemUnlisteners.get(item)!;
    this.itemUnlisteners.delete(item);
    unlisten();

    this.items = this.items.filter(it => it !== item);
    this.dispatchEvent(new Event('item-removed'));
  }

  clearDone = () => this.doneItems().forEach(it => it.remove());
  invertAll = () => this.items.forEach(it => it.toggle());

  doneItems = () => this.items.filter(it => it.done);

}

class Item extends EventTarget {

  done = false;
  #checkbox = <input type='checkbox' /> as HTMLInputElement;
  li;

  constructor(private list: List, text: string) {
    super();
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
    this.dispatchEvent(new Event('toggled'));
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

function listen(target: EventTarget, event: string, fn: () => void) {
  target.addEventListener(event, fn);
  return () => target.removeEventListener(event, fn);
}
