function tutorial_zero_three(board) {
    var a = board.count_red_pieces(board);
    var b = board.count_blue_pieces(board);
    var c = board.count_empty_spaces(board);

    if (isTriangle(a, b, c)) {
        return true;
    } else {
        if (b < c && b > a) {
            return true;
        } else if (b == a || b == c) {
            return true;
        } else {
            return false;
        }
    }
}