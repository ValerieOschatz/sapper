import {
  size,
  bomb,
  bombQnt,
} from './variables';

function createGameField(firstX, firstY) {
  const field = new Array(size * size).fill(0);

  function increment(x, y) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === bomb) return;
      field[y * size + x] += 1;
    }
  }

  for (let i = 1; i <= bombQnt;) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (field[y * size + x] === bomb || (x === firstX && y === firstY)) continue;

    field[y * size + x] = bomb;

    i += 1;

    increment(x + 1, y);
    increment(x - 1, y);
    increment(x, y + 1);
    increment(x, y - 1);
    increment(x + 1, y - 1);
    increment(x - 1, y - 1);
    increment(x + 1, y + 1);
    increment(x - 1, y + 1);
  }

  return field;
}

export default createGameField;