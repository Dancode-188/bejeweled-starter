const { expect } = require('chai');

const Bejeweled = require("../class/bejeweled.js");

describe ('Bejeweled', function () {
  let game;

  beforeEach(function () {
    game = new Bejeweled();
  });

  // Add tests for setting up a basic board
  describe('Setting up a basic board', function() {
    it('should initialize an 8x8 grid', function() {
      expect(game.grid.length).to.equal(8);
      expect(game.grid[0].length).to.equal(8);
    });

    it("should fill the grid with valid gems", function () {
      const validGems = ["🍒", "🍋", "🍊", "🍓", "🫐", "🍇"];
      game.grid.forEach((row) => {
        row.forEach((gem) => {
          expect(validGems).to.include(gem);
        });
      });
    });
  });

  // Add tests for a valid swap that matches 3
  describe('Valid swap that matches 3', function() {
    it('should allow valid swaps', function() {
      game.grid = [
        ["🍒", "🍋", "🍊"],
        ["🍓", "🍓", "🍇"],
        ["🫐", "🍓", "🍊"],
      ];
      expect(game.isValidSwap(1, 1, 2, 1)).to.be.true;
    });

    it("should detect a match of 3", function () {
      game.grid = [
        ["🍒", "🍋", "🍊"],
        ["🍓", "🍓", "🍓"],
        ["🫐", "🍇", "🍊"],
      ];
      expect(Bejeweled.checkForMatches(game.grid)).to.deep.equal([
        [1, 0],
        [1, 1],
        [1, 2],
      ]);
    });
  });

  // Add tests for swaps that set up combos
  describe('Combos', function() {
    it('should detect multiple matches after a swap', function() {
      game.grid = [
        ["🍒", "🍓", "🍊", "🫐"],
        ["🍋", "🍓", "🍓", "🍓"],
        ["🫐", "🍓", "🍊", "🍋"],
        ["🍋", "🍒", "🍓", "🍊"],
      ];
      game.swap(1, 0, 1, 1);
      const matches = Bejeweled.checkForMatches(game.grid);
      expect(matches.length).to.be.greaterThan(1);
    });
  });

  // Add tests to check if there are no possible valid moves
  describe('Game over condition', function() {
    it('should detect when there are no valid moves', function() {
      game.grid = [
        ["🍒", "🍋", "🍊", "🍓", "🫐", "🍇", "🍒", "🍋"],
        ["🍋", "🍊", "🍓", "🫐", "🍇", "🍒", "🍋", "🍊"],
        ["🍊", "🍓", "🫐", "🍇", "🍒", "🍋", "🍊", "🍓"],
        ["🍓", "🫐", "🍇", "🍒", "🍋", "🍊", "🍓", "🫐"],
        ["🫐", "🍇", "🍒", "🍋", "🍊", "🍓", "🫐", "🍇"],
        ["🍇", "🍒", "🍋", "🍊", "🍓", "🫐", "🍇", "🍒"],
        ["🍒", "🍋", "🍊", "🍓", "🫐", "🍇", "🍒", "🍋"],
        ["🍋", "🍊", "🍓", "🫐", "🍇", "🍒", "🍋", "🍊"],
      ];
      expect(game.hasValidMoves()).to.be.false;
    });
  })

});

