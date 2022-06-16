import { Board } from './classes/board.js'
import { icon, imageText, unorderedList } from './modules/element.js'
import {
  boxColor,
  deepCopy,
  loopBoardItem,
  makeCounter,
} from './modules/helper.js'
import {
  checkWin,
  createBoard,
  highlightPattern,
  highlightTurn,
  toggleSymbol,
  updateScore,
} from './modules/game.js'

const container = document.querySelector('[data-board]')

const modalHistory = document.querySelector('[data-modal="history"]')
const btnHistory = document.querySelector('[data-btn="history"]')
const contentHistory = document.querySelector('[data-content="history"]')
const btnContinue = document.querySelector('[data-btn="continue"]')

const modalSettings = document.querySelector('[data-modal="settings"]')
const btnSettings = document.querySelector('[data-btn="settings"]')
const btnConfirm = document.querySelector('[data-btn="confirm"]')

const btnUndo = document.querySelector('[data-btn="undo"]')
const btnRestart = document.querySelector('[data-btn="restart"]')
const btnRedo = document.querySelector('[data-btn="redo"]')

const TEMPLATE = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

const options = {
  player: 'x',
  opponent: 'person'
}

let degree = 0
let symbol = 'x'
let pattern = []
let moveList = []
let boardList = []
let board = deepCopy(TEMPLATE)
let counter = makeCounter()
boardList.push(new Board(deepCopy(board)))

showSettings()

function showSettings() {
  const player1 = document.querySelector('[data-player="1"]')
  const player2 = document.querySelector('[data-player="2"]')

  const symbols = document.querySelector('[data-option="symbol"]')
  const btnX = symbols.firstElementChild
  const btnO = symbols.lastElementChild

  const opponents = document.querySelector('[data-option="opponent"]')
  const btnPerson = opponents.firstElementChild
  const btnComputer = opponents.lastElementChild

  const assignSymbol = (player) => {
    player1.innerHTML = ''
    player1.append(icon(player))

    player2.innerHTML = ''
    player2.append(icon(toggleSymbol(player)))
  }

  if (options.player === 'x') {
    btnX.style.backgroundColor = boxColor('primary-dark')
  } else {
    btnO.style.backgroundColor = boxColor('primary-dark')
  }

  if (options.opponent === 'person') {
    btnPerson.style.backgroundColor = boxColor('primary-dark')
  } else {
    btnComputer.style.backgroundColor = boxColor('primary-dark')
  }

  btnX.addEventListener('click', () => {
    options.player = 'x'
    assignSymbol(options.player)
    btnX.style.backgroundColor = boxColor('primary-dark')
    btnO.style.backgroundColor = 'transparent'
  })

  btnO.addEventListener('click', () => {
    options.player = 'o'
    assignSymbol(options.player)
    btnO.style.backgroundColor = boxColor('primary-dark')
    btnX.style.backgroundColor = 'transparent'
  })

  btnPerson.addEventListener('click', () => {
    options.opponent = 'person'
    btnPerson.style.backgroundColor = boxColor('primary-dark')
    btnComputer.style.backgroundColor = 'transparent'
  })

  btnComputer.addEventListener('click', () => {
    options.opponent = 'computer'
    btnComputer.style.backgroundColor = boxColor('primary-dark')
    btnPerson.style.backgroundColor = 'transparent'
  })

  modalSettings.showModal()
}

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
    displayBoard(counter.changeValue(0))
  }
}

loopBoardItem(container, (btn, i, j) => {
  btn.addEventListener('click', () => {
    if (!btn.hasChildNodes()) {
      if (counter.value() < boardList.length - 1) {
        removeUnusedState()
      }

      board[i][j] = symbol
      btn.append(icon(symbol))
      loopBoardItem(container, (btn) => btn.removeAttribute('style'))
      btn.style.backgroundColor = boxColor('primary-dark')

      let turn = boardList.length
      const newBoard = new Board(deepCopy(board), turn, symbol, [i, j])
      moveList.push(newBoard.toString())

      turn = counter.changeValue(boardList.push(newBoard) - 1)

      if (turn > 4) {
        const result = checkWin(boardList[turn].state, symbol)
        updateScore(result.hasWon, turn, options.player, symbol)
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

  loopBoardItem(container, (btn) => (btn.disabled = false))
  highlightTurn(container, board)

  addIteminMoveList('undo', board.turn)
})

btnRedo.addEventListener('click', () => {
  const board = displayBoard(counter.increment(boardList.length - 1))
  symbol = toggleSymbol(board.symbol)

  highlightTurn(container, board)

  if (counter.value() === boardList.length - 1) {
    if (pattern.length !== 0) {
      highlightPattern(container, pattern)
      loopBoardItem(container, (btn) => (btn.disabled = true))
    }
  }

  addIteminMoveList('redo', board.turn)
})

btnRestart.addEventListener('click', () => reset())

btnHistory.addEventListener('click', () => {
  if (boardList.length === 1) {
    const src = 'assets/empty.png'
    const text = 'Oops! Nothing to show here'
    contentHistory.append(imageText(src, text))
  } else {
    contentHistory.append(unorderedList(moveList))
  }

  modalHistory.showModal()
})

btnContinue.addEventListener('click', () => {
  contentHistory.innerHTML = ''
  modalHistory.close()
})

btnSettings.addEventListener('click', () => {
  showSettings()
})

btnConfirm.addEventListener('click', () => {
  reset()
  modalSettings.close()
})
