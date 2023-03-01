const size = 16;
const bomb = 'bomb';
const currentBomb = 'current-bomb';
const foundBomb = 'found-bomb';
const bombQnt = 40;
const startTime = 0;
const endTime = 999;

const closedItemValue = {
  notClosed: 'notClosed',
  closed: 'closed',
  flag: 'flag',
  question: 'question',
  willOpen: 'willOpen',
  willOpenQuestion: 'willOpenQuestion',
};

const buttonValue = {
  ok: 'ok',
  wait: 'wait',
  loose: 'loose',
  win: 'win',
  pressed: 'pressed',
};

export {
  size,
  bomb,
  currentBomb,
  foundBomb,
  bombQnt,
  closedItemValue,
  buttonValue,
  startTime,
  endTime,
}
