import { addIcon, checkWin, deepCopy, toggleValue } from './modules/helper.js'

const grid = document.querySelector('[data-board]')

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

let value = 'x'
const gridItems = Array.from(grid.children)

let boardState = []
let board = deepCopy(TEMPLATE)
boardState.push(deepCopy(board))

gridItems.forEach((element) => {
  element.addEventListener('click', () => {
    if (!element.hasChildNodes()) {
      const index = gridItems.indexOf(element)
      const y = Math.floor(index / 3)
      const x = index % 3
      board[y][x] = value

      boardState.push(deepCopy(board))
      element.append(addIcon(value))
      value = toggleValue(value)

      const boardIndex = boardState.length - 1
      if (boardIndex >= 5) {
        const result = checkWin(boardState[boardIndex], value)
        console.log(result)
      }
    }
  })
})

btnReturn.addEventListener('click', () => alert('return'))
btnUndo.addEventListener('click', () => {})
btnRestart.addEventListener('click', restart)
btnRedo.addEventListener('click', () => alert('redo'))
btnHistory.addEventListener('click', () => alert('history'))

function restart() {
  boardState = []
  board = deepCopy(TEMPLATE)
  boardState.push(deepCopy(board))
  gridItems.forEach((element) => {
    Array.from(element.children).forEach((icon) => icon.remove())
  })
}
