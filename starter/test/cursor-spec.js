const { expect } = require('chai');

const Cursor = require("../class/cursor.js");
const Screen = require("../class/screen.js");

describe ('Cursor', function () {

  let cursor;

  beforeEach(function() {
    cursor = new Cursor(8, 8);
  });


  it('initializes for a 8x8 grid', function () {
    expect(cursor.row).to.equal(0);
    expect(cursor.col).to.equal(0);
  });

  it('correctly processes down inputs', function () {

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 0]);

    for (let i = 0; i < 10; i++) cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([7, 0]);
  });

  it('correctly processes up inputs', function () {

    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

  it('processes right inputs', function () {

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 2]);

    for (let i = 0; i < 10; i++) cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 7]);
  });

  it('processes left inputs', function () {

    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

  it('handles selection correctly', function() {
    expect(cursor.selected).to.be.null;

    let result = cursor.select();
    expect(cursor.selected).to.deep.equal({ row: 0, col: 0 });
    expect(result).to.be.null;

    cursor.right();
    result = cursor.select();
    expect(result).to.deep.equal({
      from: { row: 0, col: 0 },
      to: { row: 0, col: 1 }
    });
    expect(cursor.selected).to.be.null;

    cursor.select();
    cursor.down();
    result = cursor.select();
    expect(result).to.deep.equal({
      from: { row: 0, col: 1 },
      to: { row: 1, col: 1 }
    });
  });



});

