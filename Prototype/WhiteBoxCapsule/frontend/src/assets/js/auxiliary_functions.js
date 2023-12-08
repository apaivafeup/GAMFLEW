export const auxiliaryFunctions = {
  isTriangle: 'function isTriangle(a, b, c) {\n\treturn a + b > c && a + c > b && b + c > a\n}',
  distance:
    'function distance(a, b) {\n\tif (!a || !b) {\n\t\treturn 0\n\t}\n\t\n\treturn Math.round(Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2)))\n}',
  count_blue_pieces:
    'function count_blue_pieces(board, boardKey) {\n  var count = 0\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (board.state[boardKey][i][j].color == Color.BLUE) {\n        count++\n      }\n    }\n  }\n  return count\n}',
  count_red_pieces:
    'function count_red_pieces(board, boardKey) {\n  var count = 0\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (board.state[boardKey][i][j].color == Color.RED) {\n        count++\n      }\n    }\n  }\n  return count\n}',
  count_empty_spaces:
    'function count_empty_spaces(board, boardKey) {\n  var count = 0\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (board.state[boardKey][i][j].color == Color.EMPTY) {\n        count++\n      }\n    }\n  }\n  return count\n}',
  find_first_red_piece:
    'function find_first_red_piece(board, boardKey) {\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (\n        board.state[boardKey][i][j].color == Color.RED ||\n        (board.state[boardKey][i][j].color == Color.STACK &&\n          board.state[boardKey][i][j].stack.red > 0)\n      ) {\n        return board.state[boardKey][i][j]\n      }\n    }\n  }\n\n  if (board.outOfBoundsState[boardKey].color == Color.RED) {\n    return board.outOfBoundsState[boardKey]\n  }\n\n  return new Piece({ x: -2, y: -2 }, Color.EMPTY)\n}',
  find_first_blue_piece:
    'function find_first_blue_piece(board, boardKey) {\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (\n        board.state[boardKey][i][j].color == Color.BLUE ||\n        (board.state[boardKey][i][j].color == Color.STACK &&\n          board.state[boardKey][i][j].stack.blue > 0)\n      ) {\n        return board.state[boardKey][i][j]\n      }\n    }\n  }\n\n  if (board.outOfBoundsState[boardKey].color == Color.BLUE) {\n    return board.outOfBoundsState[boardKey]\n  }\n\n  return new Piece({ x: -2, y: -2 }, Color.EMPTY)\n}',
  find_first_stack:
    'function find_first_stack(board, boardKey) {\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (board.state[boardKey][i][j].color == Color.STACK) {\n        return board.state[boardKey][i][j]\n      }\n    }\n  }\n\n  if (board.outOfBoundsState[boardKey].color == Color.STACK) {\n    return board.outOfBoundsState[boardKey]\n  }\n\n  return new Piece({ x: -2, y: -2 }, Color.EMPTY)\n}',
  find_blue_pieces:
    'function find_blue_pieces(board, boardKey) {\n  var vertices = []\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (board.state[boardKey][i][j].color == Color.BLUE) {\n        vertices.push(board.state[boardKey][i][j])\n      }\n    }\n  }\n\n  vertices.sort((a, b) => {\n    a.x - b.x == 0 ? a.y - b.y : a.x - b.x\n  })\n  return vertices\n}',
  find_red_pieces:
    'function find_red_pieces(board, boardKey) {\n  var vertices = []\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (board.state[boardKey][i][j].color == Color.RED) {\n        vertices.push(board.state[boardKey][i][j])\n      }\n    }\n  }\n  vertices.sort((a, b) => {\n    a.x - b.x == 0 ? a.y - b.y : a.x - b.x\n  })\n  return vertices\n}',
  find_stacks:
    'function find_stacks(board, boardKey) {\n  var vertices = []\n  for (var i = 0; i < board.state[boardKey].length; i++) {\n    for (var j = 0; j < board.state[boardKey].length; j++) {\n      if (board.state[boardKey][i][j].color == Color.STACK) {\n        vertices.push(board.state[boardKey][i][j])\n      }\n    }\n  }\n  vertices.sort((a, b) => {\n    a.x - b.x == 0 ? a.y - b.y : a.x - b.x\n  })\n  return vertices\n}'
}

export const auxiliaryFunctionsNames = Object.keys(auxiliaryFunctions)
