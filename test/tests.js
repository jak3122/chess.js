if (typeof require != "undefined") {
  var chai = require('chai');
  var Chess = require('../chess').Chess;
}

var assert = chai.assert;

describe("Single Square Move Generation", function() {

  var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
      square: 'e2', verbose: false, moves: ['e3', 'e4']},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
      square: 'e9', verbose: false, moves: []},  // invalid square
    {fen: 'rnbqk1nr/pppp1ppp/4p3/8/1b1P4/2N5/PPP1PPPP/R1BQKBNR/ w KQkq - 4 3',
      square: 'c3', verbose: false, moves: []},  // pinned piece
    {fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2BPP3/2N2N2/PPP2PPP/R1BQK2R/ b KQkq - 9 5',
        square: 'e5', verbose: false, moves: ['exd4']},  // pawn capture
    {fen: 'r1bqk2r/ppppbppp/2n2n2/8/2BNP3/2N5/PPP2PPP/R1BQK2R/Pp b KQkq - 11 6',
        square: 'c6', verbose: false, moves: ['Ne5', 'Nxd4', 'Nb4', 'Na5', 'Nb8']},
    {fen: 'r1b1kbnr/1PQ1pppp/p1p1b3/8/1P6/P1N4p/2PP1PqP/R1B1K1NR/NPp w KQkq - 24 13',
      square: 'b7', verbose: false, moves: ['bxa8=Q', 'bxa8=R', 'bxa8=B', 'bxa8=N',
                                            'b8=Q', 'b8=R', 'b8=B', 'b8=N',
                                            'bxc8=Q+', 'bxc8=R+', 'bxc8=B', 'bxc8=N']},  // promotion
    {fen: 'r1b1k2r/ppp2ppp/2n2n2/3qP3/1b6/2NQ1N2/PPP2PPP/R1B1KB1R/Ppp b KQkq - 15 8',
      square: 'e8', verbose: false, moves: ['Kf8', 'Ke7', 'Kd7', 'Kd8', 'O-O']},  // castling
    {fen: 'r1b1k1r1/ppp2pPp/2n2P2/3q4/8/2Pp1N2/P1P2PPP/R1B1KB1R/QBPnnp b KQq - 27 14',
      square: 'e8', verbose: false, moves: ['Kd7', 'Kd8']},  // no castling
    {fen: '1r3r2/1pp2pk1/p4q1p/P3B3/2B5/2PP2BP/1P2n1P1/3b1nK1/NPPPqrrppn w - - 58 30',
      square: 'g1', verbose: false, moves: ['Kh1']}
  ];

  positions.forEach(function(position) {
    var chess = new Chess();
    chess.load(position.fen);

    var gen_moves = chess.moves({square: position.square});
    assert.equal(gen_moves.length, position.moves.length);
    gen_moves.forEach(function(move) {
        assert.include(position.moves, move);
    });
    
    /*
    it(position.fen + ' ' + position.square, function() {

      var moves = chess.moves({square: position.square, verbose: position.verbose});
      var passed = position.moves.length == moves.length;

      for (var j = 0; j < moves.length; j++) {
        if (!position.verbose) {
          passed = passed && moves[j] == position.moves[j];
        } else {
          for (var k in moves[j]) {
            passed = passed && moves[j][k] == position.moves[j][k];
          }
        }
      }
      assert(passed);

    });
    */

  });

});

describe("Move generation", function() {

    var chess = new Chess();
    var tests = [
    { fen: '1r3r2/1pp2pk1/p4q1p/P3B3/2B5/2PP2BP/1P2n1P1/3b1nK1/NPPPqrrppn w - - 58 30',
        moves: ['Kh1'] }
    ];
    tests.forEach(function(test) {
        chess.load(test.fen);
        var gen_moves = chess.moves();
        assert.equal(gen_moves.length, test.moves.length);
        test.moves.forEach(function(move) {
            assert.include(gen_moves, move);
        });
    });
});


describe("Checkmate", function() {

  var chess = new Chess();
  var checkmates = [
    '3Nqr2/pBp2p2/1b1p1p1k/4p1p1/1P6/2PP1P2/Pp3PbP/5qK1/NRNrprnb w - - 88 45',
    'r5rk/pp3Npp/8/2p2b2/1p6/7p/PPP1NpBP/R1B2R1K/PPPBPNqnq b - - 51 26',
    'r6k/ppp1bpNp/3p1n1N/4p1n1/2P1P3/2P1bP1q/P3B1pP/R4R1K/PPQrb w - - 56 29',
    'Qnkr3r/nPp1bpp1/p2pP3/1p3PN1/P2P4/2P5/3bB2P/1R3R1K/BNqppp b - - 55 28'
  ];

  checkmates.forEach(function(checkmate) {
    chess.load(checkmate);

    it(checkmate, function() {
      assert(chess.in_checkmate());
    });
  });

});



describe("Stalemate", function() {

  var stalemates = [
    '7k/4Q~3/8/5Q~2/1Q~5P/PPPP1P1P/P1PNRPRP/Q4K2/BBPNPNBRNRBQ b - - 98 77',
    '1rrrkn~2/1pppn~n~n~1/p1p1ppq1/pb1bp2r/1ppp4/4b3/4q3/K7/nbnnn w - - 98 121',
  ];

  stalemates.forEach(function(stalemate) {
    var chess = new Chess();
    chess.load(stalemate);

    it(stalemate, function() {
      assert(chess.in_stalemate())
    });

  });

});


describe("Threefold Repetition", function() {

  var positions = [
    {fen: 'Bn3r2/p1ppqp1k/1p2p2p/7N/KB4P1/1PP4P/P1P1QP2/1rb5/NRBPRPn b - - 63 32',
     moves: ['N@b2', 'Ka3', 'Nc4', 'Ka4', 'Nb2', 'Ka3', 'Nc4', 'Ka4', 'Nb2']},

    /* Fischer - Petrosian, Buenos Aires, 1971 */
    {fen: 'r2q3r/pbpPNkp1/1pp1p1N1/1B2p3/8/5P1p/P1P2P1P/R4RK1/PBBNPqn w - - 58 30',
     moves: ['N@g5', 'Kf6', 'Ne4', 'Kf7', 'Ng5', 'Kf6', 'Ne4', 'Kf7', 'Ng5']},
  ];

  positions.forEach(function(position) {
    var chess = new Chess();
    chess.load(position.fen);

    it(position.fen, function() {

      var passed = true;
      for (var j = 0; j < position.moves.length; j++) {
        if (chess.in_threefold_repetition()) {
          passed = false;
          break;
        }
        chess.move(position.moves[j]);
      }

      assert(passed && chess.in_threefold_repetition() && chess.in_draw());

    });

  });

});


describe("Algebraic Notation", function() {

  var positions = [
    {fen: 'B4r1k/p1p1Npbp/1p2pN1p/6n1/8/1P4PP/P1P1nP1K/R4n~2/RQrbppbq w - - 70 36',
     moves: ['Rxf1', 'Kg2', 'Kh1']},
    {fen: 'r1bqk1nr/pppp1ppp/4p1n1/1N2P3/5P1b/1BN5/PPP3PP/R1BQK2R/P w KQkq - 20 11',
     moves: ['Kd2', 'Ke2', 'Kf1', 'g3', '@g3', '@f2']},
  ];

  positions.forEach(function(position) {
    var chess = new Chess();
    var passed = true;
    chess.load(position.fen);

    it(position.fen, function() {
      var moves = chess.moves();
      console.log(moves);
      if (moves.length != position.moves.length) {
        passed = false;
      } else {
        for (var j = 0; j < moves.length; j++) {
          if (position.moves.indexOf(moves[j]) == -1) {
            passed = false;
            break;
          }
        }
      }
      assert(passed);
    });

  });

});


describe("Get/Put/Remove", function() {

  var chess = new Chess();
  var passed = true;
  var positions = [
    {pieces: {a7: {type: chess.PAWN, color: chess.WHITE},
              b7: {type: chess.PAWN, color: chess.BLACK},
              c7: {type: chess.KNIGHT, color: chess.WHITE},
              d7: {type: chess.KNIGHT, color: chess.BLACK},
              e7: {type: chess.BISHOP, color: chess.WHITE},
              f7: {type: chess.BISHOP, color: chess.BLACK},
              g7: {type: chess.ROOK, color: chess.WHITE},
              h7: {type: chess.ROOK, color: chess.BLACK},
              a6: {type: chess.QUEEN, color: chess.WHITE},
              b6: {type: chess.QUEEN, color: chess.BLACK},
              a4: {type: chess.KING, color: chess.WHITE},
              h4: {type: chess.KING, color: chess.BLACK}},
     should_pass: true},

    {pieces: {a7: {type: 'z', color: chess.WHTIE}}, // bad piece
     should_pass: false},

    {pieces: {j4: {type: chess.PAWN, color: chess.WHTIE}}, // bad square
     should_pass: false},

    /* disallow two kings (black) */
    {pieces: {a7: {type: chess.KING, color: chess.BLACK},
              h2: {type: chess.KING, color: chess.WHITE},
              a8: {type: chess.KING, color: chess.BLACK}},
      should_pass: false},

    /* disallow two kings (white) */
    {pieces: {a7: {type: chess.KING, color: chess.BLACK},
              h2: {type: chess.KING, color: chess.WHITE},
              h1: {type: chess.KING, color: chess.WHITE}},
      should_pass: false},

    /* allow two kings if overwriting the exact same square */
    {pieces: {a7: {type: chess.KING, color: chess.BLACK},
              h2: {type: chess.KING, color: chess.WHITE},
              h2: {type: chess.KING, color: chess.WHITE}},
      should_pass: true},
  ];

  positions.forEach(function(position) {

    passed = true;
    chess.clear();

    it("position should pass - " + position.should_pass, function() {

      /* places the pieces */
      for (var square in position.pieces) {
        passed &= chess.put(position.pieces[square], square);
      }

      /* iterate over every square to make sure get returns the proper
       * piece values/color
       */
      for (var j = 0; j < chess.SQUARES.length; j++) {
        var square = chess.SQUARES[j];
        if (!(square in position.pieces)) {
          if (chess.get(square)) {
            passed = false;
            break;
          }
        } else {
          var piece = chess.get(square);
          if (!(piece &&
              piece.type == position.pieces[square].type &&
              piece.color == position.pieces[square].color)) {
            passed = false;
            break;
          }
        }
      }

      if (passed) {
        /* remove the pieces */
        for (var j = 0; j < chess.SQUARES.length; j++) {
          var square = chess.SQUARES[j];
          var piece = chess.remove(square);
          if ((!(square in position.pieces)) && piece) {
            passed = false;
            break;
          }

          if (piece &&
             (position.pieces[square].type != piece.type ||
              position.pieces[square].color != piece.color)) {
            passed = false;
            break;
          }
        }
      }

      /* finally, check for an empty board */
      passed = passed && (chess.fen() == '8/8/8/8/8/8/8/8 w - - 0 1');

      /* some tests should fail, so make sure we're supposed to pass/fail each
       * test
       */
      passed = (passed == position.should_pass);

      assert(passed);
    });

  });

});


describe("FEN", function() {

  var positions = [
    {fen: '8/8/8/8/8/8/8/8/ w - - 0 1', should_pass: true},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1', should_pass: true},
    {fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e3 0 1', should_pass: true},
    {fen: '1nbqkbn1/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1/ b - - 1 2', should_pass: true},
    {fen: 'r1bqk1nr/pppp1ppp/4p1n1/1N2P3/5P1b/1BN5/PPP3PP/R1BQK2R/P w KQkq - 20 11', should_pass: true},

    /* incomplete FEN string */
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN/ w KQkq - 0 1', should_pass: false},

    /* bad digit (9)*/
    {fen: 'rnbqkbnr/pppppppp/9/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1', should_pass: false},

    /* bad piece (X)*/
    {fen: '1nbqkbn1/pppp1ppX/8/4p3/4P3/8/PPPP1PPP/1NBQKBN1/ b - - 1 2', should_pass: false},
  ];

  positions.forEach(function(position) {
    var chess = new Chess();

    it(position.fen + ' (' + position.should_pass + ')', function() {
      chess.load(position.fen);
      if (position.should_pass)
          assert.equal(chess.fen(), position.fen);
      else
          assert.notEqual(chess.fen(), position.fen);
    });

  });

});


describe("PGN", function() {

  var passed = true;
  var error_message;
  var positions = [
    {moves: ['d4', 'd5', 'Nf3', 'Nc6', 'e3', 'e6', 'Bb5', 'g5', 'O-O', 'Qf6', 'Nc3',
             'Bd7', 'Bxc6', 'Bxc6', 'Re1', 'O-O-O', 'a4', 'Bb4', 'a5', 'b5', 'axb6',
             'axb6', 'Ra8+', 'Kd7', 'Ne5+', 'Kd6', 'Rxd8+', 'Qxd8', 'Nxf7+', 'Ke7',
             'Nxd5+', 'Qxd5', 'c3', 'Kxf7', 'Qf3+', 'Qxf3', 'gxf3', 'Bxf3', 'cxb4',
             'e5', 'dxe5', 'Ke6', 'b3', 'Kxe5', 'Bb2+', 'Ke4', 'Bxh8', 'Nf6', 'Bxf6',
             'h5', 'Bxg5', 'Bg2', 'Kxg2', 'Kf5', 'Bh4', 'Kg4', 'Bg3', 'Kf5', 'e4+',
             'Kg4', 'e5', 'h4', 'Bxh4', 'Kxh4', 'e6', 'c5', 'bxc5', 'bxc5', 'e7', 'c4',
             'bxc4', 'Kg4', 'e8=Q', 'Kf5', 'Qe5+', 'Kg4', 'Re4#'],
     header: ['White', 'Jeff Hlywa', 'Black', 'Steve Bragg', 'GreatestGameEverPlayed?', 'True'],
     max_width:19,
     newline_char:"<br />",
     pgn: '[White "Jeff Hlywa"]<br />[Black "Steve Bragg"]<br />[GreatestGameEverPlayed? "True"]<br /><br />1. d4 d5 2. Nf3 Nc6<br />3. e3 e6 4. Bb5 g5<br />5. O-O Qf6<br />6. Nc3 Bd7<br />7. Bxc6 Bxc6<br />8. Re1 O-O-O<br />9. a4 Bb4 10. a5 b5<br />11. axb6 axb6<br />12. Ra8+ Kd7<br />13. Ne5+ Kd6<br />14. Rxd8+ Qxd8<br />15. Nxf7+ Ke7<br />16. Nxd5+ Qxd5<br />17. c3 Kxf7<br />18. Qf3+ Qxf3<br />19. gxf3 Bxf3<br />20. cxb4 e5<br />21. dxe5 Ke6<br />22. b3 Kxe5<br />23. Bb2+ Ke4<br />24. Bxh8 Nf6<br />25. Bxf6 h5<br />26. Bxg5 Bg2<br />27. Kxg2 Kf5<br />28. Bh4 Kg4<br />29. Bg3 Kf5<br />30. e4+ Kg4<br />31. e5 h4<br />32. Bxh4 Kxh4<br />33. e6 c5<br />34. bxc5 bxc5<br />35. e7 c4<br />36. bxc4 Kg4<br />37. e8=Q Kf5<br />38. Qe5+ Kg4<br />39. Re4#',
     fen: '8/8/8/4Q3/2P1R1k1/8/5PKP/8 b - - 4 39'},
    ];

  positions.forEach(function(position, i) {

    it(i, function() {
      var chess = ("starting_position" in position) ? new Chess(position.starting_position) : new Chess();
      passed = true;
      error_message = "";
      for (var j = 0; j < position.moves.length; j++) {
        if (chess.move(position.moves[j]) === null) {
          error_message = "move() did not accept " + position.moves[j] + " : ";
          break;
        }
      }

      chess.header.apply(null, position.header);
      var pgn = chess.pgn({max_width:position.max_width, newline_char:position.newline_char});
      var fen = chess.fen();
      passed = pgn === position.pgn && fen === position.fen;
      assert(passed && error_message.length == 0);
    });

  });

});


describe("Load PGN", function() {

  var chess = new Chess();
  var tests = [
     {pgn: [
       '[Event "Reykjavik WCh"]',
       '[Site "Reykjavik WCh"]',
       '[Date "1972.01.07"]',
       '[EventDate "?"]',
       '[Round "6"]',
       '[Result "1-0"]',
       '[White "Robert James Fischer"]',
       '[Black "Boris Spassky"]',
       '[ECO "D59"]',
       '[WhiteElo "?"]',
       '[BlackElo "?"]',
       '[PlyCount "81"]',
       '',
       '1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6',
       '7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6',
       '12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7',
       '17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7',
       '22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5',
       '27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7',
       '32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8',
       '37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0'],
       expect: true
      },
  ];

  var newline_chars = ['\n', '<br />', '\r\n', 'BLAH'];

  tests.forEach(function(t, i) {
    newline_chars.forEach(function(newline, j) {
      it(i + String.fromCharCode(97 + j), function() {
        var sloppy = t.sloppy || false;
        var result = chess.load_pgn(t.pgn.join(newline), {sloppy: sloppy,
                                                          newline_char: newline});
        var should_pass = t.expect;

        /* some tests are expected to fail */
        if (should_pass) {

        /* some PGN's tests contain comments which are stripped during parsing,
         * so we'll need compare the results of the load against a FEN string
         * (instead of the reconstructed PGN [e.g. test.pgn.join(newline)])
         */
          if ('fen' in t) {
            assert(result && chess.fen() == t.fen);
          } else {
            assert(result && chess.pgn({ max_width: 65, newline_char: newline }) == t.pgn.join(newline));
          }

        } else {
          /* this test should fail, so make sure it does */
          assert(result == should_pass);
        }
      });

    });

  });

  // special case dirty file containing a mix of \n and \r\n
  it('dirty pgn', function() {
    var pgn =
         '[Event "Reykjavik WCh"]\n' +
         '[Site "Reykjavik WCh"]\n' +
         '[Date "1972.01.07"]\n' +
         '[EventDate "?"]\n' +
         '[Round "6"]\n' +
         '[Result "1-0"]\n' +
         '[White "Robert James Fischer"]\r\n' +
         '[Black "Boris Spassky"]\n' +
         '[ECO "D59"]\n' +
         '[WhiteElo "?"]\n' +
         '[BlackElo "?"]\n' +
         '[PlyCount "81"]\n' +
         '\r\n' +
         '1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6\n' +
         '7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6\n' +
         '12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7\n' +
         '17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7\r\n' +
         '22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5\n' +
         '27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7\n' +
         '32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8\n' +
         '37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0\n';

    var result = chess.load_pgn(pgn, { newline_char: '\r?\n' });
    assert(result);

    assert(chess.load_pgn(pgn));
    assert(chess.pgn().match(/^\[\[/) === null);
  });

});


describe("Make Move", function() {

  var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
     legal: true,
     move: 'e4',
     next: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e3 0 1'},
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
     legal: false,
     move: 'e5'},
  ];

  positions.forEach(function(position) {
    var chess = new Chess();
    chess.load(position.fen);
    it(position.fen + ' (' + position.move + ' ' + position.legal + ')', function() {
      var sloppy = position.sloppy || false;
      var result = chess.move(position.move, {sloppy: sloppy});
      if (position.legal) {
        assert(result
               && chess.fen() == position.next
               && result.captured == position.captured);
      } else {
        assert(!result);
      }
    });

  });

});


describe("Validate FEN", function() {

  var chess = new Chess();
  var positions = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNRw KQkq - 0 1',   error_number: 1},
  ];

  positions.forEach(function(position) {

    it(position.fen + ' (valid: ' + (position.error_number  == 0) + ')', function() {
      var result = chess.validate_fen(position.fen);
      assert(result.error_number == position.error_number, result.error_number);
    });

  });
});

describe("History", function() {

  var chess = new Chess();
  var tests = [
     {verbose: false,
      fen: '4q2k/2r1r3/4PR1p/p1p5/P1Bp1Q1P/1P6/6P1/6K1 b - - 4 41',
      moves: ['c4', 'e6', 'Nf3', 'd5', 'd4', 'Nf6', 'Nc3', 'Be7', 'Bg5', 'O-O', 'e3', 'h6',
              'Bh4', 'b6', 'cxd5', 'Nxd5', 'Bxe7', 'Qxe7', 'Nxd5', 'exd5', 'Rc1', 'Be6',
              'Qa4', 'c5', 'Qa3', 'Rc8', 'Bb5', 'a6', 'dxc5', 'bxc5', 'O-O', 'Ra7',
              'Be2', 'Nd7', 'Nd4', 'Qf8', 'Nxe6', 'fxe6', 'e4', 'd4', 'f4', 'Qe7',
              'e5', 'Rb8', 'Bc4', 'Kh8', 'Qh3', 'Nf8', 'b3', 'a5', 'f5', 'exf5',
              'Rxf5', 'Nh7', 'Rcf1', 'Qd8', 'Qg3', 'Re7', 'h4', 'Rbb7', 'e6', 'Rbc7',
              'Qe5', 'Qe8', 'a4', 'Qd8', 'R1f2', 'Qe8', 'R2f3', 'Qd8', 'Bd3', 'Qe8',
              'Qe4', 'Nf6', 'Rxf6', 'gxf6', 'Rxf6', 'Kg8', 'Bc4', 'Kh8', 'Qf4']},
  ];

  tests.forEach(function(t, i) {
    var passed = true;

    it(i, function() {
      chess.reset();

      for (var j = 0; j < t.moves.length; j++) {
        chess.move(t.moves[j])
      }

      var history = chess.history({verbose: t.verbose});
      if (t.fen != chess.fen()) {
        passed = false;
      } else if (history.length != t.moves.length) {
        passed = false;
      } else {
        for (var j = 0; j < t.moves.length; j++) {
          if (!t.verbose) {
            if (history[j] != t.moves[j]) {
              passed = false;
              break;
            }
          } else {
            for (var key in history[j]) {
              if (history[j][key] != t.moves[j][key]) {
                passed = false;
                break;
              }
            }
          }
        }
      }
      assert(passed);
    });

  });
});

describe('Board Tests', function() {

  var tests = [
    {fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
      board: [[{type: 'r', color: 'b'},
               {type: 'n', color: 'b'},
               {type: 'b', color: 'b'},
               {type: 'q', color: 'b'},
               {type: 'k', color: 'b'},
               {type: 'b', color: 'b'},
               {type: 'n', color: 'b'},
               {type: 'r', color: 'b'}],
              [{type: 'p', color: 'b'},
               {type: 'p', color: 'b'},
               {type: 'p', color: 'b'},
               {type: 'p', color: 'b'},
               {type: 'p', color: 'b'},
               {type: 'p', color: 'b'},
               {type: 'p', color: 'b'},
               {type: 'p', color: 'b'}],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null],
              [{type: 'p', color: 'w'},
               {type: 'p', color: 'w'},
               {type: 'p', color: 'w'},
               {type: 'p', color: 'w'},
               {type: 'p', color: 'w'},
               {type: 'p', color: 'w'},
               {type: 'p', color: 'w'},
               {type: 'p', color: 'w'}],
              [{type: 'r', color: 'w'},
               {type: 'n', color: 'w'},
               {type: 'b', color: 'w'},
               {type: 'q', color: 'w'},
               {type: 'k', color: 'w'},
               {type: 'b', color: 'w'},
               {type: 'n', color: 'w'},
               {type: 'r', color: 'w'}]]},
  ];


  tests.forEach(function(test) {
    it('Board - ' + test.fen, function() {
      var chess = new Chess(test.fen);
      assert(JSON.stringify(chess.board()) === JSON.stringify(test.board));
    })
  })
});



