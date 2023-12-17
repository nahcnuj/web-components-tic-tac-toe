/**
 * Calculates a winner of the Tic-tac-toe game.
 * @param {string[]} squares
 * @returns a winner of the game
 * @see https://ja.react.dev/learn/tutorial-tic-tac-toe#declaring-a-winner
 * @copyright 2023 Meta Open Source
 * @license CC-BY-4.0
 */
export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};
