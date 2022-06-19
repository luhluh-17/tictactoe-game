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
  highlight,
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
let isGameActive = true
let symbol = 'x'
let pattern = []
let moveList = []
let boardList = []
let boardState = deepCopy(TEMPLATE)
let counter = makeCounter('turn')
let degree = makeCounter('rotate')
boardList.push(new Board(deepCopy(boardState)))
dialog.settings()

const mainFunction = (coordinates) => {
  const i = coordinates[0]
  const j = coordinates[1]
  boardState[i][j] = symbol
  boxList[i][j].append(icon(symbol))
  highlight.turn([i, j], boardList.at(-1).coordinate)

  let turn = boardList.length
  const board = new Board(deepCopy(boardState), turn, symbol, [i, j])
  turn = counter.changeValue(boardList.push(board) - 1)
  moveList.push(board.toString())

  checkStatus(turn)

  symbol = toggleSymbol(symbol)
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

    if (result.hasWon) {
      disableAllBox(true)
      pattern = result.pattern
      highlight.pattern(pattern)
      isGameActive = false
      updateScore(result.hasWon, dialog.options.player, symbol)
    } else if (!result.hasWon && turn === 9) {
      isGameActive = false
      updateScore(result.hasWon)
      highlight.board()
    }
  }
}

const playVsComputer = () => {
  if (
    isGameActive &&
    dialog.options.player !== symbol &&
    dialog.options.opponent === dialog.OPPONENT.COMPUTER
  ) {
    const array = Board.getAvailableList(boardList)
    const random = Math.floor(Math.random() * array.length)
    const coordinates = JSON.parse(array[random])

    setTimeout(() => mainFunction(coordinates), 100)
  }
}

const triggerEvent = (event, callbackfn) => {
  const customEvent = () => {
    if (event === 'undo') {
      counter.decrement()
    } else if (event === 'redo') {
      counter.increment(boardList.at(-1).turn)
    }
    const board = boardList[counter.value()]
    displayBoard(board.state)
    symbol = toggleSymbol(board.symbol)

    callbackfn()

    const calculate = {
      undo: () => counter.value() + 1,
      redo: () => counter.value() - 1,
    }

    if (counter.value() === 9 && pattern.length === 0) {
      highlight.board()
    } else {
      const index = calculate[event]()
      highlight.turn(board.coordinate, boardList.at(index).coordinate)
    }
    addIteminMoveList(event, board.turn)
  }

  if (
    dialog.options.player === symbol &&
    dialog.options.opponent === dialog.OPPONENT.COMPUTER
  ) {
    customEvent()
    boxList.flat().forEach((box) => (box.disabled = true))
    setTimeout(() => {
      customEvent()
      boxList.flat().forEach((box) => (box.disabled = false))
    }, 250)
  } else {
    customEvent()
  }
}

const addIteminMoveList = (action, turn) => {
  turn = action === 'undo' ? (turn += 1) : turn
  const text = `${action} - Turn ${turn}`
  if (moveList.at(-1) !== text) {
    moveList.push(text)
  }
}

const reset = () => {
  let delay = 100
  if (boardList.length > 1) {
    isGameActive = true
    pattern = []
    moveList = []
    boardList = []
    boardState = deepCopy(TEMPLATE)
    boardList.push(new Board(deepCopy(boardState)))
    displayBoard(boardList[counter.changeValue(0)].state)
    const container = document.querySelector('[data-board]')
    container.style.transform = `rotate(${degree()}deg)`

    boxList.flat().forEach((box) => {
      box.disabled = true
      box.removeAttribute('style')
    })
    delay = 1000
  }

  setTimeout(() => {
    playVsComputer()
    boxList.flat().forEach((box) => (box.disabled = false))
  }, delay)
}

boxList.forEach((parent, i) => {
  parent.forEach((box, j) => {
    box.addEventListener('click', () => {
      if (!box.hasChildNodes()) {
        removeUnusedState()
        mainFunction([i, j])
        playVsComputer()
      }
    })
  })
})

btnUndo.addEventListener('click', () => {
  triggerEvent('undo', () => {
    isGameActive = true
    disableAllBox(false)
    boxList.flat().forEach((box) => box.removeAttribute('style'))
  })
})

btnRedo.addEventListener('click', () => {
  triggerEvent('redo', () => {
    if (counter.value() === boardList.at(-1).turn && pattern.length !== 0) {
      isGameActive = false
      disableAllBox(true)
      highlight.pattern(pattern)
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
