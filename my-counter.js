if (!customElements.get('my-counter')) {
  const template = document.createElement('template');
  template.innerHTML = `
    <div>Count: <slot name="count"></slot></div>
    <button id="increment">Increment</button>
    <button id="decrement">Decrement</button>
  `;

  customElements.define('my-counter', class extends HTMLElement {
    #binding = {};

    static get observedAttributes() {
      return ['count'];
    }

    constructor() {
      super();

      const node = template.content.cloneNode(true);
      const counter = this.#binding.count = Object.assign(document.createElement('span'), {
        slot: 'count',
        textContent: '0',
      });
      node.querySelector("slot[name='count']").replaceWith(counter);

      const root = this.attachShadow({ mode: 'open' });
      root.append(node);
      root.querySelector('#increment').addEventListener('click', (() => {
        this.#count++;
      }).bind(this));
      root.querySelector('#decrement').addEventListener('click', (() => {
        this.#count--;
      }).bind(this));
    }

    set #count(value) {
      this.setAttribute('count', value.toString());
    }

    get #count() {
      return parseInt(this.getAttribute('count') ?? "0", 10);
    }

    attributeChangedCallback(name, _, next) {
      this.#binding[name].textContent = next;
    }
  });
}
