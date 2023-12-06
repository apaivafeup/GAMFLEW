function making_a_stack(board) {
    // The following functions work with the board object.
    // They search the board by rows and columns, in order.
    // They return the first piece they find, or an invalid piece.
    var a = board.find_first_red_piece(board)
    var b = board.find_first_blue_piece(board)
    
    // Position is an object with x and y coordinates.
    // x is the row, y is the column.
    if (a.position == b.position) {
        return true;
    } else if (a.position.x == -1 && a.position.y == -1) {
        return true;
    } else if (b.position.x == -1 && b.position.y == -1) {
        return true;
    } else {
        return false;
    }
}