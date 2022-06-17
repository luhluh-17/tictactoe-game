export class Board {
  constructor(state, turn = 0, symbol = '', coordinate = []) {
    this.state = state
    this.turn = turn
    this.symbol = symbol
    this.coordinate = coordinate
  }

  static coordinateList = {
    '[0,0]': 'Top-Left',
    '[0,1]': 'Top-Center',
    '[0,2]': 'Top-Right',
    '[1,0]': 'Mid-Left',
    '[1,1]': 'Mid-Center',
    '[1,2]': 'Mid-Right',
    '[2,0]': 'Bot-Left',
    '[2,1]': 'Bot-Center',
    '[2,2]': 'Bot-Right',
  }

  static getAvailableList(array) {
    return Object.entries(this.coordinateList).filter(
      (item) => !this.getOccupiedList(array).includes(item[0])
    )
  }

  static getOccupiedList(array) {
    const list = []
    array
      .filter((board) => board.coordinate.length === 2)
      .forEach((board) => list.push(JSON.stringify(board.coordinate)))
    return list
  }

  get position() {
    const equals = (item) => item[0] === JSON.stringify(this.coordinate)
    return Object.entries(Board.coordinateList).find(equals)[1]
  }

  toString = () => `Turn ${this.turn} - ${this.symbol} - ${this.position}`
}
