export class Move {
  constructor(value, coordinate) {
    this.value = value
    this.coordinate = coordinate
  }

  get position() {
    const positions = {
      'Top-Left': [0, 0],
      'Top-Center': [0, 1],
      'Top-Right': [0, 2],
      'Mid-Left': [1, 0],
      'Mid-Center': [1, 1],
      'Mid-Right': [1, 2],
      'Bot-Left': [2, 0],
      'Bot-Center': [2, 1],
      'Bot-Right': [2, 2],
    }

    const equals = (key) =>
      JSON.stringify(positions[key]) === JSON.stringify(this.coordinate)
    return Object.keys(positions).find(equals)
  }

  toString() {
    return `${this.value.toUpperCase()} - ${this.position}`
  }
}
