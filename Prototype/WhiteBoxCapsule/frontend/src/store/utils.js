import { Color, Piece } from './models/piece'

export function combinations(array, k) {
  if (array == null) {
    return
  }

  var i,
    subI,
    ret = [],
    sub,
    next

  for (i = 0; i < array.length; i++) {
    if (k === 1) {
      ret.push([array[i]])
    } else {
      sub = combinations(array, k - 1)
      for (subI = 0; subI < sub.length; subI++) {
        next = sub[subI]
        next.unshift(array[i])
        ret.push(next)
      }
    }
  }
  
  return ret
}

export function isTriangle(a, b, c) {
  return a + b > c && a + c > b && b + c > a
}

export function distance(a, b) {
  if (!a || !b) {
    return 0
  }

  return Math.round(
    Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2))
  )
}

export function get_pieces(board, boardKey) {
  var pieces = []

  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color != Color.EMPTY) {
        pieces.push(board.state[boardKey][i][j])
      }
    }
  }

  return pieces
}

export function count_blue_pieces(board, boardKey) {
  var count = 0
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color == Color.BLUE) {
        count++
      }
    }
  }
  return count
}

export function count_red_pieces(board, boardKey) {
  var count = 0
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color == Color.RED) {
        count++
      }
    }
  }
  return count
}

export function count_empty_spaces(board, boardKey) {
  var count = 0
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color == Color.EMPTY) {
        count++
      }
    }
  }
  return count
}

export function find_first_red_piece(board, boardKey) {
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (
        board.state[boardKey][i][j].color == Color.RED ||
        (board.state[boardKey][i][j].color == Color.STACK &&
          board.state[boardKey][i][j].stack.red > 0)
      ) {
        return board.state[boardKey][i][j]
      }
    }
  }

  if (board.outOfBoundsState[boardKey].color == Color.RED || (board.outOfBoundsState[boardKey].color == Color.STACK &&
    board.outOfBoundsState[boardKey].stack.red > 0)) {
    return board.outOfBoundsState[boardKey]
  }

  return new Piece({ x: -2, y: -2 }, Color.EMPTY)
}

export function find_first_blue_piece(board, boardKey) {
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (
        board.state[boardKey][i][j].color == Color.BLUE ||
        (board.state[boardKey][i][j].color == Color.STACK &&
          board.state[boardKey][i][j].stack.blue > 0)
      ) {
        return board.state[boardKey][i][j]
      }
    }
  }

  if (board.outOfBoundsState[boardKey].color == Color.BLUE || (board.outOfBoundsState[boardKey].color == Color.STACK &&
    board.outOfBoundsState[boardKey].stack.blue > 0)) {
    return board.outOfBoundsState[boardKey]
  }

  return new Piece({ x: -2, y: -2 }, Color.EMPTY)
}

export function find_first_stack(board, boardKey) {
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color == Color.STACK) {
        return board.state[boardKey][i][j]
      }
    }
  }

  if (board.outOfBoundsState[boardKey].color == Color.STACK) {
    return board.outOfBoundsState[boardKey]
  }

  return new Piece({ x: -2, y: -2 }, Color.EMPTY)
}

export function find_blue_pieces(board, boardKey) {
  var vertices = []
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color == Color.BLUE) {
        vertices.push(board.state[boardKey][i][j])
      }
    }
  }

  vertices.sort((a, b) => {
    a.x - b.x == 0 ? a.y - b.y : a.x - b.x
  })
  return vertices
}

export function find_red_pieces(board, boardKey) {
  var vertices = []
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color == Color.RED) {
        vertices.push(board.state[boardKey][i][j])
      }
    }
  }
  vertices.sort((a, b) => {
    a.x - b.x == 0 ? a.y - b.y : a.x - b.x
  })
  return vertices
}

export function find_stacks(board, boardKey) {
  var vertices = []
  for (var i = 0; i < board.state[boardKey].length; i++) {
    for (var j = 0; j < board.state[boardKey].length; j++) {
      if (board.state[boardKey][i][j].color == Color.STACK) {
        vertices.push(board.state[boardKey][i][j])
      }
    }
  }
  vertices.sort((a, b) => {
    a.x - b.x == 0 ? a.y - b.y : a.x - b.x
  })
  return vertices
}
