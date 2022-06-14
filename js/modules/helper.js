export const boxColor = (name) => {
  const styles = window.getComputedStyle(document.body)
  return styles.getPropertyValue(`--${name}-color`)
}

export const deepCopy = (array) => JSON.parse(JSON.stringify(array))

export const loopBoardItem = (container, cb) => {
  Array.from(container.children).forEach((cols, index1) => {
    Array.from(cols.children).forEach((btn, index2) => cb(btn, index1, index2))
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
