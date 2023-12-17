import { calculateWinner } from "./lib.js";

/**
 * Define a custom element if it is not defined yet.
 * @param {string} name a Custom Element name
 * @param {CustomElementConstructor} constructor a Custom Element constructor
 */
const defineCustomElementIfNotDefined = (name, constructor) => {
  if (customElements.get(name)) {
    console.warn(`Custom Element ${name} is already defined, skipping.`);
    return;
  }
  customElements.define(name, constructor);
}

class Square extends HTMLElement {
  static TEMPLATE = Object.assign(document.createElement('template'), {
    innerHTML: `
      <style>
        .square {
          display: block;
          height: 100%;
          aspect-ratio: 1 / 1;
          box-sizing: border-box;
          border: thin solid black;
          background: whitesmoke;
          font-size: 100%;
        }
      </style>

      <button class="square" id="value" aria-label="Cell"></button>
    `,
  });

  static get observedAttributes() {
    return ['value'];
  }

  constructor() {
    super();

    const node = this.constructor.TEMPLATE.content.cloneNode(true);

    this.attachShadow({ mode: 'open' }).append(node);
  }

  attributeChangedCallback(name, _, next) {
    this.shadowRoot.querySelector(`#${name}`).textContent = next;
  }
}

class Board extends HTMLElement {
  static TEMPLATE = Object.assign(document.createElement('template'), {
    innerHTML: `
      <style>
        :host {
          --gutter: 1rem;

          height: 100%;
          aspect-ratio: 1 / 1;
          margin-inline: auto;

          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 1rem;

          font-size: 2rem;
        }
      </style>

      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
      <tic-tac-toe-square></tic-tac-toe-square>
    `,
  });

  #xIsNext = true;
  #handleClick;

  constructor() {
    super();

    const node = this.constructor.TEMPLATE.content.cloneNode(true);

    this.attachShadow({ mode: 'open' }).append(node);

    this.#handleClick = ((event) => {
      const target = event.currentTarget;
      if (target instanceof Square) {
        if (target.getAttribute('value') || this.calculateWinner) {
          return;
        }
        target.setAttribute('value', this.#xIsNext ? 'X' : 'O');
        const winner = this.calculateWinner;
        if (winner) {
          this.dispatchEvent(new CustomEvent('gamefinished', { detail: { winner } }));
        }
        this.advanceTurn();
      }
    }).bind(this);
  }

  connectedCallback() {
    for (const square of this.shadowRoot.querySelectorAll('tic-tac-toe-square')) {
      square.addEventListener('click', this.#handleClick);
    }
  }

  disconnectedCallback() {
    for (const square of this.shadowRoot.querySelectorAll('tic-tac-toe-square')) {
      square.removeEventListener('click', this.#handleClick);
    }
  }

  advanceTurn() {
    this.#xIsNext = !this.#xIsNext;
  }

  get calculateWinner() {
    const squares = Array.from(this.shadowRoot.querySelectorAll('tic-tac-toe-square')).map((square) => square.getAttribute('value'));
    return calculateWinner(squares);
  }
}

class TicTacToe extends HTMLElement {
  static TEMPLATE = Object.assign(document.createElement('template'), {
    innerHTML: `
      <style>
        /* Grid layout */
        :host {
          width: 100%;
          height: 100%;

          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 1rem;
        }
      </style>

      <tic-tac-toe-board id="board"></tic-tac-toe-board>
      <div id="status">
        <slot name="winner">Progressing...</slot>
      </div>
    `,
  });

  #handleFinished;

  constructor() {
    super();

    const node = this.constructor.TEMPLATE.content.cloneNode(true);

    this.attachShadow({ mode: 'open' }).append(node);

    this.#handleFinished = (({ detail }) => {
      this.shadowRoot.querySelector("slot[name=winner]").replaceWith(
        Object.assign(document.createElement('div'), {
          slot: 'winner',
          textContent: `Winner: ${detail.winner}`,
        }),
      );
    }).bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('tic-tac-toe-board').addEventListener('gamefinished', this.#handleFinished);
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('tic-tac-toe-board').removeEventListener('gamefinished', this.#handleFinished);
  }
};

defineCustomElementIfNotDefined('tic-tac-toe-square', Square);
defineCustomElementIfNotDefined('tic-tac-toe-board', Board);
defineCustomElementIfNotDefined('tic-tac-toe', TicTacToe);
