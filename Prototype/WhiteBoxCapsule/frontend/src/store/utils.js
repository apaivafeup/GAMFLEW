import { Color } from './models/piece'

export function isTriangle(a, b, c) {
  return a + b > c && a + c > b && b + c > a
}

export function count_blue_pieces(board) {
  var count = 0
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; i++) {
      if (board[i][j].color == Color.BLUE) {
        count++
      }
    }
  }
  return count
}

export function count_red_pieces(board) {
  var count = 0
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; i++) {
      if (board[i][j].color == Color.RED) {
        count++
      }
    }
  }
  return count
}

export function count_empty_spaces(board) {
  console.log("I'm here, hello!")

  var count = 0
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; i++) {
      if (board[i][j].color == Color.EMPTY) {
        count++
      }
    }
  }
  return count
}

/*
{
        "type": 'statement',
        "preconditions": [
            'input.log[input.currentKey].length > 0',
            'Math.abs(input.log[input.currentKey][input.log[input.currentKey].length - 1].from.x - input.log[input.currentKey][input.log[input.currentKey].length - 1].to.x) > 2',
        ],
        "tests": [
            'Math.abs(input.log[input.currentKey][input.log[input.currentKey].length - 1].from.x - input.log[input.currentKey][input.log[input.currentKey].length - 1].to.x) > 2'
        ]
    }
*/
