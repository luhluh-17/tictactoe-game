import { Move } from './classes/move.js'
import { addIcon, deepCopy } from './modules/helper.js'
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

const rows = Array.from(container.children)
rows.forEach((cols, x) => {
  Array.from(cols.children).forEach((div, y) => {
    div.addEventListener('click', () => {
      if (!div.hasChildNodes()) {
        board[y][x] = symbol
        moves.push(new Move(symbol, [y, x]))

        const turn = boardStates.push(deepCopy(board)) - 1
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
btnUndo.addEventListener('click', () => {})
btnRestart.addEventListener('click', restart)
btnRedo.addEventListener('click', () => alert('redo'))
btnHistory.addEventListener('click', () => {
  let msg = ''
  moves.forEach((element) => {
    msg += element.toString() + '\n'
  })
  alert(msg)
})

function restart() {
  moves = []
  boardStates = []
  board = deepCopy(TEMPLATE)
  boardStates.push(deepCopy(board))

  displayBoard(rows, board)
}


