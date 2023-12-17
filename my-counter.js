if (!customElements.get('my-counter')) {
  const template = Object.assign(document.createElement('template'), {
    innerHTML: `
      <style>
        /* Grid layout */
        .container {
          width: 100%;
          height: 100%;
          min-height: 10rem;
          display: grid;
          grid:
            "a a" 40%
            "b c" 30% / 40% 40%
          ;
          align-content: space-evenly;
          justify-content: space-evenly;
        }
        .container #count {
          grid-area: a;
        }
        .container #increment {
          grid-area: b;
        }
        .container #decrement {
          grid-area: c;
        }

        .container {
          background: cyan;
        }
        #count {
          display: flex;
          justify-content: flex-end;
          align-items: end;

          font-size: 3em;
          line-height: 1;
        }
        button {
          font-size: 2em;
        }
      </style>

      <div class="container">
        <div id="count"><slot name="count"></slot></div>
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

      this.attachShadow({ mode: 'closed' }).append(node);
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
