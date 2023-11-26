function tutorial_zero_one(from, to) {
    var a = Math.abs(from.x - to.x);
    var b = Math.abs(from.y - to.y);
    if (a > 2) {
        if (b < 2) {
            return true;
        } else {
            return false;
        }
    }
}

function tutorial_zero_two(board) {
    var a = board.count_red_pieces(board);
    var b = board.count_blue_pieces(board);

    let diff = Math.abs(a - b);

    switch (diff) { // OBJECTIVE, non-exhaustive
        case 0, 1: 
            return true;
        case 2, 3:
            return false;
        default:
            return true;
    }
}

function tutorial_zero_three(board) {
    var a = board.count_red_pieces(board);
    var b = board.count_blue_pieces(board);
    var c = board.count_empty_spaces(board);

    if (isTriangle(a, b, c)) {
        return true;
    } else {
        var min = Math.min(a, b, c);

        if (min == a) {
            return true;
        } else if (min == b) {
            return true;
        } else {
            return false;
        }
    }
}