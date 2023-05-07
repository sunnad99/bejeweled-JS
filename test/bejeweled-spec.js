const chai = require("chai");
const spies = require('chai-spies');
chai.use(spies);

const expect = chai.expect;


const Bejeweled = require("../class/bejeweled.js");

let swap = (a, b, c,d, arr) => {

    let temp = arr[a][b];
    arr[a][b] = arr[c][d];
    arr[c][d] = temp;

    return arr;
}

describe ('Bejeweled', function () {

    let game;
    let grid;
    beforeEach(() => {

        grid = Array.from({ length: 8 }, (v, i) => Array.from({ length: 8 }, (v, i) => " "));
        game = new Bejeweled();

    })
  // Add tests for setting up a basic board
  //1. make a test for when the board is empty
  //2. use a random seed to initialize a board and see if it matches

  it("should have a static property of gems", () => {

    expect(Bejeweled).to.have.property("gems");
    expect(Bejeweled.gems.length).to.equal(8);

    expect(Bejeweled.gems.length === new Set(Bejeweled.gems).size).to.be.true;

  })

  describe("constructor()", () => {

    it("should initialize an 8x8 grid with gems", () => {

        expect(game).to.have.property("grid");

        expect(game.grid.length).to.equal(grid.length);
        expect(game.grid[0].length).to.equal(grid[0].length);

        for(let curRow = 0; curRow < game.grid.length; curRow++){
            for(let curCol = 0; curCol < game.grid[0].length; curCol++){

                let curChar = game.grid[curRow][curCol];

                expect(curChar).to.not.equal(" ");
            }

        }
    })
  })

  // Add tests for a valid swap that matches 3
  describe("checkForMatches(grid)", () => {

    context("Horizontal Match", () => {

        it("should return all horizontal matches when a valid horizontal has happened", () => {

            grid[0][0] = grid[0][1] = grid[1][2] = "🍓";



            expect(Bejeweled.checkForMatches(grid)).to.have.lengthOf(0);

            grid = swap(1,2,0,2,grid);


            expect(Bejeweled.checkForMatches(grid)).to.have.lengthOf(3);

        })

    })

    context("Vertical Match", () => {

        it("should return all vertical matches when a valid vertical swap has happened", () => {

            grid[0][0] = grid[1][0] = grid[2][1] = "🍓";


            expect(Bejeweled.checkForMatches(grid)).to.have.lengthOf(0);

            grid = swap(2,1,2,0,grid);

            expect(Bejeweled.checkForMatches(grid)).to.have.lengthOf(3);

        })

    })

    // Add tests to check if there are no possible valid moves
    context("No swaps available", () => {

        it("should not make a swap when no horizontal swaps are available", () => {

            grid[0][0] = grid[0][2] = "🍓";
            grid[1][2] = "🥝";

            grid = swap(0,3,1,2,grid);

            expect(Bejeweled.checkForMatches(grid)).to.have.lengthOf(0);
        })

        it("should not make a swap when no vertical swaps are available", () => {

            grid[0][0] = grid[1][0] = "🍓";
            grid[2][1] = "🥝";


            grid = swap(3,0,2,1,grid);

            expect(Bejeweled.checkForMatches(grid)).to.have.lengthOf(0);
        })

        it("should should not make a swap when no swaps are available at all on the entire grid", () => {

            grid.forEach((row,curRow) => {

                row.forEach((el, curCol) => {

                    let index = curRow % 2 == 0 ? curCol : (grid.length - 1) - curCol;
                    grid[curRow][curCol] = Bejeweled.gems[index];
                })
            })

            expect(Bejeweled.checkForMatches(grid)).to.have.lengthOf(0);
        })
    })

  })

  describe("addressMatches(grid)", () => {

    // Add tests for swaps that set up combos
    it("should at least be called once whenever there is a match that is found", () => {

        grid = [
            ['🍊', '🥝', '🍇', '🍓', '🥥', '🍋', '🍓', '🥝'],
            ['🥝', '🍊', '🥝', '🍇', '🥥', '🥥', '🍋', '🍓'],
            ['🍊', '🥝', '🍊', '🍓', '🍓', '🍋', '🍓', '🥝'],
            ['🍇', '🥝', '🍇', '🍓', '🥥', '🍋', '🍇', '🥝'],
            ['🍊', '🥥', '🍇', '🥥', '🍓', '🍊', '🍓', '🥥'],
            ['🍊', '🥝', '🍓', '🍋', '🍓', '🍋', '🍊', '🥝'],
            ['🍋', '🥝', '🍇', '🍓', '🥥', '🍓', '🍓', '🍋'],
            ['🍊', '🍓', '🍇', '🍇', '🥥', '🍋', '🥝', '🥝']
        ];


        game.cursor.row = 5;
        game.cursor.col = 2;

        game.cursor.nextRow = 4;
        game.cursor.nextCol = 2;

        grid = swap(5,2,4,2, grid);

        const combos = chai.spy.on(Bejeweled, 'checkForMatches');

        Bejeweled.addressMatches.call(game,grid);
        expect(combos).to.have.been.called.at.least(1);


    })

  })


});
