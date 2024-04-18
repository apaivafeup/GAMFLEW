function draw_a_triangle(board) {
    // This function finds all blue pieces in the board and
    // returns them in a list. The final list is ordered by
    // row and column - respectively, (x, y).
    var vertices = utils.find_blue_pieces(board)

    if (vertices.length != 3) {
        return;
    }

    var side_1 = [vertices[0], vertices[1]],
        side_2 = [vertices[1], vertices[2]],
        side_3 = [vertices[2], vertices[0]];

    // This function calculates the Cartesian distance between
    // two (x, y) vertices. It rounds up to the nearest integer.
    var length_1 = utils.distance(side_1[0], side_1[1]),
        length_2 = utils.distance(side_2[0], side_2[1]),
        length_3 = utils.distance(side_3[0], side_3[1]);

    var ordered_sides = [length_1, length_2, length_3].sort();

    var side_a = ordered_sides[0],
        side_b = ordered_sides[1],
        side_c = ordered_sides[2];

    // Math.sqrt() calculates the square root of a number.
    // Math.pow(number, power) calculates number^power.
    // Sets are like lists, but they contain no duplicates.
    if (Math.sqrt(Math.pow(side_a, 2) + Math.pow(side_b, 2)) == side_c) {
        return true;
    } else if (new Set([side_a, side_b, side_c]).size == 3) {
        return true;
    } else if (new Set([side_a, side_b, side_c]).size == 2) {
        return true;
    } else if (new Set([side_a, side_b, side_c]).size == 1 && side_a == 0) {
        return false;
    }
}