import { useEffect, useState } from 'react';
import './App.css';

import createGameField from './utils/createGameField';

import {
  size,
  bomb,
  closedItemValue,
} from './utils/variables';

function App() {
  const array = new Array(size).fill(null);
  const [firstX, setFirstX] = useState(null);
  const [firstY, setFirstY] = useState(null);
  const [field, setField] = useState([]);
  const [itemView, setItemView] = useState(() => new Array(size * size).fill(closedItemValue.closed));
  const [loose, setLoose] = useState(false);
  // const itemClassName = `item ${isHidden && 'item_hidden'}`;

  useEffect(() => {
    setField(() => createGameField(firstX, firstY));
  }, [firstX, firstY]);

  return (
    <div className="App">
      {array.map((_, y) => {
        return (
        <div key={y} className="line">
          {array.map((_, x) => {
            return (
            <div
              key={x}
              className="item"

              onMouseDown={() => {
                if (firstX === null && firstY === null) {
                  setFirstX(x);
                  setFirstY(y);
                }
              }}

              onClick={() => {
                if (itemView[y * size + x] === closedItemValue.notClosed) return;

                const openingArr = [];

                function openItem(x, y) {
                  if (x >= 0 && x < size && y >= 0 && y < size) {
                    if (itemView[y * size + x] === closedItemValue.notClosed) return;
                    openingArr.push([x, y]);
                  }
                }

                openItem(x, y);

                while (openingArr.length) {
                  const [x, y] = openingArr.pop();
                  itemView[y * size + x] = closedItemValue.notClosed;
                  if (field[y * size + x] !== 0) continue;
                  openItem(x + 1, y);
                  openItem(x - 1, y);
                  openItem(x, y + 1);
                  openItem(x, y - 1);
                }

                if (field[y * size + x] === bomb) {
                  field.forEach((item, index) => {
                    if (item === bomb) {
                      itemView[index] = closedItemValue.notClosed;
                    }
                  })

                  setLoose(true);
                }

                setItemView((prev) => [...prev]);
              }}

              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (itemView[y * size + x] === closedItemValue.notClosed) return;
                if (itemView[y * size + x] === closedItemValue.closed) {
                  itemView[y * size + x] = closedItemValue.flag;
                } else if (itemView[y * size + x] === closedItemValue.flag) {
                  itemView[y * size + x] = closedItemValue.question;
                } else if (itemView[y * size + x] === closedItemValue.question) {
                  itemView[y * size + x] = closedItemValue.closed;
                }

                setItemView((prev) => [...prev]);
              }}
              >
                {itemView[y * size + x] !== closedItemValue.notClosed ?
                itemView[y * size + x] :
                field[y * size + x]}
            </div>
            );
          })}
        </div>)
      })}
    </div>
  );
}

export default App;
