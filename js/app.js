import { addIcon, newState } from './modules/helper.js'

const grid = document.querySelector('[data-board]')
const gridItems = Array.from(grid.children)
let value = 'x'

const template = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]
const boardState = []

boardState.push(newState(template))

gridItems.forEach((element) => {
  element.addEventListener('click', () => {
    if (!element.hasChildNodes()) {
      const index = gridItems.indexOf(element)
      const i = Math.floor(index / 3)
      const j = index % 3
      template[i][j] = value

      boardState.push(newState(template))

      element.append(addIcon(value))
      value = value === 'x' ? 'o' : 'x'
    }
  })
})


