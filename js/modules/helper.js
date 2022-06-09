export const addIcon = (name) => {
  const icon = document.createElement('i')
  icon.classList.add('fa-solid')
  icon.classList.add(`fa-${name}`)
  return icon
}

export const checkWin = (array, char) => {
  const newArray = array.flat()
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

  newArray.forEach((item, i) => {
    if (item === char) {
      newArray[i] = ''
    }
  })

  const hasMatch = (index) => newArray[index] === toggleValue(char)
  const hasPattern = (pattern) => pattern.every(hasMatch)
  return patterns.some(hasPattern)
}

export const deepCopy = (array) => JSON.parse(JSON.stringify(array))

export const toggleValue = (char) => (char === 'x' ? 'o' : 'x')
