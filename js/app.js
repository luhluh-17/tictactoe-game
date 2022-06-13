import { Board } from './classes/board.js'
import {
  addIcon,
  addItem,
  boxColor,
  deepCopy,
  deleteChildren,
  makeCounter,
} from './modules/helper.js'
import {
  checkWin,
  displayBoard,
  highlightPattern,
  toggleSymbol,
  updateScore,
} from './modules/game.js'

const container = document.querySelector('[data-board]')

const btnHistory = document.querySelector('[data-btn="history"]')
const modal = document.querySelector('[data-modal]')
const btnContinue = document.querySelector('[data-btn="continue"]')
const list = document.querySelector('[data-list]')

const btnUndo = document.querySelector('[data-btn="undo"]')
const btnRestart = document.querySelector('[data-btn="restart"]')
const btnRedo = document.querySelector('[data-btn="redo"]')

const TEMPLATE = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

let symbol = 'x'
let boardStates = []
let board = deepCopy(TEMPLATE)
boardStates.push(new Board(deepCopy(board)))
let counter = makeCounter()

const rows = Array.from(container.children)
rows.forEach((cols, y) => {
  Array.from(cols.children).forEach((div, x) => {
    div.addEventListener('click', () => {
      if (!div.hasChildNodes()) {
        if (counter.value() < boardStates.length - 1) {
          boardStates.splice(counter.value() + 1, boardStates.length - 1)
          board = deepCopy(boardStates[boardStates.length - 1].state)
        }

        board[y][x] = symbol
        div.append(addIcon(symbol))

        const newBoard = new Board(deepCopy(board), symbol, [y, x])
        const turn = boardStates.push(newBoard) - 1
        counter.changeValue(turn)

        if (turn > 4) {
          const result = checkWin(boardStates[turn].state, symbol)
          updateScore(result.hasWon, turn, symbol)
          highlightPattern(result, rows)
        }
        symbol = toggleSymbol(symbol)
      }
    })
  })
})

btnUndo.addEventListener('click', () => {
  const turn = counter.decrement()
  displayBoard(rows, boardStates[turn].state)
  symbol = toggleSymbol(boardStates[turn].symbol)

  rows.forEach((cols) => {
    Array.from(cols.children).forEach((div) => {
      div.style.backgroundColor = boxColor('background')
    })
  })
})

btnRedo.addEventListener('click', () => {
  const turn = counter.increment(boardStates.length - 1)
  displayBoard(rows, boardStates[turn].state)

  const result = checkWin(boardStates[turn].state, symbol)
  highlightPattern(result, rows)

  symbol = toggleSymbol(boardStates[turn].symbol)
})

btnRestart.addEventListener('click', () => {
  boardStates = []
  board = deepCopy(TEMPLATE)
  boardStates.push(new Board(deepCopy(board)))
  counter.changeValue(0)
  displayBoard(rows, board)
  deleteChildren(list)

  rows.forEach((cols) => {
    Array.from(cols.children).forEach((div) => {
      div.style.backgroundColor = boxColor('background')
    })
  })
})

btnHistory.addEventListener('click', () => {
  const img = document.querySelector('[data-img]')
  if (boardStates.length === 1) {
    list.style.display = 'none'
    img.style.display = 'flex'
  } else {
    list.style.display = 'block'
    img.style.display = 'none'

    boardStates.forEach((board, i) => {
      if (i == 0) {
        return
      } else {
        list.append(addItem(`${i}. ${board.toString()}`))
      }
    })
  }

  modal.showModal()
})

btnContinue.addEventListener('click', () => {
  deleteChildren(list)
  modal.close()
})
