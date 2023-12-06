function draw_a_triangle(board) {
    // This function finds all blue pieces in the board and
    // returns them in a list. The final list is ordered by
    // row and column - respectively, (x, y).
    var vertices = utils.find_blue_pieces(board)

    if (vertices.length != 3) {
        return;
    }

    var side_a = [vertices[0], vertices[1]],
        side_b = [vertices[1], vertices[2]],
        side_c = [vertices[2], vertices[0]];

    // This function calcuates the Cartesian distance between
    // two (x, y) vertices. It rounds up to the nearest integer.
    var side_a_length = utils.distance(side_a[0], side_a[1]),
        side_b_length = utils.distance(side_b[0], side_b[1]),
        side_c_length = utils.distance(side_c[0], side_c[1]);

    // Math.sqrt() calculates the square root of a number.
    // Math.pow(number, power) calculates number^power.
    // Sets are like lists, but they contain no duplicates.
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