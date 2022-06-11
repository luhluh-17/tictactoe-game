export const addIcon = (name) => {
  const icon = document.createElement('i')
  icon.classList.add('fa-solid')
  icon.classList.add(`fa-${name}`)
  return icon
}

export const deepCopy = (array) => JSON.parse(JSON.stringify(array))
