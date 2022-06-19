import { icon, imageText, unorderedList } from './element.js'
import { toggleSymbol } from './game.js'
import { boxColor } from './helper.js'

const modalHistory = document.querySelector('[data-modal="history"]')
const contentHistory = document.querySelector('[data-content="history"]')
const btnContinue = document.querySelector('[data-btn="continue"]')

const modalSettings = document.querySelector('[data-modal="settings"]')

const symbols = document.querySelectorAll('[data-option="symbol"]')
const opponents = document.querySelectorAll('[data-option="opponent"]')

const btnX = symbols[0]
const btnO = symbols[1]
const btnPerson = opponents[0]
const btnComputer = opponents[1]

export const OPPONENT = {
  PERSON: 'person',
  COMPUTER: 'computer',
}

export const options = {
  player: 'x',
  opponent: OPPONENT.PERSON,
}

export const history = (moveList) => {
  if (moveList.length === 0) {
    const src = 'assets/empty.png'
    const text = 'Oops! Nothing to show here'
    contentHistory.append(imageText(src, text))
  } else {
    contentHistory.append(unorderedList(moveList))
  }

  modalHistory.showModal()
}

export const settings = () => {
  if (options.player === 'x') {
    btnX.style.backgroundColor = boxColor('primary-dark')
  } else {
    btnO.style.backgroundColor = boxColor('primary-dark')
  }

  if (options.opponent === OPPONENT.PERSON) {
    btnPerson.style.backgroundColor = boxColor('primary-dark')
  } else {
    btnComputer.style.backgroundColor = boxColor('primary-dark')
  }
  modalSettings.showModal()
}

const toggle = (choices, value) => {
  if (choices[0].getAttribute('data-option') === 'symbol') {
    const players = document.querySelectorAll('[data-player]')
    players[0].innerHTML = ''
    players[0].append(icon(value))

    players[1].innerHTML = ''
    players[1].append(icon(toggleSymbol(value)))

    options.player = value
  } else if (choices[0].getAttribute('data-option') === 'opponent') {
    options.opponent = value
  }

  if (value === 'x' || value === OPPONENT.PERSON) {
    choices[0].style.backgroundColor = boxColor('primary-dark')
    choices[1].style.backgroundColor = 'transparent'
  } else {
    choices[1].style.backgroundColor = boxColor('primary-dark')
    choices[0].style.backgroundColor = 'transparent'
  }
}

btnContinue.addEventListener('click', () => {
  contentHistory.innerHTML = ''
  modalHistory.close()
})

btnX.addEventListener('click', () => toggle(symbols, 'x'))

btnO.addEventListener('click', () => toggle(symbols, 'o'))

btnPerson.addEventListener('click', () => toggle(opponents, OPPONENT.PERSON))

btnComputer.addEventListener('click', () =>
  toggle(opponents, OPPONENT.COMPUTER)
)
