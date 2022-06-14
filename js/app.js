import { Board } from './classes/board.js'
import { icon, imageText, unorderedList } from './modules/element.js'
import { deepCopy, loopBoardItem, makeCounter } from './modules/helper.js'
import {
  checkWin,
  createBoard,
  highlightPattern,
  toggleSymbol,
  updateScore,
} from './modules/game.js'

const container = document.querySelector('[data-board]')
const modal = document.querySelector('[data-modal]')

const contentHistory = document.querySelector('[data-content="history"]')
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
let moveList = []
let boardList = []
let board = deepCopy(TEMPLATE)
let counter = makeCounter()
boardList.push(new Board(deepCopy(board)))

const removeUnusedState = () => {
  pattern = []
  boardList.splice(counter.value() + 1, boardList.length)
  board = deepCopy(boardList[boardList.length - 1].state)
}

const displayBoard = (index) => {
  createBoard(container, boardList[index].state)
  return boardList[index]
}

const addIteminMoveList = (action, turn) => {
  if (action === 'undo') {
    turn += 1
  }
  const text = `${action} - Turn ${turn}`
  if (moveList.at(-1) !== text) {
    moveList.push(text)
  }
}

const reset = () => {
  if (boardList.length > 1) {
    container.style.transform = `rotate(${(degree += 360)}deg)`
    pattern = []
    moveList = []
    boardList = []
    board = deepCopy(TEMPLATE)
    boardList.push(new Board(deepCopy(board)))
    loopBoardItem(container, (btn) => {
      btn.disabled = false
      btn.removeAttribute('style')
    })
  }
  return counter.changeValue(0)
}

loopBoardItem(container, (btn, i, j) => {
  btn.addEventListener('click', () => {
    if (!btn.hasChildNodes()) {
      if (counter.value() < boardList.length - 1) {
        removeUnusedState()
      }

      board[i][j] = symbol
      btn.append(icon(symbol))

      let turn = boardList.length
      const newBoard = new Board(deepCopy(board), turn, symbol, [i, j])
      moveList.push(newBoard.toString())

      turn = counter.changeValue(boardList.push(newBoard) - 1)

      if (turn > 4) {
        const result = checkWin(boardList[turn].state, symbol)
        updateScore(result.hasWon, turn, symbol)
        if (result.hasWon) {
          pattern = result.pattern
          highlightPattern(container, pattern)
          loopBoardItem(container, (btn) => (btn.disabled = true))
        }
      }
      symbol = toggleSymbol(symbol)
    }
  })
})

btnUndo.addEventListener('click', () => {
  const board = displayBoard(counter.decrement())
  symbol = toggleSymbol(board.symbol)

  loopBoardItem(container, (btn) => {
    btn.disabled = false
    btn.removeAttribute('style')
  })

  addIteminMoveList('undo', board.turn)
})

btnRedo.addEventListener('click', () => {
  const board = displayBoard(counter.increment(boardList.length - 1))
  symbol = toggleSymbol(board.symbol)

  if (counter.value() === boardList.length - 1) {
    if (pattern.length !== 0) {
      highlightPattern(container, pattern)
      loopBoardItem(container, (btn) => (btn.disabled = true))
    }
  }

  addIteminMoveList('redo', board.turn)
})

btnRestart.addEventListener('click', () => displayBoard(reset()))

btnHistory.addEventListener('click', () => {
  if (boardList.length === 1) {
    const src = 'assets/empty.png'
    const text = 'Oops! Nothing to show here'
    contentHistory.append(imageText(src, text))
  } else {
    contentHistory.append(unorderedList(moveList))
  }

  modal.showModal()
})

btnContinue.addEventListener('click', () => {
  contentHistory.innerHTML = ''
  modal.close()
})
