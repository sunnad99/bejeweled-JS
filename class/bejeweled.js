const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

    static gems = ["🍓", "🥝", "🍊", "🍋", "🥥", "🍉", "🍌", "🍒"];
    static score = 0; // total score
    static combo = 1; // multiplier

    static MAX_SCORE = 50;
    static MATCH_SCORE = 10;

  constructor() {

    // Initialization of grid and screen
    this.grid = this._initializeGrid();
    this.cursor = new Cursor(8, 8);

    Screen.initialize(8, 8);
    Screen.setGridlines(true);
    Bejeweled._fixInitialMatches(this.grid); // handles initial matches made by the
    Bejeweled._renderGrid(this.grid);

    this.cursor.setBackgroundColor(this.cursor.row, this.cursor.col);
    this._setOriginalCommands(this);
    Screen.setMessage(`To win, you need to have a score of at least ${Bejeweled.MAX_SCORE}`)

    Screen.render();
  }

  _setOriginalCommands(context){


    Screen.addCommand("up", "Moves 1 unit up", context.cursor.up.bind(context.cursor));
    Screen.addCommand("down", "Moves 1 unit down", context.cursor.down.bind(context.cursor));
    Screen.addCommand("left", "Moves 1 unit left", context.cursor.left.bind(context.cursor));
    Screen.addCommand("right", "Moves 1 unit right", context.cursor.right.bind(context.cursor));
    Screen.addCommand("return", "Select a gem to start swap", context.makeMove.bind(context));

    Screen.printCommands();
  }

  makeMove(){

    this.cursor.setNeighbors();

    Screen.addCommand("up", "Selects the upper neighbor (if available)", this.cursor.swapUp.bind(this.cursor));
    Screen.addCommand("down", "Selects the down neighbor (if available)", this.cursor.swapDown.bind(this.cursor));
    Screen.addCommand("left", "Selects the left neighbor (if available)", this.cursor.swapLeft.bind(this.cursor));
    Screen.addCommand("right", "Selects the right neighbor (if available)", this.cursor.swapRight.bind(this.cursor));
    Screen.addCommand("return", "Locks in the selected neighbor", Bejeweled.addressMatches.bind(this, this.grid));

    Screen.printCommands();
  }

  static _renderGrid(grid){

    grid.forEach((row, curRow) => {

        row.forEach((el, curCol) => {

            Screen.setGrid(curRow, curCol, el);

        })
    })
  }

  _initializeGrid(){

    let grid = [];
    for(let curRow = 0; curRow < 8; curRow++){

        let row = [];
        for(let curCol = 0; curCol < 8; curCol++){

            let newGem = Bejeweled.gems[Math.floor(Math.random() * Bejeweled.gems.length)];
            row.push(newGem);

        }

        grid.push(row);
    }

    return grid;

  }

  static _checkHorizontalMatches(grid){

    let horizontalMatches = [];
    for(let curRow = 0; curRow < grid.length; curRow++){

        let prevChar = null;
        let count = 0;
        let filled = false;
        for(let curCol = 0; curCol < grid[0].length; curCol++){

            let row = grid[curRow];
            let curChar = row[curCol];
            if(curChar === " ") continue; // just for testing purposes

            if(!prevChar) prevChar = curChar;

            if(prevChar === curChar){
                count++;
            }else{

                count = 1;
                prevChar = curChar;
            }

            if(count >= 3){

                if(!filled){

                    let curMatches = Array.from({ length: count },(value, index) => ({row: curRow, col:(curCol + 1) - count + index}));
                    horizontalMatches.push(...curMatches);
                    filled = true;
                }else{

                    horizontalMatches.push({row:curRow, col:curCol});
                }

            }
        }

    }

    return horizontalMatches;
  }

  static _checkVerticalMatches(grid){

    let verticalMatches = [];
    for(let curCol = 0; curCol < grid[0].length; curCol++){

        let filled = false;
        let prevChar = null;
        let count = 0;
        for(let curRow = 0; curRow < grid.length; curRow++){

            let curChar = grid[curRow][curCol];
            if(curChar === " ") continue; // just for testing purposes

            if(!prevChar) prevChar = curChar;

            if(prevChar === curChar){
                count++;
            }else{

                count = 1;
                prevChar = curChar;
            }


            if(count >= 3){

                if(!filled){

                    let curMatches = Array.from({ length: count },(value, index) => ({row: (curRow + 1) - count + index, col:curCol}));
                    verticalMatches.push(...curMatches);
                    filled = true;
                }else{

                    verticalMatches.push({row:curRow, col:curCol});
                }

            }

        }

    }

    return verticalMatches;
  }

  static checkForMatches(grid) {

    // Fill this in
    return [...Bejeweled._checkHorizontalMatches(grid),  ...Bejeweled._checkVerticalMatches(grid)];

  }

  static checkDropability(grid) {

    return grid.find((row, curRow) => {

        let foundRow = row.find((el, curCol) => {

            let nextEl;
            if(curRow < grid.length - 1){

                nextEl = grid[curRow + 1][curCol];
            }

            return el !== " " && nextEl === " ";
        })

        return foundRow !== undefined;
    })

}
    static _shiftEmptySpaces(grid){
        for(let curRow = 0; curRow < grid.length - 1; curRow++){

            for(let curCol = 0; curCol < grid[0].length; curCol++){

                let curGem = grid[curRow][curCol];
                let nextGem = grid[curRow + 1][curCol];

                if(curGem !== " " && nextGem === " "){

                    grid[curRow][curCol] = nextGem;
                    grid[curRow + 1][curCol] = curGem;
                }
            }
        }
    }

  static clearGems(matches, grid){

    // for every match, clear the spot on the grid
    // after clearing spots, shift all the empty spaces up and the fruits down

    for(let match of matches){

        grid[match.row][match.col] = " ";
    }

    let droppable = true;

    while(droppable){


        Bejeweled._shiftEmptySpaces(grid);
        droppable = Bejeweled.checkDropability(grid);
    }
  }

  static dropGems(grid){


    // start iterating from the bottom
    // everytime there is an empty character, add a random gem there
    for(let curRow = grid.length - 1; curRow >= 0 ; curRow--){

        for(let curCol = 0; curCol < grid[0].length; curCol++){

            let curGem = grid[curRow][curCol];
            if (curGem === " ") grid[curRow][curCol] = Bejeweled.gems[Math.floor(Math.random() * Bejeweled.gems.length)];
        }
    }
  }

  static comboHandler(grid, time, isPlaying = false){

    let matches = Bejeweled.checkForMatches(grid);
    if (matches.length > 0){

        if(isPlaying){
            Bejeweled.score += Bejeweled.MATCH_SCORE * Bejeweled.combo;
            Bejeweled.combo += 1;
        }

        setTimeout(() => {

            Bejeweled.clearGems(matches,grid);
            Bejeweled._renderGrid(grid);
            Screen.render();

        }, time)

        setTimeout(() => {

            Bejeweled.dropGems(grid);;
            Bejeweled._renderGrid(grid);
            Screen.render();

        }, time * 2)


        setTimeout(() => {

            Screen.setMessage(`Your current score is ${Bejeweled.score}`)
            Screen.render();
            Bejeweled.comboHandler(grid, time, isPlaying);

        }, time * 3)

    }else{
        Bejeweled.combo = 1;
    }

  }

  static swapNeighbors(row,col,nextRow, nextCol,grid){

    let temp = grid[row][col];
    grid[row][col] = grid[nextRow][nextCol];
    grid[nextRow][nextCol] = temp;

  }

  // helper function to just settle the initial matches correctly without taking them into account for the score
  static _fixInitialMatches(grid){

    let matches = Bejeweled.checkForMatches(grid);
    if (matches.length > 0){

        Bejeweled.clearGems(matches,grid);
        Bejeweled.dropGems(grid);
        Bejeweled._fixInitialMatches(grid);
    }

  }

  // function has to be bound to the game object
  static addressMatches(grid){

    // remove color from neighbors
    this.cursor._resetNeighborColors();

    if(!this.cursor.nextRow && !this.cursor.nextCol){

        Screen.setMessage("Invalid neighbor selected!!! Please try again");
        Screen.render();

    }

    // For a successful swap, show the swap happening in real time
    Bejeweled.swapNeighbors(this.cursor.row, this.cursor.col, this.cursor.nextRow, this.cursor.nextCol, grid);
    Bejeweled._renderGrid(grid);
    Screen.render();



    let matches = Bejeweled.checkForMatches(grid);
    if(matches.length > 0){

        Bejeweled.comboHandler(grid,2000, true);


    }
    else{

        // reset the grid to default
        Bejeweled.swapNeighbors(this.cursor.row, this.cursor.col, this.cursor.nextRow, this.cursor.nextCol, grid);
        Bejeweled._renderGrid(grid);
        Screen.render();
    }

    this._setOriginalCommands(this);
    this.cursor._resetSelectedNeighbor();

    if(Bejeweled.score >= Bejeweled.MAX_SCORE) {

        Screen.setQuitMessage(`You won with ${Bejeweled.score} points!`)
        Screen.quit(true);
    };
  }
}

module.exports = Bejeweled;
