function can_piece_move(piece) {
    // Checking diagonals, clockwise, starting on top-right quadrant.
    // Quadrants are: top-right, bottom-right, bottom-left, top-left.
    var directions = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
    ];

    // Kings can move in all directions.
    if (piece.king) {
        for (d in directions) {
            var destination_x = piece.position.x + d.x,
                destination_y = piece.position.y + d.y,
                capture_x = destination_x + d.x,
                capture_y = destination_y + d.y;

            if (board[destination_x][destination_y].color == Color.EMPTY ||
               (board[destination_x][destination_y].color != piece.color &&
                board[capture_x][capture_y].color == Color.EMPTY)) {
                return true;
            }
        }
    }

    // Normal pieces can only move in half the directions.
    // Blue and red pieces move in opposite directions!
    if (piece.color == Color.RED) {
        for (d in [directions[0], directions[3]]) {
            var destination_x = piece.position.x + d.x,
                destination_y = piece.position.y + d.y,
                capture_x = destination_x + d.x,
                capture_y = destination_y + d.y;

            // Color.EMPTY represents an empty space.
            if (board[destination_x][destination_y].color == Color.EMPTY ||
               (board[destination_x][destination_y].color != piece.color &&
                board[capture_x][capture_y].color == Color.EMPTY)) {
                return true;
            }
        }
    } else {
        // Blue pieces only move "up", which means
        // all moves have a negative y component.
        // They can have a positive or negative x component.
        for (d in [directions[1], directions[2]]) {
            var destination_x = piece.position.x + d.x,
                destination_y = piece.position.y + d.y,
                capture_x = destination_x + d.x,
                capture_y = destination_y + d.y;

            if (board[destination_x][destination_y].color == Color.EMPTY ||
               (board[destination_x][destination_y].color != piece.color &&
                board[capture_x][capture_y].color == Color.EMPTY)) {
                return true;
            }
        }
    }
}
