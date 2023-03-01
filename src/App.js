import { useEffect, useState } from 'react';
import './App.css';

import createGameField from './utils/createGameField';

import {
  size,
  bomb,
  currentBomb,
  foundBomb,
  closedItemValue,
  bombQnt,
} from './utils/variables';

function App() {
  const array = new Array(size).fill(null);
  const [firstX, setFirstX] = useState(null);
  const [firstY, setFirstY] = useState(null);
  const [field, setField] = useState([]);
  const [itemView, setItemView] = useState(() => new Array(size * size).fill(closedItemValue.closed));
  const [loose, setLoose] = useState(false);
  const [win, setWin] = useState(false);
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
  };

  function handleMouseDown(evt, x, y) {
    if (loose || win) return;

    if (evt.button === 0) {
      if (firstX === null && firstY === null) {
        setFirstX(x);
        setFirstY(y);
        
        setCounting(true);
      }
      setButtonState('??');

      if (itemView[y * size + x] === closedItemValue.closed) {
        itemView[y * size + x] = closedItemValue.willOpen;
      }

      if (itemView[y * size + x] === closedItemValue.question) {
        itemView[y * size + x] = closedItemValue.willOpenQuestion;
      }
    }
  };

  function handleClick(x, y) {
    if (loose || win) return;

    setButtonState('OK');

    if (itemView[y * size + x] === closedItemValue.notClosed || itemView[y * size + x] === closedItemValue.flag) return;

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
      field[y * size + x] = currentBomb;

      itemView.forEach((item, index) => {
        if (item === closedItemValue.flag) {
          field[index] = foundBomb;
        }
      })

      field.forEach((item, index) => {
        if (item === bomb || item === foundBomb) {
          itemView[index] = closedItemValue.notClosed;
        }
      })

      setLoose(true);
      setCounting(false);
    }

    if (field[y * size + x] !== bomb) {
      const openedItemsQnt = itemView.filter((item) => item === closedItemValue.notClosed).length;
      
      if (openedItemsQnt === size * size - bombQnt) {
        setWin(true);
        setCounting(false);
      }
    }

    setItemView((prev) => [...prev]);
  };

  function handleContextMenu(evt, x, y) {
    if (loose || win) return;

    evt.preventDefault();
    evt.stopPropagation();

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
  };

  return (
    <div className="App">
      <div className="content">
        <div className="menu">
          <div className="counter">
            {flagsArr.map((flag, index) => {
              return (
                <div key={index} className="counter-item">{flag}</div>
              )}
            )}
          </div>

          <button className="button" type='button' onClick={restart}>{buttonState}</button>

          <div className="counter">
            {timeArr.map((time, index) => {
              return (
                <div key={index} className="counter-item">{time}</div>
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
                    className={`
                      item field-item 
                      ${itemView[y * size + x] === closedItemValue.closed && 'field-item-closed'} 
                      ${itemView[y * size + x] === closedItemValue.willOpen && 'field-item-will-open'} 
                      ${itemView[y * size + x] === closedItemValue.flag && 'field-item-flag'} 
                      ${itemView[y * size + x] === closedItemValue.question && 'field-item-question'} 
                      ${itemView[y * size + x] === closedItemValue.willOpenQuestion && 'field-item-will-open-question'} 
                      ${itemView[y * size + x] === closedItemValue.notClosed && `field-item-${field[y * size + x]}`}
                    `}

                    onMouseDown={(evt) => {
                      handleMouseDown(evt, x, y);
                    }}

                    onClick={() => {
                      handleClick(x, y);
                    }}

                    onContextMenu={(evt) => {
                      handleContextMenu(evt, x, y);
                    }}
                    >
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
