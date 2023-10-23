export class Challenge {
    constructor(name, submitCount, timer, board=null, file) {
        this.name = name;
        this.submitCount = submitCount;
        this.timer = timer
        this.board = board;
        this.file = file;
    }
}