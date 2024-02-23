function counting_pieces(board) {
	// The following functions work with the board object.
	// Each counts the respective color's number of pieces in the board.
	var a = count_red_pieces(board);
	var b = count_blue_pieces(board);

	// Math.abs(-1) = 1
	let diff = Math.abs(a - b);

	switch (diff) {
		case 1:
			return true;
		case 2, 3:
			return false;
		default:
			return true;
	}
}