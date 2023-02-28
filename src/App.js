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
  const [win, setWin] = useState(false);
  // const itemClassName = `item ${isHidden && 'item_hidden'}`;
  const [time, setTime] = useState(0);
  const [timeArr, setTimeArr] = useState([]);
  const [isCounting, setCounting] = useState(false);

  const [flags, setFlags] = useState(40);
  const [flagsArr, setFlagsArr] = useState([]);

  const [buttonState, setButtonState] = useState('OK');
  
  useEffect(() => {
    setField(() => createGameField(firstX, firstY));
  }, [firstX, firstY]);

  useEffect(() => {
    setTimeArr(time.toString().padStart(3, '0').split(''));
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      isCounting && setTime((time) => time <= 999 ? time += 1 : 999);
    }, 1000)

    return() => {
      clearInterval(interval);
    }
  }, [isCounting]);

  useEffect(() => {
    setFlagsArr(flags.toString().padStart(3, '0').split(''));
  }, [flags]);

  useEffect(() => {
    if (loose) {
      setButtonState('Fail');
    }

    if (win) {
      setButtonState('WIN');
    }
  }, [loose, win]);

  function restart() {
    setFirstX(null);
    setFirstY(null);
    setField([]);
    setItemView(() => new Array(size * size).fill(closedItemValue.closed));
    setLoose(false);
    setWin(false);
    setTime(0);
    setCounting(false);
    setFlags(40);
    setButtonState('OK');
  }

  return (
    <div className="App">
      <div className="content">
        <div className="menu">
          <div className="counter">
          {flagsArr.map((flag, index) => {
            return (
              <div key={index} className="item counter-item">{flag}</div>
            )}
          )}
          </div>

          <button className="button" type='button' onClick={restart}>{buttonState}</button>

          <div className="counter">
          {timeArr.map((time, index) => {
            return (
              <div key={index} className="item counter-item">{time}</div>
            )}
          )}
          </div>
        </div>

        <div className="field">
          {array.map((_, y) => {
            return (
            <div key={y} className="line">
              {array.map((_, x) => {
                return (
                <div
                  key={x}
                  className="item field-item"

                  onMouseDown={() => {
                    if (loose) return;

                    if (firstX === null && firstY === null) {
                      setFirstX(x);
                      setFirstY(y);
                      setCounting(true);
                    }

                    setButtonState('??');
                  }}

                  onClick={() => {
                    if (loose) return;

                    setButtonState('OK');

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
                      setCounting(false);
                      setLoose(true);
                    }

                    setItemView((prev) => [...prev]);
                  }}

                  onContextMenu={(e) => {
                    if (loose) return;

                    e.preventDefault();
                    e.stopPropagation();

                    if (firstX === null && firstY === null) {
                      setCounting(false);
                    }

                    if (itemView[y * size + x] === closedItemValue.notClosed) return;

                    if (itemView[y * size + x] === closedItemValue.closed) {
                      itemView[y * size + x] = closedItemValue.flag;
                      setFlags((flags) => flags > 0 ? flags -= 1 : 0);
                    } else if (itemView[y * size + x] === closedItemValue.flag) {
                      itemView[y * size + x] = closedItemValue.question;
                      setFlags((flags) => flags < 40 ? flags += 1 : 40);
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
      </div>
    </div>
  );
}

export default App;
