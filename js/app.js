import { Board } from './classes/board.js'
import * as dialog from './modules/dialog.js'
import { icon } from './modules/element.js'
import {
  deepCopy,
  disableAllBox,
  getAllBox,
  makeCounter,
} from './modules/helper.js'
import {
  checkWin,
  displayBoard,
  highlightPattern,
  highlightTurn,
  toggleSymbol,
  updateScore,
} from './modules/game.js'

const btnUndo = document.querySelector('[data-btn="undo"]')
const btnRedo = document.querySelector('[data-btn="redo"]')
const btnRestart = document.querySelector('[data-btn="restart"]')

const btnHistory = document.querySelector('[data-btn="history"]')
const btnSettings = document.querySelector('[data-btn="settings"]')

const btnConfirm = document.querySelector('[data-btn="confirm"]')

const TEMPLATE = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

const boxList = getAllBox()
let isActive = true
let symbol = 'x'
let pattern = []
let moveList = []
let boardList = []
let boardState = deepCopy(TEMPLATE)
let counter = makeCounter('turn')
let degree = makeCounter('rotate')
boardList.push(new Board(deepCopy(boardState)))

const mainFunction = (coordinates) => {
  removeUnusedState()

  const i = coordinates[0]
  const j = coordinates[1]
  boardState[i][j] = symbol
  boxList[i][j].append(icon(symbol))
  highlightTurn([i, j], boardList.at(-1).coordinate)

  let turn = boardList.length
  const board = new Board(deepCopy(boardState), turn, symbol, [i, j])
  turn = counter.changeValue(boardList.push(board) - 1)
  moveList.push(board.toString())

  checkStatus(turn)

  symbol = toggleSymbol(symbol)

  playVsComputer()
}

const removeUnusedState = () => {
  if (counter.value() < boardList.length - 1) {
    pattern = []
    boardList.splice(counter.value() + 1, boardList.length)
    boardState = deepCopy(boardList.at(-1).state)
  }
}

const checkStatus = (turn) => {
  if (turn > 4) {
    const result = checkWin(boardList[turn].state, symbol)
    updateScore(result.hasWon, turn, dialog.options.player, symbol)

    if (result.hasWon) {
      disableAllBox(true)
      pattern = result.pattern
      highlightPattern(pattern)
      isActive = false
    } else if (turn === 9 && !result.hasWon) {
      isActive = false
    }
  }
}

const playVsComputer = () => {
  if (
    isActive &&
    dialog.options.opponent === 'computer' &&
    dialog.options.playersymbol !== symbol
  ) {
    const array = Board.getAvailableList(boardList)
    const random = Math.floor(Math.random() * array.length)
    const coordinates = JSON.parse(array[random])

    setTimeout(() => {
      const i = coordinates[0]
      const j = coordinates[1]
      boardState[i][j] = symbol
      boxList[i][j].append(icon(symbol))
      highlightTurn([i, j], boardList.at(-1).coordinate)

      let turn = boardList.length
      const board = new Board(deepCopy(boardState), turn, symbol, [i, j])
      turn = counter.changeValue(boardList.push(board) - 1)
      moveList.push(board.toString())

      checkStatus(turn)

      symbol = toggleSymbol(symbol)
    }, 100)
  }
}

const triggerEvent = (event, callbackfn) => {
  let index = 0
  if (event === 'undo') {
    index = counter.decrement()
  } else if (event === 'redo') {
    index = counter.increment(boardList.at(-1).turn)
  }

  const board = boardList[index]
  displayBoard(board.state)
  symbol = toggleSymbol(board.symbol)

  callbackfn()

  const calculate = {
    undo: () => index + 1,
    redo: () => index - 1,
  }

  highlightTurn(board.coordinate, boardList.at(calculate[event]()).coordinate)
  addIteminMoveList(event, board.turn)
}

const addIteminMoveList = (action, turn) => {
  turn = action === 'undo' ? (turn += 1) : turn
  const text = `${action} - Turn ${turn}`
  if (moveList.at(-1) !== text) {
    moveList.push(text)
  }
}

const reset = () => {
  if (boardList.length > 1) {
    const container = document.querySelector('[data-board]')
    container.style.transform = `rotate(${degree()}deg)`

    symbol = 'x'
    isActive = true
    pattern = []
    moveList = []
    boardList = []
    boardState = deepCopy(TEMPLATE)
    boardList.push(new Board(deepCopy(boardState)))
    boxList.flat().forEach((box) => (box.disabled = true))

    setTimeout(() => {
      boxList.flat().forEach((box) => (box.disabled = false))
    }, 1500)

    displayBoard(boardList[counter.changeValue(0)].state)
    boxList.flat().forEach((box) => box.removeAttribute('style'))
  }
}

boxList.forEach((parent, i) => {
  parent.forEach((box, j) => {
    box.addEventListener('click', () => {
      if (!box.hasChildNodes()) {
        mainFunction([i, j])
      }
    })
  })
})

btnUndo.addEventListener('click', () => {
  triggerEvent('undo', () => {
    disableAllBox(false)
    boxList.flat().forEach((box) => box.removeAttribute('style'))
  })
})

btnRedo.addEventListener('click', () => {
  triggerEvent('redo', () => {
    if (counter.value() === boardList.at(-1).turn) {
      if (pattern.length !== 0) {
        highlightPattern(pattern)
        disableAllBox(true)
      }
    }
  })
})

btnRestart.addEventListener('click', () => reset())

btnHistory.addEventListener('click', () => dialog.history(moveList))

btnSettings.addEventListener('click', () => dialog.settings())

btnConfirm.addEventListener('click', () => {
  reset()
  document.querySelector('[data-modal="settings"]').close()
})
