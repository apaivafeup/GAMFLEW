function test_file_five(board) {
    var a = board.find_first_stack(board)

    if (a.stack.red + a.stack.blue % 2 == 0 && a.stack.red + a.stack.blue > 2) {
        return true;
    } else {
        return false;
    }
}