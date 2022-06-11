import { Move } from './classes/move.js'
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
let moves = []
let boardStates = []
let board = deepCopy(TEMPLATE)
boardStates.push(deepCopy(board))
let counter = makeCounter()

const rows = Array.from(container.children)
rows.forEach((cols, y) => {
  Array.from(cols.children).forEach((div, x) => {
    div.addEventListener('click', () => {
      if (!div.hasChildNodes()) {
        if (counter.value() < boardStates.length - 1) {
          boardStates.splice(counter.value() + 1, boardStates.length - 1)
          moves.splice(counter.value() + 1, moves.length - 1)
          board = deepCopy(boardStates[boardStates.length - 1])
        }

        board[y][x] = symbol
        moves.push(new Move(symbol, [y, x]))

        const turn = boardStates.push(deepCopy(board)) - 1
        counter.changeValue(turn)

        div.append(addIcon(symbol))
        if (turn > 4) {
          const result = checkWin(boardStates[turn], symbol)
        }
        symbol = toggleSymbol(symbol)
      }
    })
  })
})

btnReturn.addEventListener('click', () => alert('return'))

btnUndo.addEventListener('click', () => {
  const turn = counter.decrement()
  displayBoard(rows, boardStates[turn])
})

btnRedo.addEventListener('click', () => {
  const turn = counter.increment(boardStates.length - 1)
  displayBoard(rows, boardStates[turn])
})

btnRestart.addEventListener('click', () => {
  moves = []
  boardStates = []
  board = deepCopy(TEMPLATE)
  boardStates.push(deepCopy(board))
  counter.changeValue(0)
  displayBoard(rows, board)
})

btnHistory.addEventListener('click', () => {
  let msg = ''
  moves.forEach((move) => {
    msg += move.toString() + '\n'
  })
  alert(msg)
})
