function who_won(board) {
    var blue = utils.count_blue_pieces(board),
        red = utils.count_red_pieces(board);

    if (blue == red) {
        if (utils.count_empty_spaces(board) != 64) {
            // Tie
            return [Color.RED, Color.BLUE];
        } else {
            // Invalid board.
            return null;
        }
    } else {
        if (blue > red) {
            return Color.BLUE;
        } else {
            return Color.RED;
        }
    }
}