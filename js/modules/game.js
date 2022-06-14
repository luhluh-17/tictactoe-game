import { addIcon, boxColor, loopBoardItem } from './helper.js'

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
  const hasWon = patterns.some(hasPattern)
  const pattern = hasWon ? patterns.find(hasPattern) : []

  return { hasWon, pattern }
}

export const createBoard = (container, board) => {
  loopBoardItem(container, (div, i, j) => {
    div.innerHTML = ''
    if (board[i][j].length === 1) {
      div.append(addIcon(board[i][j]))
    }
  })
}

export const highlightPattern = (container, pattern) => {
  let index = 0
  loopBoardItem(container, (div) => {
    if (pattern.includes(index)) {
      div.style.backgroundColor = boxColor('primary-dark')
    }
    index++
  })
}

export const toggleSymbol = (char) => (char === 'x' ? 'o' : 'x')

export const updateScore = (result, turn, symbol) => {
  const incrementScore = (value) => {
    const score = document.querySelector(`[data-score="${value}"]`)
    score.textContent = parseInt(score.textContent) + 1
  }

  if (result && symbol === 'x') {
    incrementScore('player1')
  } else if (result && symbol === 'o') {
    incrementScore('player2')
  } else if (!result && turn === 9) {
    incrementScore('draw')
  }
}
