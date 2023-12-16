if (!customElements.get('my-counter')) {
  const template = Object.assign(document.createElement('template'), {
    innerHTML: `
      <style>
        :host {
          display: inline-block;
        }

        .container {
          padding: 1.2rem;
          background: cyan;
          line-height: 1.2;
          text-align: center;

          display: grid;
          grid:
            "a a"
            "b c" / 6rem 6rem
          ;
          column-gap: 1rem;

          .count {
            grid-area: a;
          }
          #increment {
            grid-area: b;
          }
          #decrement {
            grid-area: c;
          }
        }

        .count {
          // width: 100%;
          font-size: 3rem;
          text-align: right;
        }
        button {
          width: 100%;
          font-size: 2rem;
        }
      </style>

      <div class="container">
        <div class="count"><slot name="count"></slot></div>
        <button id="increment">+</button>
        <button id="decrement">&minus;</button>
      </div>
    `,
  });

  customElements.define('my-counter', class extends HTMLElement {
    /**
     * A map of elements to bind to slots in the template.
     * @type {Record<string, Node>}
     */
    #slots = {
      count: Object.assign(document.createElement('span'), {
        slot: 'count',
        textContent: this.#count,
      }),
    };

    static get observedAttributes() {
      return ['count'];
    }

    constructor() {
      super();

      const node = template.content.cloneNode(true);
      for (const name in this.#slots) {
        node.querySelector(`slot[name='${name}']`).replaceWith(this.#slots[name]);
      }
      node.querySelector('#increment').addEventListener('click', (() => {
        this.#count++;
      }).bind(this));
      node.querySelector('#decrement').addEventListener('click', (() => {
        this.#count--;
      }).bind(this));

      const root = this.attachShadow({ mode: 'closed' });
      root.append(node);
    }

    set #count(value) {
      this.setAttribute('count', value.toString());
    }

    get #count() {
      return parseInt(this.getAttribute('count') ?? "0", 10);
    }

    attributeChangedCallback(name, _, next) {
      this.#slots[name].textContent = next;
    }
  });
}
