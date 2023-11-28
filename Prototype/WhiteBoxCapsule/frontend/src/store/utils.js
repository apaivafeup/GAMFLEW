import { Color } from './models/piece'

export function isTriangle(a, b, c) {
  return a + b > c && a + c > b && b + c > a
}

export function count_blue_pieces(board) {
  var count = 0
  for (var i = 0; i < board.state[board.currentKey].length; i++) {
    for (var j = 0; j < board.state[board.currentKey][i].length; j++) {
      if (board.state[board.currentKey][i][j].color == Color.BLUE) {
        count++
      }
    }
  }
  return count
}

export function count_red_pieces(board) {
  var count = 0
  for (var i = 0; i < board.state[board.currentKey].length; i++) {
    for (var j = 0; j < board.state[board.currentKey][i].length; j++) {
      if (board.state[board.currentKey][i][j].color == Color.RED) {
        count++
      }
    }
  }
  return count
}

export function count_empty_spaces(board) {
  var count = 0
  for (var i = 0; i < board.state[board.currentKey].length; i++) {
    for (var j = 0; j < board.state[board.currentKey][i].length; j++) {
      if (board.state[board.currentKey][i][j].color == Color.EMPTY) {
        count++
      }
    }
  }
  return count
}
