import { Board } from './classes/board.js'
import { addIcon, addItem, deepCopy, makeCounter } from './modules/helper.js'
import {
  checkWin,
  createBoard,
  highlightPattern,
  toggleSymbol,
  updateScore,
} from './modules/game.js'

const container = document.querySelector('[data-board]')
const modal = document.querySelector('[data-modal]')

const moveHistory = document.querySelector('[data-list]')
const btnContinue = document.querySelector('[data-btn="continue"]')

const btnHistory = document.querySelector('[data-btn="history"]')
const btnUndo = document.querySelector('[data-btn="undo"]')
const btnRestart = document.querySelector('[data-btn="restart"]')
const btnRedo = document.querySelector('[data-btn="redo"]')

const TEMPLATE = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

let degree = 0
let symbol = 'x'
let pattern = []
let boardList = []
let board = deepCopy(TEMPLATE)
let counter = makeCounter()
boardList.push(new Board(deepCopy(board)))

const rows = Array.from(container.children)
rows.forEach((cols, y) => {
  Array.from(cols.children).forEach((div, x) => {
    div.addEventListener('click', () => {
      if (!div.hasChildNodes()) {
        if (counter.value() < boardList.length - 1) {
          pattern = []
          boardList.splice(counter.value() + 1, boardList.length - 1)
          board = deepCopy(boardList[boardList.length - 1].state)
        }

        board[y][x] = symbol
        div.append(addIcon(symbol))

        const newBoard = new Board(deepCopy(board), symbol, [y, x])
        const turn = boardList.push(newBoard) - 1
        counter.changeValue(turn)

        if (turn > 4) {
          const result = checkWin(boardList[turn].state, symbol)
          updateScore(result.hasWon, turn, symbol)
          if (result.hasWon) {
            pattern = result.pattern
            highlightPattern(pattern, rows)
          }
        }
        symbol = toggleSymbol(symbol)
      }
    })
  })
})

const displayBoard = (cb) => {
  const index = cb()
  createBoard(rows, boardList[index].state)
  return boardList[index]
}

const reset = () => {
  if (boardList.length > 1) {
    container.style.transform = `rotate(${(degree += 360)}deg)`
  }

  pattern = []
  boardList = []
  board = deepCopy(TEMPLATE)
  boardList.push(new Board(deepCopy(board)))
  counter.changeValue(0)
  moveHistory.innerHTML = ''
  rows.forEach((cols) =>
    Array.from(cols.children).forEach((div) => div.removeAttribute('style'))
  )
  return counter.value()
}

btnUndo.addEventListener('click', () => {
  const board = displayBoard(() => counter.decrement())
  symbol = toggleSymbol(board.symbol)

  rows.forEach((cols) => {
    Array.from(cols.children).forEach((div) => div.removeAttribute('style'))
  })
})

btnRedo.addEventListener('click', () => {
  const board = displayBoard(() => counter.increment(boardList.length - 1))
  symbol = board.symbol

  if (counter.value() === boardList.length - 1) {
    highlightPattern(pattern, rows)
  }
})

btnRestart.addEventListener('click', () => displayBoard(reset))

btnHistory.addEventListener('click', () => {
  const moveContainer = document.querySelector('[data-container="moves"]')
  if (boardList.length === 1) {
    moveHistory.style.display = 'none'
    moveContainer.style.display = 'flex'
  } else {
    moveHistory.style.display = 'block'
    moveContainer.style.display = 'none'

    boardList.forEach((board, i) => {
      if (i !== 0) {
        moveHistory.append(addItem(`${i}. ${board.toString()}`))
      }
    })
  }

  modal.showModal()
})

btnContinue.addEventListener('click', () => {
  moveHistory.innerHTML = ''
  modal.close()
})
