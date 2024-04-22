function has_game_ended(board) {
    var pieces = utils.get_pieces(board);

    // If there is only one piece left, the game has ended.
    if (pieces.length == 1) {
        return true;
    } else if (pieces.every(p => p.color == Color.RED) || pieces.every(p => p.color == Color.BLUE)) {
        return true;
    } else {
        return false;
    }
}