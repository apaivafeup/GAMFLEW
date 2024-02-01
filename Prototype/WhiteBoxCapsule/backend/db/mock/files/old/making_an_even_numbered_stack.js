function making_an_even_numbered_stack(board) {
    // The following functions work with the board object.
    // It finds the first stack in the board and returns it.
    // Stack: a spot with more than one piece (at least 2).
    var a = utils.find_first_stack(board)

    // A stack is divided in two parts: blue and red.
    // Each part counts the respective color's number of pieces in the stack.
    if (a.stack.red + a.stack.blue % 2 == 0 &&
        a.stack.red + a.stack.blue > 2) {
        return true;
    } else {
        return false;
    }
}