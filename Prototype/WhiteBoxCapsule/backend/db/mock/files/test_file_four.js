function test_file_four(board) {
    var a = board.find_first_red_piece(board)
    var b = board.find_first_blue_piece(board)
    
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