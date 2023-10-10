class Board {
    constructor() {
        this.board = [];
        this.boardSide = 8;
        generateBoard();
    }

    generateBoard() {
        for (let i = 0; i < this.boardSide; i++) {
            for (let j = 0; j < this.boardSide; j++) {
                this.board[i][j] = 0;
            }
        }

        const square = document.createElement(type)
        newElement.innerHTML = 'It is a new element'

    }
}