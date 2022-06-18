export const boxColor = (name) => {
  const styles = window.getComputedStyle(document.body)
  return styles.getPropertyValue(`--${name}-color`)
}

export const deepCopy = (array) => JSON.parse(JSON.stringify(array))

export const disableAllBox = (bool) => {
  getAllBox()
    .flat()
    .forEach((box) => {
      if (bool) {
        box.disabled = bool
      } else {
        box.disabled = bool
      }
    })
}

export const makeCounter = (name) => {
  let count = 0
  if (name === 'turn') {
    return {
      changeValue: (value) => (count = value),
      increment: (max) => (count = count < max ? ++count : count),
      decrement: () => (count = count > 0 ? --count : count),
      value: () => count,
    }
  } else if (name === 'rotate') {
    return () => (count += 360)
  }
}

export const getAllBox = () => {
  const top = []
  const mid = []
  const bot = []

  const container = document.querySelector('[data-board]')
  Array.from(container.children).forEach((parent, i) => {
    Array.from(parent.children).forEach((box) => {
      if (i === 0) {
        top.push(box)
      } else if (i === 1) {
        mid.push(box)
      } else {
        bot.push(box)
      }
    })
  })

  return [top, mid, bot]
}
