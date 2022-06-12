import { Board } from './classes/board.js'
import { addIcon, deepCopy, makeCounter } from './modules/helper.js'
import { checkWin, displayBoard, toggleSymbol } from './modules/tictactoe.js'

const container = document.querySelector('[data-board]')

const btnReturn = document.querySelector('[data-return]')
const btnUndo = document.querySelector('[data-undo]')
const btnRestart = document.querySelector('[data-restart]')
const btnRedo = document.querySelector('[data-redo]')
const btnHistory = document.querySelector('[data-history]')

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
        }
        symbol = toggleSymbol(symbol)
      }
    })
  })
})

btnReturn.addEventListener('click', () => alert('return'))

btnUndo.addEventListener('click', () => {
  const turn = counter.decrement()
  displayBoard(rows, boardStates[turn].state)
  symbol = toggleSymbol(boardStates[turn].symbol)
})

btnRedo.addEventListener('click', () => {
  const turn = counter.increment(boardStates.length - 1)
  displayBoard(rows, boardStates[turn].state)
  symbol = toggleSymbol(boardStates[turn].symbol)
})

btnRestart.addEventListener('click', () => {
  boardStates = []
  board = deepCopy(TEMPLATE)
  boardStates.push(new Board(deepCopy(board)))
  counter.changeValue(0)
  displayBoard(rows, board)
})

btnHistory.addEventListener('click', () => {
  let msg = ''
  boardStates.forEach((board, i) => {
    if (i === 0) {
      return
    }
    msg += board.toString() + '\n'
  })
  alert(msg)
})
