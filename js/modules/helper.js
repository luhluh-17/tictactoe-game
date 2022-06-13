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

export const deepCopy = (array) => JSON.parse(JSON.stringify(array))

export const deleteChildren = (list) => {
  Array.from(list.children).forEach((child) => {
    list.removeChild(child)
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
