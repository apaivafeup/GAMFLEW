// piece is the piece that is moving.
// start: the (x, y) position from where the piece moved.
// destination: the (x, y) position to where the piece moved.
function is_valid_move(board, start, destination) {
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
                var middlePiece = board[Math.round((start.x + destination.x) / 2)][Math.round((start.y + destination.y) / 2)];
                if (middlePiece.color == board[start.x][start.y].color) {
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