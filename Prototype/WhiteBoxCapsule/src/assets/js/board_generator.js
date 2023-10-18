export class Board {
  constructor() {
    this.board = []
    this.boardSide = 8
    this.snippetFilename = '../example.txt'
    this.generateBoard()
  }

  generateBoard() {
    for (let i = 0; i < this.boardSide; i++) {
      for (let j = 0; j < this.boardSide; j++) {
        this.board[i][j] = 0
      }
    }

    // var fileContentsElement = document.getElementById('code-snippet');
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', this.snippetFilename, true);

    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         var fileContents = xhr.responseText;
    //         fileContentsElement.textContent = fileContents;
    //     }
    // };

    // xhr.send();
  }
}

var board = new Board()
