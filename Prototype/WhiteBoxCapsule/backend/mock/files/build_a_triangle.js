function build_a_triangle(board) {
	var a = this.count_red_pieces(board); // Counts the number of blue pieces.
	var b = this.count_blue_pieces(board); // Counts the number of red pieces.
	var c = this.count_empty_spaces(board); // Counts the number of empty spaces (no pieces).
	
    // Tests if the lengths of the sides of the triangle are valid.
	if (this.is_triangle(a, b, c)) {
		return true;
	} else {
		if (b < c && b > a) {
			return true;
		} else if (b == a || b == c) {
			return true;
		} else {
			return false;
		}
	}
}