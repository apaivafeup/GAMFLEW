// from: the (x, y) position of the piece moved.
// to: the (x, y) position to where the piece moved.
function making_moves(from, to) {
    // Math.abs() gives you the absolute value of whatever you call it with.
    // Math.abs(-1) == 1
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