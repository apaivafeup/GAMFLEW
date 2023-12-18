// from: the (x, y) position of the piece moved.
// to: the (x, y) position to where the piece moved.
function never_out_of_bounds(from, to) {   
    if (from.x >= 7 || from.x <= 0) {
        return false;
    } else if (from.x >= 7 || from.x <= 0 || from.y >= 7) {
        return false;
    } else if (to.x >= 7 || to.x <= 0 || to.y >= 7 || to.y <= 0) {
        return false;
    } else {
        return true;
    }
}

var s = "else if (from.x >= 7 || from.y <= 0 || to.y >= 7) {\n\t\treturn false;\n\t} else if (from.x >= 7 || to.x <= 0 || from.y >= 7 || to.y <= 0) {\n\t\treturn false;\n\t} else {\n\t\treturn true;\n\t}\n}"