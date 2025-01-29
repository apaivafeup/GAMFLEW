function is_board_valid(board) {
    var bluePieces = utils.count_blue_pieces(board);
    var redPieces = utils.count_red_pieces(board);

    if (bluePieces > 12 || redPieces > 12) {
        return false;
    } else if (bluePieces == 0 || redPieces == 0) {
        return false;
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

    return true;
}