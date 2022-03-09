const castle = document.querySelector('.castle');
const empties = document.querySelectorAll('.empty');
const gameStartButton = document.querySelector('#game-start-btn');
const bug = document.querySelector('.bug');
const timer = document.querySelector('.timer');
const bugStartX = 65;
const bugStartY = 65;

let time = 0;
let inProgress = false;
let gameProgress;
let castlePosition;
let bugX = bugStartX;
let bugY = bugStartY;

const getCastlePosition = () => {
  return parseInt(castle.parentElement.dataset['position']);
}

const getAbsoluteTop = (element) => {
  return window.pageYOffset + element.getBoundingClientRect().top;
}

const getAbsoluteLeft = (element) => {
  return window.pageXOffset + element.getBoundingClientRect().left;
}

const getRelativeTop = (element) => {
  const parentElement = element.parentElement;
  const parentAbsoluteTop = getAbsoluteTop(parentElement);
  const absoluteTop = getAbsoluteTop(element);

  return absoluteTop - parentAbsoluteTop;
}

const getRelativeLeft = (element) => {
  const parentElement = element.parentElement;
  const parentAbsoluteLeft = getAbsoluteLeft(parentElement);
  const absoluteLeft = getAbsoluteLeft(element);

  return absoluteLeft - parentAbsoluteLeft;
}

const getAxis = (element) => {
  return [getRelativeTop(element), getRelativeLeft(element)];
}

const dragStart = (e) => {
  const dragingElement = e.currentTarget
  dragingElement.className += ' hold';
}

const dragEnd = (e) => {
  e.currentTarget.className = 'castle';
  castlePosition = getCastlePosition();
}

const dragOver = (e) => {
  e.preventDefault()
}

const dragEnter = (e) => {
  e.preventDefault()
  e.currentTarget.className += ' hovered'
}

const dragLeave = (e) => {
  e.currentTarget.className = 'empty'
}

const dragDrop = (e) => {
  e.currentTarget.className = 'empty'
  e.currentTarget.append(castle)
}

const resetBugPosition = () => {
  bug.style.left = bugX + 'px';
  bug.style.top = bugY + 'px';
}

const onClick = (e) => {
  inProgress = !inProgress;

  if(inProgress) {
    gameStartButton.innerText = 'Pause'

    gameProgress = game();
    timerProgress = setTimer();
  } else {
    gameStartButton.innerText = 'Start!'

    clearInterval(gameProgress);
    clearInterval(timerProgress);
  }
}

const resetGame = () => {
  bugX = bugStartX;
  bugY = bugStartY;
  inProgress = false;
  time = 0;
  gameStartButton.innerText = 'Start!'
  timer.innerText = time + ' s';
}

const game = () => {
  return setInterval(() => {
    const AXIS_START = 5;
    const AXIS_END = 125;
    const SPEED = 2;
    const randPosition = [[[-1, 0], [0, -1]], [[-1, 0], [0, 1]], [[1, 0], [0, -1]], [[1, 0], [0, 1]]]
    const dir = randPosition[castlePosition][Math.floor(Math.random() * (2))];

    if((bugY >= AXIS_END || bugY <= AXIS_START) && (bugX >= AXIS_END || bugX <= AXIS_START)) {
      clearInterval(timerProgress);
      clearInterval(gameProgress);
      window.alert(`Game Over! Survive Time: ${time}s`);
      resetGame();
    } else if(bugY >= AXIS_END && castlePosition >= 2) {
      bugX += [-1, 1, -1, 1][castlePosition] * SPEED;
    } else if(bugY <= AXIS_START && castlePosition < 2) {
      bugX += [-1, 1, -1, 1][castlePosition] * SPEED;
    } else if(bugX >= AXIS_END && (castlePosition % 2 == 1)) {
      bugY += [-1, -1, 1, 1][castlePosition] * SPEED;
    } else if(bugX <= AXIS_START && (castlePosition % 2 == 0)) {
      bugY += [-1, -1, 1, 1][castlePosition] * SPEED;
    } else {
      bugY += dir[0] * SPEED;
      bugX += dir[1] * SPEED;
    }
    
    resetBugPosition();
  },50);
}

const setTimer = () => {
  return setInterval(() => {
    time += 1;
    timer.innerText = time + ' s';
  }, 1000)
}

window.onload = () => {
  castlePosition = getCastlePosition();
  resetBugPosition();

  castle.addEventListener('dragstart', dragStart);
  castle.addEventListener('dragend', dragEnd);
  gameStartButton.addEventListener('click', onClick);
  
  for(const empty of empties) {
    empty.addEventListener('dragover', dragOver)
    empty.addEventListener('dragenter', dragEnter)
    empty.addEventListener('dragleave', dragLeave)
    empty.addEventListener('drop', dragDrop)
  }
}