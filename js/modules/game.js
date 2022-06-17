import { icon } from './element.js'
import { boxColor, getAllBox } from './helper.js'

const boxList = getAllBox()

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

export const displayBoard = (board) => {
  boxList.forEach((parent, i) => {
    parent.forEach((box, j) => {
      box.innerHTML = ''
      if (board[i][j].length === 1) {
        box.append(icon(board[i][j]))
      }
    })
  })
}

export const highlightPattern = (pattern) => {
  boxList.flat().forEach((box, index) => {
    if (pattern.includes(index)) {
      box.style.backgroundColor = boxColor('primary-dark')
      box.firstChild.classList.add('fa-beat')
    }
  })
}

export const highlightTurn = (next, prev) => {
  if (next.length !== 0) {
    const i = next[0]
    const j = next[1]
    boxList[i][j].style.backgroundColor = boxColor('primary-dark')
  }

  if (prev.length !== 0) {
    const x = prev[0]
    const y = prev[1]
    boxList[x][y].removeAttribute('style')
  }
}

export const toggleSymbol = (char) => (char === 'x' ? 'o' : 'x')

export const updateScore = (result, turn, player, symbol) => {
  const incrementScore = (value) => {
    const score = document.querySelector(`[data-score="${value}"]`)
    score.textContent = parseInt(score.textContent) + 1
  }

  if (result && player === symbol) {
    incrementScore('1')
  } else if (result && player !== symbol) {
    incrementScore('2')
  } else if (!result && turn === 9) {
    incrementScore('draw')
  }
}
