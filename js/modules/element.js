export const icon = (name) => {
  const icon = document.createElement('i')
  icon.classList.add('fa-solid')
  icon.classList.add(`fa-${name}`)
  icon.classList.add('fa-fw')
  return icon
}

export const imageText = (src, text) => {
  const div = document.createElement('div')
  div.classList.add('flex-col')
  div.append(image(src))
  div.append(heading(text, 6))
  return div
}

export const unorderedList = (array) => {
  const ul = document.createElement('ul')
  const li = document.createElement('li')

  array.forEach((text) => {
    const p = document.createElement('p')
    p.textContent = text
    li.append(p)
  })

  ul.append(li)
  return ul
}

const heading = (text, size = 4) => {
  const header = document.createElement(`h${size}`)
  header.textContent = text
  return header
}

const image = (src, alt = 'image') => {
  const img = document.createElement('img')
  img.src = src
  img.alt = alt
  return img
}
