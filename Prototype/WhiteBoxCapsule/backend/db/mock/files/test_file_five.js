function test_file_five(board) {
    var a = board.find_first_stack(board)

    if (a.stack.x + a.stack.y % 2 == 0) {
        return true;
    } else {
        return false;
    }
}