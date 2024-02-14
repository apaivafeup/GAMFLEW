import PieceStackCreatorVue from "../../../../frontend/src/components/PieceStackCreator.vue";

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