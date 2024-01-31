import PieceStackCreatorVue from "../../../../frontend/src/components/PieceStackCreator.vue";

// piece is the piece that is moving.
// start: the (x, y) position from where the piece moved.
// destination: the (x, y) position to where the piece moved.
function is_valid_move(piece, start, destination) {
    // Math.abs() gives you the absolute value of whatever you call it with.
    // Math.abs(-1) == 1
	if (destination.x < 0 || destination.x > 7 ||
        destination.y < 0 || destination.y > 7) {
        return false;
    }

    var lineDifference = Math.abs(start.x - destination.x);
    var columnDifference = Math.abs(start.y - destination.y);

    if (lineDifference != columnDifference) {
        return false;
    } else {
        if (lineDifference == 1) {
            if (board[destination.x][destination.y].color == Color.EMPTY) {
                return true;
            } else {
                return false;
            }
        } else if (lineDifference == 2) {
            if (board[destination.x][destination.y].color == Color.EMPTY) {
                if (board[start.x + 1][start.y + 1].color == piece.color) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

function is_board_valid(board) {
    var bluePieces = utils.count_blue_pieces(board);
    var redPieces = utils.count_red_pieces(board);

    if (bluePieces > 12 || redPieces > 12) {
        return false;
    } else if (bluePieces == 0 || redPieces == 0) {
        return false
    }

    var pieces = utils.get_pieces(board);
    var odd = [1, 3, 5, 7], even = [0, 2, 4, 6];

    for (p in pieces) {
        if (p.position.x % 2 != 0) {
            if (!even.includes(p.position.y)) {
                return false;
            }
        } else {
            if (!odd.includes(p.position.y)) {
                return false;
            }
        }
    }

    return true
}

function can_piece_move(piece) {
    // Checking diagonals, clockwise, starting top left.
    var directions = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
    ];

    if (piece.isKing) {
        for (d in directions) {
            var destination_x = piece.position.x + d.x,
                destination_y = piece.position.y + d.y ;

            if ( (board[destination_x][destination_y].color == Color.EMPTY) ||
                (board[destination_x][destination_y].color != piece.color &&
                board[destination_x + d.x][destination_y + d.y].color == Color.EMPTY)) {
                return true;
            }
        }
    }

    if (piece.color == Color.RED) {
        for (d in directions.slice(0, 2)) {
            var destination_x = piece.position.x + d.x,
                destination_y = piece.position.y + d.y ;

            if (board[destination_x][destination_y].color == Color.EMPTY ||
                (board[destination_x][destination_y].color != piece.color &&
                board[destination_x + d.x][destination_y + d.y].color == Color.EMPTY)) {
                return true;
            }
        }
    } else {
        for (d in directions.slice(2, 4)) {
            var destination_x = piece.position.x + d.x,
                destination_y = piece.position.y + d.y ;

            if (board[destination_x][destination_y].color == Color.EMPTY ||
                (board[destination_x][destination_y].color != piece.color &&
                board[destination_x + d.x][destination_y + d.y].color == Color.EMPTY)) {
                return true;
            }
        }
    }
}

function has_game_ended(board) {
    var pieces = utils.get_pieces(board);

    if (pieces.length == 1) {
        return true;
    } else if (utils.count_blue_pieces(board) == utils.count_red_pieces(board)) {
        return false;
    }
}

function who_won(board) {
    if (utils.count_blue_pieces(board) == 0) {
        return Color.RED;
    } else if (utils.count_red_pieces(board) == 0) {
        return Color.BLUE;
    }
}