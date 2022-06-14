export const addIcon = (name) => {
  const icon = document.createElement('i')
  icon.classList.add('fa-solid')
  icon.classList.add(`fa-${name}`)
  return icon
}

export const addItem = (text) => {
  const item = document.createElement('li')
  const paragraph = document.createElement('p')
  paragraph.textContent = text
  item.append(paragraph)
  return item
}

export const boxColor = (name) => {
  const styles = window.getComputedStyle(document.body)
  return styles.getPropertyValue(`--${name}-color`)
}

export const deepCopy = (array) => JSON.parse(JSON.stringify(array))

export const loopBoardItem = (container, cb) => {
  Array.from(container.children).forEach((cols, index1) => {
    Array.from(cols.children).forEach((div, index2) => cb(div, index1, index2))
  })
}

export const makeCounter = () => {
  let count = 0
  return {
    changeValue: (value) => (count = value),
    increment: (max) => (count < max ? ++count : count),
    decrement: () => (count > 0 ? --count : count),
    value: () => count,
  }
}
