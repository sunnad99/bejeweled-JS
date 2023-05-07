const Screen = require("./screen");

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.nextRow = null;
    this.currentRow = null;

    this.gridColor = 'black';
    this.cursorColor = 'yellow';
    this.neighbors = [];

  }

  resetBackgroundColor(row, col) {
    Screen.setBackgroundColor(row, col, this.gridColor);
  }

  setBackgroundColor(row,col) {
    Screen.setBackgroundColor(row, col, this.cursorColor);
  }

  _renderAllNeighbors(){

    for(let curNeighbor = 0; curNeighbor < this.neighbors.length; curNeighbor++){

        let neighbor = this.neighbors[curNeighbor];

        Screen.setBackgroundColor(neighbor.row, neighbor.col, "white");

    }

    Screen.render();

  }

  setNeighbors(){

    this.neighbors = [{row: this.row - 1, col: this.col}, {row: this.row + 1, col: this.col},{row: this.row, col: this.col - 1},{row: this.row, col: this.col + 1}];


    for(let curNeighbor = 0; curNeighbor < this.neighbors.length; curNeighbor++){

        let neighbor = this.neighbors[curNeighbor];

        if(!(neighbor.row >= 0 && neighbor.row < (this.numRows)) ||
            !(neighbor.col >= 0 && neighbor.col < (this.numCols))){

                this.neighbors.splice(curNeighbor,1)
                curNeighbor--;
            }

    }

    this._renderAllNeighbors();


  }

  _resetSelectedNeighbor(){

    this.nextRow = null;
    this.nextCol = null;
  }

  _resetNeighborColors(){

    for(let neighbor of this.neighbors){

        this.resetBackgroundColor(neighbor.row, neighbor.col);
    }
  }

  swapDown(){
    // Only if the nextRow is initialized, reset the color
    if (this.nextRow) this.resetBackgroundColor(this.nextRow, this.nextCol);

    if(this.row < (this.numRows - 1)){

        this.nextRow = this.row + 1;
        this.nextCol = this.col;
        this.setBackgroundColor(this.nextRow, this.nextCol);
    }else{

        this.nextRow = null;
        this.nextCol = null;
    }

    Screen.render();

  }

  swapUp(){

    // Only if the nextRow is initialized, reset the color
    if (this.nextRow) this.resetBackgroundColor(this.nextRow, this.nextCol);

    if(this.row > 0){

        this.nextRow = this.row - 1;
        this.nextCol = this.col;
        this.setBackgroundColor(this.nextRow, this.nextCol);
    }else{

        this.nextRow = null;
        this.nextCol = null;
    }

    Screen.render();
  }

  swapRight(){

    // Only if the nextRow is initialized, reset the color
    if (this.nextRow) this.resetBackgroundColor(this.nextRow, this.nextCol);

    if(this.col < (this.numCols - 1)){

        this.nextRow = this.row;
        this.nextCol = this.col + 1;

        this.setBackgroundColor(this.nextRow, this.nextCol);
    }else{

        this.nextRow = null;
        this.nextCol = null;
    }

    Screen.render();
  }

  swapLeft(){

    // Only if the nextRow is initialized, reset the color
    if (this.nextRow) this.resetBackgroundColor(this.nextRow, this.nextCol);


    if(this.col > 0){

        this.nextRow = this.row;
        this.nextCol = this.col - 1;

        this.setBackgroundColor(this.nextRow, this.nextCol);
    }else{

        this.nextRow = null;
        this.nextCol = null;
    }

    Screen.render();
  }

  up() {
    // Move cursor up

    this.resetBackgroundColor(this.row, this.col);

    if(this.row > 0){

        this.row -= 1;
    }

    this.setBackgroundColor(this.row, this.col);
    Screen.render();
  }



  down() {
    this.resetBackgroundColor(this.row, this.col);
    // Move cursor down
    if(this.row < (this.numRows - 1)){

        this.row += 1;
    }

    this.setBackgroundColor(this.row, this.col);
    Screen.render();
  }

  left() {

    this.resetBackgroundColor(this.row, this.col);
    // Move cursor left
    if(this.col > 0){
        this.col -= 1;
    }
    this.setBackgroundColor(this.row, this.col);
    Screen.render();
  }

  right() {
    // Move cursor right
    this.resetBackgroundColor(this.row, this.col);
    if(this.col < (this.numCols - 1)){

        this.col += 1;
    }
    this.setBackgroundColor(this.row, this.col);
    Screen.render();
  }

}


module.exports = Cursor;
