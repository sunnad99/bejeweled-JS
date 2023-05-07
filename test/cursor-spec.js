const { expect } = require('chai');

const Cursor = require("../class/cursor.js");
const Screen = require("../class/screen.js");

describe ('Cursor', function () {

  let cursor;
  let numRows;
  let numCols;
  beforeEach(function() {
    numRows = 8;
    numCols = 8;
    cursor = new Cursor(numRows, numCols);
  });


  it('initializes for a 8x8 grid', function () {
    expect(cursor.row).to.equal(0);
    expect(cursor.col).to.equal(0);
  });

  context("Normal Movement inputs", () => {

    it('correctly processes down inputs', function () {

        for(let i = 0; i < 20; i++){

            let curRow = i;
            if (curRow > (numRows - 1)) curRow = (numRows - 1);


            expect([cursor.row, cursor.col]).to.deep.equal([curRow, 0]);
            cursor.down();
        }

      });

      it('correctly processes up inputs', function () {

        cursor.row = 7;
        cursor.col = 7;
        cursor.up();
        expect([cursor.row, cursor.col]).to.deep.equal([6, 7]);

        cursor.down();
        expect([cursor.row, cursor.col]).to.deep.equal([7, 7]);

        cursor.down();
        expect([cursor.row, cursor.col]).to.deep.equal([7, 7]);

        cursor.up();
        expect([cursor.row, cursor.col]).to.deep.equal([6, 7]);
      });

      it('processes right inputs', function () {

        for(let i = 0; i < 20; i++){

            let curCol = i;
            if (curCol > (numCols - 1)) curCol = (numCols - 1);


            expect([cursor.row, cursor.col]).to.deep.equal([0, curCol]);
            cursor.right();
        }
      });

      it('processes left inputs', function () {

        cursor.row = 7;
        cursor.col = 7;
        cursor.left();
        expect([cursor.row, cursor.col]).to.deep.equal([7, 6]);


        cursor.right();
        expect([cursor.row, cursor.col]).to.deep.equal([7, 7]);

        cursor.right();
        expect([cursor.row, cursor.col]).to.deep.equal([7, 7]);

        cursor.left();
        expect([cursor.row, cursor.col]).to.deep.equal([7, 6]);
      });

  })

  context("Swap selection inputs", () => {

    it("correctly chooses the down neighbor", () => {

        cursor.row = 3;
        cursor.col = 3;

        cursor.swapDown();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([4,3]);

        cursor.swapDown();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([4,3]);

        cursor.row = 7;
        cursor.col = 7;

        cursor.swapDown();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);



        cursor.row = 7;
        cursor.col = 0;

        cursor.swapDown();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);

    })

    it("correctly chooses the upper neighbor", () => {

        cursor.row = 3;
        cursor.col = 3;

        cursor.swapUp();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([2,3]);

        cursor.swapUp();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([2,3]);

        cursor.row = 0;
        cursor.col = 7;

        cursor.swapUp();

        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);



        cursor.row = 0;
        cursor.col = 0;

        cursor.swapUp();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);

    })


    it("correctly chooses the right neighbor", () => {

        cursor.row = 3;
        cursor.col = 3;

        cursor.swapRight();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([3,4]);

        cursor.swapRight();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([3,4]);


        cursor.row = 0;
        cursor.col = 7;

        cursor.swapRight();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);



        cursor.row = 7;
        cursor.col = 7;

        cursor.swapRight();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);

    })

    it("correctly chooses the left neighbor", () => {

        cursor.row = 3;
        cursor.col = 3;

        cursor.swapLeft();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([3,2]);

        cursor.swapLeft();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([3,2]);


        cursor.row = 0;
        cursor.col = 0;

        cursor.swapLeft();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);



        cursor.row = 7;
        cursor.col = 0;

        cursor.swapLeft();
        expect([cursor.nextRow, cursor.nextCol]).to.deep.equal([null,null]);

    })

  })


  context("highlights all neighbors", () => {

    it("has a function 'setNeighbors'", () => {

        expect(cursor).to.have.property("setNeighbors");
    })

    it("should set top, bottom, left and right neighbors properly (normal case)", () => {

        cursor.row = 3;
        cursor.col = 3;



        cursor.setNeighbors()
        expect(cursor.neighbors).to.have.deep.members([{row:2, col:3}, {row:4, col:3}, {row:3, col:2}, {row:3, col:4}]);
    })

    it("should handle top edges", () => {


        cursor.row = 0;
        cursor.col = 3;

        cursor.setNeighbors()
        expect(cursor.neighbors).to.have.deep.members([{row:0,col:2}, {row:0, col:4}, {row:1, col:3}]);

        cursor.row = 0;
        cursor.col = 0;

        cursor.setNeighbors()
        expect(cursor.neighbors).to.have.deep.members([{row:1,col:0}, {row:0, col:1}]);

        cursor.row = 0;
        cursor.col = 7;

        cursor.setNeighbors()
        expect(cursor.neighbors).to.have.deep.members([{row:1,col:7}, {row:0, col:6}]);
    })

    it("should handle bottom edges", () => {


        cursor.row = 7;
        cursor.col = 3;

        cursor.setNeighbors()
        expect(cursor.neighbors).to.have.deep.members([{row:7,col:2}, {row:7, col:4}, {row:6, col:3}]);

        cursor.row = 7;
        cursor.col = 0;

        cursor.setNeighbors()
        expect(cursor.neighbors).to.have.deep.members([{row:7,col:1}, {row:6, col:0}]);

        cursor.row = 7;
        cursor.col = 7;

        cursor.setNeighbors()
        expect(cursor.neighbors).to.have.deep.members([{row:7,col:6}, {row:6, col:7}]);
    })
  })



});
