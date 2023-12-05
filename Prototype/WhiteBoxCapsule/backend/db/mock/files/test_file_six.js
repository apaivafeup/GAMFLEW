function test_file_six(board) {
    // Sorted by x, then y coordinate.
    var vertices = utils.find_blue_pieces(board)

    if (vertices.length != 3) {
        return;
    }

    var side_a = [vertices[0], vertices[1]],
        side_b = [vertices[1], vertices[2]],
        side_c = [vertices[2], vertices[0]];

    var side_a_length = utils.distance(side_a[0], side_a[1]),
        side_b_length = utils.distance(side_b[0], side_b[1]),
        side_c_length = utils.distance(side_c[0], side_c[1]);

    if (Math.sqrt(Math.pow(side_a_length, 2) + Math.pow(side_b_length, 2)) == side_c_length) {
        return true;
    } else if (Set([side_a_length, side_b_length, side_c_length]).size == 3) {
        return true;
    } else if (Set([side_a_length, side_b_length, side_c_length]).size == 2) {
        return true;
    } else if (Set([side_a_length, side_b_length, side_c_length]).size == 1 && side_a_length == 0) {
        return false;
    }
}

// Passing criteria
var six_two = Set([utils.distance(utils.find_blue_pieces(input, input.currentKey)[0], utils.find_blue_pieces(input, input.currentKey)[1]), utils.distance(utils.find_blue_pieces(input, input.currentKey)[1], utils.find_blue_pieces(input, input.currentKey)[2]), utils.distance(utils.find_blue_pieces(input, input.currentKey)[2], utils.find_blue_pieces(input, input.currentKey)[0])]).length == 3
