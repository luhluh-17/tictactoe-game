import { addIcon } from "./helper.js"

export const checkWin = (array, symbol) => {
  const patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const hasMatch = (index) => array.flat()[index] === symbol
  const hasPattern = (pattern) => pattern.every(hasMatch)
  return patterns.some(hasPattern)
}

export const displayBoard = (rows, board) => {
  rows.forEach((cols, y) => {
    Array.from(cols.children).forEach((div, x) => {
      if (div.hasChildNodes()) {
        div.firstChild.remove()
      }

      if (board[y][x].length === 1) {
        div.append(addIcon(board[y][x]))
      }
    })
  })
}

export const toggleSymbol = (char) => (char === 'x' ? 'o' : 'x')