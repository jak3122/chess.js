/*
 * Copyright (c) 2017, Joe Ksiazek (jak3122@rit.edu)
 * All rights reserved.
 *
 * Copyright (c) 2017, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

/* minified license below  */

/* @license
 * Copyright (c) 2017, Joe Ksiazek (jak3122@rit.edu)
 * Copyright (c) 2017, Jeff Hlywa (jhlywa@gmail.com)
 * Released under the BSD license
 * https://github.com/jak3122/crazyhouse.js/blob/master/LICENSE
 */

var Crazyhouse = function(options) {
    /* jshint indent: false */

    var BLACK = 'b';
    var WHITE = 'w';

    var EMPTY = -1;

    var PAWN = 'p';
    var KNIGHT = 'n';
    var BISHOP = 'b';
    var ROOK = 'r';
    var QUEEN = 'q';
    var KING = 'k';

    var SYMBOLS = 'pnbrqkPNBRQK';

    var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1';

    var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

    var PAWN_OFFSETS = {
        b: [16, 32, 17, 15],
        w: [-16, -32, -17, -15]
    };

    var PIECE_OFFSETS = {
        n: [-18, -33, -31, -14,  18, 33, 31,  14],
        b: [-17, -15,  17,  15],
        r: [-16,   1,  16,  -1],
        q: [-17, -16, -15,   1,  17, 16, 15,  -1],
        k: [-17, -16, -15,   1,  17, 16, 15,  -1]
    };

    var ATTACKS = [
        20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
        0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
        0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
        0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
        0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
        0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
        0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
        0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
        0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
        20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
    ];

    var RAYS = [
        17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
        0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
        0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
        0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
        0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
        1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
        0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
        0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
        0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
        0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
        -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
    ];

    var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

    var FLAGS = {
        NORMAL: 'n',
        CAPTURE: 'c',
        BIG_PAWN: 'b',
        EP_CAPTURE: 'e',
        PROMOTION: 'p',
        KSIDE_CASTLE: 'k',
        QSIDE_CASTLE: 'q'
    };

    var BITS = {
        NORMAL: 1,
        CAPTURE: 2,
        BIG_PAWN: 4,
        EP_CAPTURE: 8,
        PROMOTION: 16,
        KSIDE_CASTLE: 32,
        QSIDE_CASTLE: 64
    };

    var RANK_1 = 7;
    var RANK_2 = 6;
    var RANK_3 = 5;
    var RANK_4 = 4;
    var RANK_5 = 3;
    var RANK_6 = 2;
    var RANK_7 = 1;
    var RANK_8 = 0;

    var SQUARES = {
        a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
        a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
        a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
        a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
        a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
        a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
        a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
        a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };

    var HAND = 200;

    var ROOKS = {
        w: [{square: EMPTY, flag: 0},
        {square: EMPTY, flag: 0}],
        b: [{square: EMPTY, flag: 0},
        {square: EMPTY, flag: 0}]
    };

    var board = new Array(128);
    var kings = {w: EMPTY, b: EMPTY};
    var turn = WHITE;
    var castling = {w: 0, b: 0};
    var castling_file = {w: null, b: null};
    var ep_square = EMPTY;
    var half_moves = 0;
    var move_number = 1;
    var history = [];
    var header = {};
    /* Crazyhouse pieces in hand */
    var zh_hand = {w: [], b: []};
    /* Keep track of which squares contain a dropped pawn; when the piece
     * on that square moves, update the square; when the piece on that
     * square is captured, the captured piece will be a pawn, even if
     * it has been promoted
     */
    var fake_piece_squares = [];

    var start_position_number;
    var mode_960;
    if (typeof options !== "undefined") {
        if (typeof options['960'] !== "undefined") {
            mode_960 = options['960'];
        }
        if (typeof options['position_number'] !== "undefined") {
            start_position_number = options['position_number'];
        }
    } else {
        mode_960 = false;
    }

    if (mode_960) {
        new_960(start_position_number);
    } else {
        load(DEFAULT_POSITION);
    }

    function clear() {
        board = new Array(128);
        kings = {w: EMPTY, b: EMPTY};
        turn = WHITE;
        castling = {w: 0, b: 0};
        castling_file = {w: null, b: null};
        ROOKS = {
            w: [{square: EMPTY, flag: 0},
            {square: EMPTY, flag: 0}],
            b: [{square: EMPTY, flag: 0},
            {square: EMPTY, flag: 0}]
        };
        ep_square = EMPTY;
        half_moves = 0;
        move_number = 1;
        history = [];
        header = {};
        zh_hand = {w: [], b: []};
        fake_piece_squares = [];
        update_setup(generate_fen());
    }

    function reset() {
        load(DEFAULT_POSITION);
    }

    function load(fen) {
        var tokens = fen.split(/\s+/);
        var position = tokens[0];
        var square = 0;
        var slash_count = 0;
        var parsing_hand = false;  // flag to start parsing the crazyhouse hand at end of position string

        var v = validate_fen(fen);
        if (!v.valid) {
            return false;
        }

        clear();

        for (var i = 0; i < position.length; i++) {
            var piece = position.charAt(i);

            if (parsing_hand) {
                var color = (piece < 'a') ? WHITE : BLACK;
                put_in_hand({type: piece.toLowerCase(), color: color});
            } else {
                if (piece === '/') {
                    slash_count++;
                    if (slash_count === 8) {
                        parsing_hand = true;
                        continue;
                    }
                    square += 8;
                } else if (is_digit(piece)) {
                    square += parseInt(piece, 10);
                } else if (piece === '~') {
                    // tilde ~ indicates a fake piece (one that will be converted
                    // to a pawn once captured). e.g. N~ is a fake white knight.
                    fake_piece_squares.push(square - 1);
                } else {
                    var color = (piece < 'a') ? WHITE : BLACK;
                    put({type: piece.toLowerCase(), color: color}, algebraic(square));
                    square++;
                }
            }
        }

        // set the original squares for the rooks
        // (for a 960 start position they will be 
        // different than normal. if the rook has
        // been moved from its original square
        // then this will just be ignored when
        // checking if castling is enabled.)
        for (var i = SQUARES.a8; i <= SQUARES.h8; i++) {
            if (board[i] && board[i].type == ROOK) {
                if (ROOKS.b[0].square == EMPTY) {
                    ROOKS.b[0].square = i;
                } else {
                    ROOKS.b[1].square = i;
                }
            }
        }
        for (var i = SQUARES.a1; i <= SQUARES.h1; i++) {
            if (board[i] && board[i].type == ROOK) {
                if (ROOKS.w[0].square == EMPTY) {
                    ROOKS.w[0].square = i;
                } else {
                    ROOKS.w[1].square = i;
                }
            }
        }

        // Reverse the order of the pieces in hand, since
        // the last piece added to hand goes first in the FEN.
        zh_hand[WHITE].reverse();
        zh_hand[BLACK].reverse();

        turn = tokens[1];

        var castling_white = tokens[2].match(/([ABCDEFGH])/);
        if (castling_white) {
            castling_file.w = letter_to_file(castling_white[1]);
            if (file(board[kings.w]) > castling_file.w) {
                // queen-side
                castling.w |= BITS.QSIDE_CASTLE;
                set_castling_rook(to_square(1, castling_white[1]), BITS.QSIDE_CASTLE, WHITE);
            } else {
                // king-side
                castling.w |= BITS.KSIDE_CASTLE;
                set_castling_rook(to_square(1, castling_white[1]), BITS.KSIDE_CASTLE, WHITE);
            }
        }
        var castling_black = tokens[2].match(/([abcdefgh])/);
        if (castling_black) {
            castling_file.b = letter_to_file(castling_black[1]);
            if (file(board[kings.b]) > castling_file.b) {
                // queen-side
                castling.b |= BITS.QSIDE_CASTLE;
                set_castling_rook(to_square(8, castling_black[1]), BITS.QSIDE_CASTLE, BLACK);
            } else {
                // king-side
                castling.b |= BITS.KSIDE_CASTLE;
                set_castling_rook(to_square(8, castling_black[1]), BITS.KSIDE_CASTLE, BLACK);
            }
        }

        if (tokens[2].indexOf('K') > -1) {
            castling.w |= BITS.KSIDE_CASTLE;
            set_default_castling_rook(BITS.KSIDE_CASTLE, WHITE);
        }
        if (tokens[2].indexOf('Q') > -1) {
            castling.w |= BITS.QSIDE_CASTLE;
            set_default_castling_rook(BITS.QSIDE_CASTLE, WHITE);
        }
        if (tokens[2].indexOf('k') > -1) {
            castling.b |= BITS.KSIDE_CASTLE;
            set_default_castling_rook(BITS.KSIDE_CASTLE, BLACK);
        }
        if (tokens[2].indexOf('q') > -1) {
            castling.b |= BITS.QSIDE_CASTLE;
            set_default_castling_rook(BITS.QSIDE_CASTLE, BLACK);
        }

        ep_square = (tokens[3] === '-') ? EMPTY : SQUARES[tokens[3]];
        half_moves = parseInt(tokens[4], 10);
        move_number = parseInt(tokens[5], 10);

        update_setup(generate_fen());

        return true;
    }

    function set_castling_rook(square, direction, side) {
        for (var i = 0; i < ROOKS[side].length; i++) {
            var r = ROOKS[side][i];
            if (r.square == square) {
                ROOKS[side][i].flag = direction;
            }
        }
    }

    function update_rook_square(old_square, new_square, side) {
        for (var i = 0; i < ROOKS[side].length; i++) {
            if (ROOKS[side][i].square == old_square) {
                ROOKS[side][i].square = new_square;
            }
        }
    }

    function rooks_to_str(rooks) {
        var s = '';
        s += '[W rooks: ';
        s += algebraic(rooks.w[0].square)+'('+castling_flag_to_str(rooks.w[0].flag)+')';
        s += ', ';
        s += algebraic(rooks.w[1].square)+'('+castling_flag_to_str(rooks.w[1].flag)+')';
        s += '][B rooks: ';
        s += algebraic(rooks.b[0].square)+'('+castling_flag_to_str(rooks.b[0].flag)+')';
        s += ', ';
        s += algebraic(rooks.b[1].square)+'('+castling_flag_to_str(rooks.b[1].flag)+')';
        s += ']';
        return s;
    }

    function castling_flag_to_str(flag) {
        if (flag & BITS.KSIDE_CASTLE)
            return 'k';
        if (flag & BITS.QSIDE_CASTLE)
            return 'q';
        return '';
    }

    /* The default castling rook is the outermost rook
     * in the specified direction, e.g. the default rook
     * for black castling kingside is the rook on the 8th
     * rank nearest the h-file.
     */
    function set_default_castling_rook(direction, side) {
        if (side === WHITE) {
            if (direction & BITS.KSIDE_CASTLE) {
                for (var i = SQUARES.h1; i >= SQUARES.b1; i--) {
                    if (board[i] && board[i].type == ROOK) {
                        set_castling_rook(i, BITS.KSIDE_CASTLE, side);
                        break;
                    }
                }
            } else if (direction & BITS.QSIDE_CASTLE) {
                for (var i = SQUARES.a1; i <= SQUARES.g1; i++) {
                    if (board[i] && board[i].type == ROOK) {
                        set_castling_rook(i, BITS.QSIDE_CASTLE, side);
                        break;
                    }
                }
            }
        } else if (side === BLACK) {
            if (direction & BITS.KSIDE_CASTLE) {
                for (var i = SQUARES.h8; i >= SQUARES.b8; i--) {
                    if (board[i] && board[i].type == ROOK) {
                        set_castling_rook(i, BITS.KSIDE_CASTLE, side);
                        break;
                    }
                }
            } else if (direction & BITS.QSIDE_CASTLE) {
                for (var i = SQUARES.a8; i <= SQUARES.g8; i++) {
                    if (board[i] && board[i].type == ROOK) {
                        set_castling_rook(i, BITS.QSIDE_CASTLE, side);
                        break;
                    }
                }
            }
        }
    }

    /* TODO: this function is pretty much crap - it validates structure but
     * completely ignores content (e.g. doesn't verify that each side has a king)
     * ... we should rewrite this, and ditch the silly error_number field while
     * we're at it
     */
    function validate_fen(fen) {
        var errors = {
            0: 'No errors.',
            1: 'FEN string must contain six space-delimited fields.',
            2: '6th field (move number) must be a positive integer.',
            3: '5th field (half move counter) must be a non-negative integer.',
            4: '4th field (en-passant square) is invalid.',
            5: '3rd field (castling availability) is invalid.',
            6: '2nd field (side to move) is invalid.',
            7: '1st field (piece positions) does not contain 9 \'/\'-delimited rows.',
            8: '1st field (piece positions) is invalid [consecutive numbers].',
            9: '1st field (piece positions) is invalid [invalid piece].',
            10: '1st field (piece positions) is invalid [row too large].',
            11: 'Illegal en-passant square',
            12: 'Fake piece indicator (~) does not follow a piece value.'
        };

        /* 1st criterion: 6 space-seperated fields? */
        var tokens = fen.split(/\s+/);
        if (tokens.length !== 6) {
            return {valid: false, error_number: 1, error: errors[1]};
        }

        /* 2nd criterion: move number field is a integer value > 0? */
        if (isNaN(tokens[5]) || (parseInt(tokens[5], 10) <= 0)) {
            return {valid: false, error_number: 2, error: errors[2]};
        }

        /* 3rd criterion: half move counter is an integer >= 0? */
        if (isNaN(tokens[4]) || (parseInt(tokens[4], 10) < 0)) {
            return {valid: false, error_number: 3, error: errors[3]};
        }

        /* 4th criterion: 4th field is a valid e.p.-string? */
        if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
            return {valid: false, error_number: 4, error: errors[4]};
        }

        /* 5th criterion: 3th field is a valid castle-string? */
        //if( !/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
        if( !/^(((KQ?)|(Q)|[A-H])?((kq?)|(q)|[a-h])?)|-$/.test(tokens[2])) {
            return {valid: false, error_number: 5, error: errors[5]};
        }

        /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
        if (!/^(w|b)$/.test(tokens[1])) {
            return {valid: false, error_number: 6, error: errors[6]};
        }

        /* 7th criterion: 1st field contains 8 rows? */
        var rows = tokens[0].split('/');
        if (rows.length !== 9) {
            return {valid: false, error_number: 7, error: errors[7]};
        }

        /* 8th criterion: every row is valid? */
        for (var i = 0; i < 8; i++) {
            /* check for right sum of fields AND not two numbers in succession */
            var sum_fields = 0;
            var previous_was_number = false;
            var previous_was_letter = false;

            for (var k = 0; k < rows[i].length; k++) {
                if (!isNaN(rows[i][k])) {
                    if (previous_was_number) {
                        return {valid: false, error_number: 8, error: errors[8]};
                    }
                    sum_fields += parseInt(rows[i][k], 10);
                    previous_was_number = true;
                    previous_was_letter = false;
                } else if (rows[i][k] === '~') {
                    if (!previous_was_letter) {
                        return {valid: false, error_number: 12, error: errors[12]};
                    }
                } else {
                    if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                        return {valid: false, error_number: 9, error: errors[9]};
                    }
                    sum_fields += 1;
                    previous_was_number = false;
                    previous_was_letter = true;
                }
            }
            if (sum_fields !== 8) {
                return {valid: false, error_number: 10, error: errors[10]};
            }
        }

        if ((tokens[3][1] === '3' && tokens[1] === 'w') ||
                (tokens[3][1] === '6' && tokens[1] === 'b')) {
            return {valid: false, error_number: 11, error: errors[11]};
        }

        /* everything's okay! */
        return {valid: true, error_number: 0, error: errors[0]};
    }

    function generate_fen() {
        var empty = 0;
        var fen = '';

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            if (board[i] == null) {
                empty++;
            } else {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                var color = board[i].color;
                var piece = board[i].type;

                fen += (color === WHITE) ?
                    piece.toUpperCase() : piece.toLowerCase();
                if (fake_piece_squares.includes(i) && board[i].type !== PAWN) {
                    // tilde ~ is used to indicate a fake piece
                    fen += '~';
                }
            }

            if ((i + 1) & 0x88) {
                if (empty > 0) {
                    fen += empty;
                }

                if (i !== SQUARES.h1) {
                    fen += '/';
                }

                empty = 0;
                i += 8;
            }
        }
        /* crazyhouse hand */
        fen += '/';
        var w_hand = zh_hand[WHITE];
        var b_hand = zh_hand[BLACK];
        /* add white first, in reverse order of capturing */
        for (i = w_hand.length-1; i >= 0; i--) {
            fen += w_hand[i].type.toUpperCase();
        }
        for (i = b_hand.length-1; i >= 0; i--) {
            fen += b_hand[i].type.toLowerCase();
        }

        var cflags = '';
        if (castling_file[WHITE]) {
            cflags += file_to_letter(castling_file[WHITE]).toUpperCase();
        } else {
            if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; }
            if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; }
        }
        if (castling_file[BLACK]) {
            cflags += file_to_letter(castling_file[BLACK]);
        } else {
            if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; }
            if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; }
        }

        /* do we have an empty castling flag? */
        cflags = cflags || '-';
        var epflags = (ep_square === EMPTY) ? '-' : algebraic(ep_square);

        return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
    }

    function set_header(args) {
        for (var i = 0; i < args.length; i += 2) {
            if (typeof args[i] === 'string' &&
                    typeof args[i + 1] === 'string') {
                header[args[i]] = args[i + 1];
            }
        }
        return header;
    }

    /* called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object.  if the FEN is
     * equal to the default position, the SetUp and FEN are deleted
     * the setup is only updated if history.length is zero, ie moves haven't been
     * made.
     */
    function update_setup(fen) {
        if (history.length > 0) return;

        if (fen !== DEFAULT_POSITION) {
            header['SetUp'] = '1';
            header['FEN'] = fen;
        } else {
            delete header['SetUp'];
            delete header['FEN'];
        }
    }

    function get(square) {
        var piece = board[SQUARES[square]];
        return (piece) ? {type: piece.type, color: piece.color} : null;
    }

    function put(piece, square) {
        /* check for valid piece object */
        if (!('type' in piece && 'color' in piece)) {
            return false;
        }

        /* check for piece */
        if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
            return false;
        }

        /* check for valid square */
        if (!(square in SQUARES)) {
            return false;
        }

        var sq = SQUARES[square];

        /* don't let the user place more than one king */
        if (piece.type === KING &&
                !(kings[piece.color] === EMPTY || kings[piece.color] == sq)) {
            return false;
        }

        board[sq] = {type: piece.type, color: piece.color};
        if (piece.type === KING) {
            kings[piece.color] = sq;
        }

        update_setup(generate_fen());

        return true;
    }

    function remove(square) {
        var piece = get(square);
        board[SQUARES[square]] = null;
        if (piece && piece.type === KING) {
            kings[piece.color] = EMPTY;
        }

        update_setup(generate_fen());

        return piece;
    }

    function put_in_hand(piece) {
        /* check for valid piece object */
        if (!('type' in piece && 'color' in piece)) {
            return false;
        }

        /* check for piece */
        if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
            return false;
        }

        /* can't put a king in hand */
        if (piece.type == KING) {
            return false;
        }

        /* add to hand */
        zh_hand[piece.color].push(piece);

        update_setup(generate_fen());

        return true;
    }

    function remove_from_hand(piece) {
        var hand = zh_hand[piece.color];
        for (var i = hand.length-1; i >= 0; i--) {
            if (hand[i].type === piece.type && hand[i].color === piece.color) {
                zh_hand[piece.color].splice(i, 1);
                break;
            }
        }
        update_setup(generate_fen());

        return piece;

    }

    function build_move(board, from, to, flags, promotion) {
        var move = {
            color: turn,
            from: from,
            to: to,
            flags: flags,
            piece: board[from].type
        };

        if (promotion) {
            move.flags |= BITS.PROMOTION;
            move.promotion = promotion;
        }

        if (board[to]) {
            move.captured = board[to].type;
        } else if (flags & BITS.EP_CAPTURE) {
            move.captured = PAWN;
        }
        return move;
    }

    function build_drop_move(to, type) {
        var move = {
            color: turn,
            to: to,
            from: HAND,
            piece: type
        };
        return move;
    }

    function generate_moves(options) {
        function add_move(board, moves, from, to, flags) {
            /* if pawn promotion */
            if (board[from].type === PAWN &&
                    (rank(to) === RANK_8 || rank(to) === RANK_1)) {
                var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
                for (var i = 0, len = pieces.length; i < len; i++) {
                    moves.push(build_move(board, from, to, flags, pieces[i]));
                }
            } else {
                moves.push(build_move(board, from, to, flags));
            }
        }
        function add_drop_move(moves, to, type) {
            moves.push(build_drop_move(to, type));
        }
        var moves = [];
        var us = turn;
        var them = swap_color(us);
        var second_rank = {b: RANK_7, w: RANK_2};

        var first_sq = SQUARES.a8;
        var last_sq = SQUARES.h1;
        var single_square = false;

        /* do we want legal moves? */
        var legal = (typeof options !== 'undefined' && 'legal' in options) ?
            options.legal : true;

        /* are we generating moves for a single square? */
        if (typeof options !== 'undefined' && 'square' in options) {
            if (options.square in SQUARES) {
                first_sq = last_sq = SQUARES[options.square];
                single_square = true;
            } else {
                /* invalid square */
                return [];
            }
        }

        for (var i = first_sq; i <= last_sq; i++) {
            /* did we run off the end of the board */
            if (i & 0x88) { i += 7; continue; }

            var piece = board[i];
            if (piece == null || piece.color !== us) {
                continue;
            }

            if (piece.type === PAWN) {
                /* single square, non-capturing */
                var square = i + PAWN_OFFSETS[us][0];
                if (board[square] == null) {
                    add_move(board, moves, i, square, BITS.NORMAL);

                    /* double square */
                    var square = i + PAWN_OFFSETS[us][1];
                    if (second_rank[us] === rank(i) && board[square] == null) {
                        add_move(board, moves, i, square, BITS.BIG_PAWN);
                    }
                }

                /* pawn captures */
                for (j = 2; j < 4; j++) {
                    var square = i + PAWN_OFFSETS[us][j];
                    if (square & 0x88) continue;

                    if (board[square] != null &&
                            board[square].color === them) {
                        add_move(board, moves, i, square, BITS.CAPTURE);
                    } else if (square === ep_square) {
                        add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
                    }
                }
            } else {
                for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
                    var offset = PIECE_OFFSETS[piece.type][j];
                    var square = i;

                    while (true) {
                        square += offset;
                        if (square & 0x88) break;

                        if (board[square] == null) {
                            add_move(board, moves, i, square, BITS.NORMAL);
                        } else {
                            if (board[square].color === us) break;
                            add_move(board, moves, i, square, BITS.CAPTURE);
                            break;
                        }

                        /* break, if knight or king */
                        if (piece.type === 'n' || piece.type === 'k') break;
                    }
                }
            }
        }


        /* Generate crazyhouse drop moves.
         * Skip this for single square move generation.
         * Only generate one move per piece type, otherwise
         * we end up with duplicate moves.
         */
        if (!single_square) {
            var hand = zh_hand[us];
            var our_hand_types = [];
            hand.forEach(function(p) {
                if (!our_hand_types.includes(p.type)) {
                    our_hand_types.push(p.type);
                }
            });
            our_hand_types.forEach(function(piece) {
                for (var i = first_sq; i <= last_sq; i++) {
                    /* did we run off the end of the board */
                    if (i & 0x88) { i += 7; continue; }
                    var cant_drop_pawn = (rank(i) === RANK_1) || (rank(i) === RANK_8);
                    if (piece == PAWN && cant_drop_pawn) {
                        continue;
                    }
                    if (board[i] == null) {
                        add_drop_move(moves, i, piece);
                    }
                }
            });
        }

        /* check for castling if: a) we're generating all moves, or b) we're doing
         * single square move generation on the king's square
         */
        if ((!single_square) || last_sq === kings[us]) {
            /* king-side castling */
            if (castling[us] & BITS.KSIDE_CASTLE) {
                var castling_from = kings[us];
                var castling_to;
                if (mode_960) {
                    castling_to = get_960_castling_square(BITS.KSIDE_CASTLE, us);
                } else {
                    castling_to = us === WHITE ? SQUARES.g1 : SQUARES.g8;
                }
                var clear = castling_legal(castling_from, castling_to, BITS.KSIDE_CASTLE, us);
                if (clear) {
                    add_move(board, moves, kings[us] , castling_to,
                            BITS.KSIDE_CASTLE);
                }
            }

            /* queen-side castling */
            if (castling[us] & BITS.QSIDE_CASTLE) {
                var castling_from = kings[us];
                var castling_to;
                if (mode_960) {
                    castling_to = get_960_castling_square(BITS.QSIDE_CASTLE, us);
                } else {
                    castling_to = us === WHITE ? SQUARES.c1 : SQUARES.c8;
                }
                var clear = castling_legal(castling_from, castling_to, BITS.QSIDE_CASTLE, us);
                if (clear) {
                    add_move(board, moves, kings[us], castling_to,
                            BITS.QSIDE_CASTLE);
                }
            }
        }

        /* return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */
        if (!legal) {
            return moves;
        }

        /* filter out illegal moves */
        var legal_moves = [];
        for (var i = 0, len = moves.length; i < len; i++) {
            make_move(moves[i]);
            if (!king_attacked(us)) {
                legal_moves.push(moves[i]);
            }
            undo_move();
        }
        return legal_moves;
    }

    function get_960_castling_square(direction, side) {
        if (castling_file[side]) {
            var c_rank = side === WHITE ? '1' : '8';
            var c_file = castling_file[side];
            return to_square(c_rank, c_file);
        } else {
            for (var i = 0; i < ROOKS[side].length; i++) {
                if (ROOKS[side][i].flag & direction) {
                    return ROOKS[side][i].square;
                }
            }
        }
    }

    // check if the rook on a specified square has the
    // specified castling flag (direction)
    function rook_can_castle(square, direction, side) {
        var ok = false;
        for (var i = 0; i < ROOKS[side].length; i++) {
            if (ROOKS[side][i].square == square
                    && (ROOKS[side][i].flag & direction)) {
                ok = true;
                break;
            }
        }
        return ok;
    }

    function get_rook_castling_flag(square, side) {
        for (var i = 0; i < ROOKS[side].length; i++) {
            if (ROOKS[side][i].square == square) {
                return ROOKS[side][i].flag;
            }
        }
    }

    function castling_legal(from, to, direction, side) {
        var us = side;
        var them = swap_color(us);
        if (attacked(them, kings[us]))
            return false;
        if (mode_960) {
            // in 960 you castle by dropping the king onto
            // the rook
            if (!(board[to] && board[to].type == ROOK)) {
                return false;
            }
            // check if this rook has the correct castling flag
            if (!rook_can_castle(to, direction, side)) {
                return false;
            }
            var rook_to, king_to;
            if (direction & BITS.KSIDE_CASTLE) {
                rook_to = us === WHITE ? SQUARES.f1 : SQUARES.f8;
                king_to = us === WHITE ? SQUARES.g1 : SQUARES.g8;
                var left_sq = Math.min(rook_to, from);
                for (var i = left_sq; i <= king_to; i++) {
                    if (!(board[i] == null || board[i].type === KING || i === to)) {
                        return false;
                    }
                }
                for (var i = from; i <= king_to; i++) {
                    if (attacked(them, i)) {
                        return false;
                    }
                }
            } else if (direction & BITS.QSIDE_CASTLE) {
                rook_to = us === WHITE ? SQUARES.d1 : SQUARES.d8;
                king_to = us === WHITE ? SQUARES.c1 : SQUARES.c8;
                if (from <= king_to) {
                    for (var i = to; i <= rook_to; i++) {
                        if (!(board[i] == null || board[i].type === KING || i === to)) {
                            return false;
                        }
                    }
                    for (var i = from; i <= king_to; i++) {
                        if (attacked(them, i)) {
                            return false;
                        }
                    }
                } else {
                    var left_sq = Math.min(king_to, to);
                    for (var i = left_sq; i <= from; i++) {
                        if (!(board[i] == null || board[i].type === KING || i === to)) {
                            return false;
                        }
                    }
                    for (var i = king_to; i <= from; i++) {
                        if (attacked(them, i)) {
                            return false;
                        }
                    }
                }
            }
        } else {
            /* king-side castling */
            if (direction & BITS.KSIDE_CASTLE) {
                if (board[from + 1] == null &&
                        board[to]       == null &&
                        !attacked(them, kings[us]) &&
                        !attacked(them, from + 1) &&
                        !attacked(them, to)) {
                    return true;
                } else {
                    return false;
                }
            }

            /* queen-side castling */
            if (direction & BITS.QSIDE_CASTLE) {
                if (board[from - 1] == null &&
                        board[from - 2] == null &&
                        board[from - 3] == null &&
                        !attacked(them, kings[us]) &&
                        !attacked(them, from - 1) &&
                        !attacked(them, to)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    /* convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} sloppy Use the sloppy SAN generator to work around over
     * disambiguation bugs in Fritz and Chessbase.  See below:
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    function move_to_san(move, sloppy) {

        var output = '';

        if (move.from === HAND) {
            /* Crazyhouse drop move */
            if (move.piece !== PAWN) {
                output += move.piece.toUpperCase();
            }
            output += '@';
            output += algebraic(move.to);
        } else {

            if (move.flags & BITS.KSIDE_CASTLE) {
                output = 'O-O';
            } else if (move.flags & BITS.QSIDE_CASTLE) {
                output = 'O-O-O';
            } else {
                var disambiguator = get_disambiguator(move, sloppy);

                if (move.piece !== PAWN) {
                    output += move.piece.toUpperCase() + disambiguator;
                }

                if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                    if (move.piece === PAWN) {
                        output += algebraic(move.from)[0];
                    }
                    output += 'x';
                }

                output += algebraic(move.to);

                if (move.flags & BITS.PROMOTION) {
                    output += '=' + move.promotion.toUpperCase();
                }
            }
        }

        make_move(move);
        if (in_check()) {
            if (in_checkmate()) {
                output += '#';
            } else {
                output += '+';
            }
        }
        undo_move();

        return output;
    }

    // parses all of the decorators out of a SAN string
    function stripped_san(move) {
        return move
            .replace(/=/,'')
            .replace(/[+#]?[?!]*$/,'')
            .replace(/P@/, '@');
    }

    function attacked(color, square) {
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            /* did we run off the end of the board */
            if (i & 0x88) { i += 7; continue; }

            /* if empty square or wrong color */
            if (board[i] == null || board[i].color !== color) continue;

            var piece = board[i];
            var difference = i - square;
            var index = difference + 119;

            if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
                if (piece.type === PAWN) {
                    if (difference > 0) {
                        if (piece.color === WHITE) return true;
                    } else {
                        if (piece.color === BLACK) return true;
                    }
                    continue;
                }

                /* if the piece is a knight or a king */
                if (piece.type === 'n' || piece.type === 'k') return true;

                var offset = RAYS[index];
                var j = i + offset;

                var blocked = false;
                while (j !== square) {
                    if (board[j] != null) { blocked = true; break; }
                    j += offset;
                }

                if (!blocked) return true;
            }
        }

        return false;
    }

    function king_attacked(color) {
        return attacked(swap_color(color), kings[color]);
    }

    function in_check() {
        return king_attacked(turn);
    }

    function in_checkmate() {
        return in_check() && generate_moves().length === 0;
    }

    function in_stalemate() {
        return !in_check() && generate_moves().length === 0;
    }

    function insufficient_material() {
        // No such thing in crazyhouse :)
        return false;
    }

    function in_threefold_repetition() {
        /* TODO: while this function is fine for casual use, a better
         * implementation would use a Zobrist key (instead of FEN). the
         * Zobrist key would be maintained in the make_move/undo_move functions,
         * avoiding the costly that we do below.
         */
        var moves = [];
        var positions = {};
        var repetition = false;

        while (true) {
            var move = undo_move();
            if (!move) break;
            moves.push(move);
        }

        while (true) {
            /* remove the last two fields in the FEN string, they're not needed
             * when checking for draw by rep */
            var fen = generate_fen().split(' ').slice(0,4).join(' ');

            /* has the position occurred three or move times */
            positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
            if (positions[fen] >= 3) {
                repetition = true;
            }

            if (!moves.length) {
                break;
            }
            make_move(moves.pop());
        }

        return repetition;
    }

    function clone_hand(hand) {
        var hand_clone = {w:[], b:[]};
        hand.w.forEach(function(piece) {
            var new_piece = {color:piece.color, type:piece.type};
            hand_clone.w.push(new_piece);
        });
        hand.b.forEach(function(piece) {
            var new_piece = {color:piece.color, type:piece.type};
            hand_clone.b.push(new_piece);
        });
        return hand_clone;
    }

    function clone_rooks(rooks) {
        var r = {
            w: [ {square: rooks.w[0].square, flag: rooks.w[0].flag},
                 {square: rooks.w[1].square, flag: rooks.w[1].flag} ],
            b: [ {square: rooks.b[0].square, flag: rooks.b[0].flag},
                 {square: rooks.b[1].square, flag: rooks.b[1].flag} ]
        };
        return r;
    }

    function push(move) {
        var hand_clone = clone_hand(zh_hand);
        history.push({
            move: move,
            kings: {b: kings.b, w: kings.w},
            rooks: clone_rooks(ROOKS),
            turn: turn,
            castling: {b: castling.b, w: castling.w},
            ep_square: ep_square,
            half_moves: half_moves,
            move_number: move_number,
            zh_hand: hand_clone,
            fake_piece_squares: fake_piece_squares.slice()
        });
    }

    function make_move(move) {
        var us = turn;
        var them = swap_color(us);
        push(move);

        if (move.from === HAND) {
            /* Crazyhouse drop move */
            var piece = {color: move.color, type: move.piece.toLowerCase()};
            board[move.to] = piece;
            remove_from_hand(piece);
            // Reset en passant square after a drop move
            ep_square = EMPTY;
        } else {
            /* Normal chess move */

            /* Check if captured piece is fake piece (originated as
             * a pawn that was promoted) and add captured
             * piece to our hand
             */
            var captured_type;
            if (board[move.to] && board[move.to].color == them) {
                if (fake_piece_squares.includes(move.to)) {
                    captured_type = PAWN;
                    // stop tracking the pawn while it's in hand
                    fake_piece_squares.splice(fake_piece_squares.indexOf(move.to), 1);
                } else {
                    captured_type = board[move.to] == null ? null : board[move.to].type;
                }
                if (captured_type != null) {
                    put_in_hand({color: us, type: captured_type});
                }
            }

            // Track the fake piece if it moved
            if (fake_piece_squares.includes(move.from)) {
                fake_piece_squares.splice(fake_piece_squares.indexOf(move.from), 1);
                fake_piece_squares.push(move.to);
            }

            /* if we moved the king */
            // do this before making the move on the board
            // to handle king-on-to-rook moves in 960
            if (board[move.from].type === KING) {
                kings[board[move.from].color] = move.to;

                if (mode_960) {
                    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
                        var king_to, rook_to, rook_from, castling_flag;
                        /* if we castled, move the rook next to the king */
                        if (move.flags & BITS.KSIDE_CASTLE) {
                            king_to = us === WHITE ? SQUARES.g1 : SQUARES.g8;
                            rook_to = us === WHITE ? SQUARES.f1 : SQUARES.f8;
                            castling_flag = BITS.KSIDE_CASTLE;
                            rook_from = get_960_castling_square(BITS.KSIDE_CASTLE, us);
                        } else if (move.flags & BITS.QSIDE_CASTLE) {
                            king_to = us === WHITE ? SQUARES.c1 : SQUARES.c8;
                            rook_to = us === WHITE ? SQUARES.d1 : SQUARES.d8;
                            castling_flag = BITS.QSIDE_CASTLE;
                            rook_from = get_960_castling_square(BITS.QSIDE_CASTLE, us);
                        }
                        set_castling_rook(rook_from, 0, us);
                        if (castling_file[us] == file(rook_from)) {
                            castling_file[us] = null;
                        }
                        board[rook_to] = {type: ROOK, color: us};
                        if (rook_to !== rook_from) {
                            board[rook_from] = null;
                        }
                        board[king_to] = {type: KING, color: us};
                        if (move.from !== king_to) {
                            if (board[move.from] && board[move.from].type == KING) {
                                board[move.from] = null;
                            }
                        }
                        kings[us] = king_to;
                    }
                } else {
                    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
                        board[move.to] = board[move.from];
                        board[move.from] = null;
                        if (move.flags & BITS.KSIDE_CASTLE) {
                            var castling_to = move.to - 1;
                            var castling_from = move.to + 1;
                            board[castling_to] = board[castling_from];
                            board[castling_from] = null;
                        } else if (move.flags & BITS.QSIDE_CASTLE) {
                            var castling_to = move.to + 1;
                            var castling_from = move.to - 2;
                            board[castling_to] = board[castling_from];
                            board[castling_from] = null;
                        }
                    }
                }
                /* turn off castling */
                castling_file[us] = null;
                castling[us] = 0;
                set_castling_rook(move.to, 0, us);
            }

            if (!(move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE))) {
                board[move.to] = board[move.from];
                board[move.from] = null;
            }

            /* if ep capture, remove the captured pawn */
            if (move.flags & BITS.EP_CAPTURE) {
                if (turn === BLACK) {
                    board[move.to - 16] = null;
                } else {
                    board[move.to + 16] = null;
                }
            }

            /* if pawn promotion, replace with new piece */
            if (move.flags & BITS.PROMOTION) {
                board[move.to] = {type: move.promotion, color: us};
                fake_piece_squares.push(move.to);
            }


            /* turn off castling if we move a rook */
            if (move.piece == ROOK) {
                if (castling[us]) {
                    castling[us] ^= get_rook_castling_flag(move.from, us);
                }
                set_castling_rook(move.from, 0, us);
                update_rook_square(move.from, move.to, us);
            }

            /* turn off castling if we capture a rook */
            if (castling[them]) {
                if (castling[them]) {
                    castling[them] ^= get_rook_castling_flag(move.to, them);
                }
                set_castling_rook(move.to, 0, them);
                update_rook_square(move.to, EMPTY, them);
            }
            /*
            if (castling[them]) {
                for (var i = 0, len = ROOKS[them].length; i < len; i++) {
                    if (move.to === ROOKS[them][i].square &&
                            castling[them] & ROOKS[them][i].flag) {
                        castling[them] ^= ROOKS[them][i].flag;
                        ROOKS[them][i].flag = 0;
                        if (castling_file[them] == file(ROOKS[them][i].square)) {
                            castling_file[them] = null;
                        }
                        break;
                    }
                }
            }
            */

            /* if big pawn move, update the en passant square */
            if (move.flags & BITS.BIG_PAWN) {
                // only update the en passant square if there's a legal
                // en passant move available. this is what lichess does
                // and what Steven Edwards prefers
                // http://www.talkchess.com/forum/viewtopic.php?topic_view=threads&p=396838&t=37879
                var left_piece = board[move.to - 1];
                var right_piece = board[move.to + 1];
                var pawn_on_left = left_piece && left_piece.color == them && left_piece.type == PAWN;
                var pawn_on_right = right_piece && right_piece.color == them && right_piece.type == PAWN;
                if (turn === 'b') {
                    ep_square = move.to - 16;
                } else {
                    ep_square = move.to + 16;
                }
                if (pawn_on_left) {
                    // check if it's legal for that pawn to ep capture
                    var legal_ep = is_legal_ep(move.to - 1, ep_square);
                    if (!legal_ep) {
                        if (pawn_on_right) {
                            legal_ep = is_legal_ep(move.to + 1, ep_square);
                            if (!legal_ep) {
                                ep_square = EMPTY;
                            }
                        } else {
                            ep_square = EMPTY;
                        }
                    }
                } else {
                    if (pawn_on_right) {
                        legal_ep = is_legal_ep(move.to + 1, ep_square);
                        if (!legal_ep) {
                            ep_square = EMPTY;
                        }
                    } else {
                        ep_square = EMPTY;
                    }
                }
            } else {
                ep_square = EMPTY;
            }
        }

        // Update the castling file if this move introduced an ambiguity
        // about which rook to use for castling
        if (move.piece == ROOK && mode_960) {
            var us_back_rank = us == WHITE ? RANK_1 : RANK_8;
            if (rank(move.to) == us_back_rank) {
                if (castling[us]) {
                    for (var i = 0, len = ROOKS[us].length; i < len; i++) {
                        if (BITS.KSIDE_CASTLE & ROOKS[us][i].flag) {
                            if (file(move.to) > file(ROOKS[us][i].square)) {
                                castling_file[us] = file(ROOKS[us][i].square);
                            }
                        } else if (BITS.QSIDE_CASTLE & ROOKS[us][i].flag) {
                            if (file(move.to) < file(ROOKS[us][i].square)) {
                                castling_file[us] = file(ROOKS[us][i].square);
                            }
                        }
                    }
                }
            }
        }

        // I don't think crazyhouse has a 50 move draw rule.
        // lichess does not reset the half move counter on
        // pawn moves or captures and does not seem to support
        // 50-move-rule draws, so that's what we'll do.
        /*
           if (move.piece === PAWN) {
           half_moves = 0;
           } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
           half_moves = 0;
           } else {
           */
        half_moves++;
        /*
           }
           */

        if (turn === BLACK) {
            move_number++;
        }
        turn = swap_color(turn);
    }

    function is_legal_ep(from, to) {
        var legal_ep = false;
        var us = turn;
        turn = swap_color(turn);
        make_move(build_move(board, from, to, FLAGS.EP_CAPTURE));
        if (!king_attacked(us)) {
            legal_ep = true;
        }
        undo_move();
        turn = swap_color(turn);
        return legal_ep;
    }

    function hand_to_str(hand) {
        var s = '[W hand: ';
        s += hand.w.map(function(p) {
            return p.type.toUpperCase();
        }).join('');
        s += '][B hand: ';
        s += hand.b.map(function(p) {
            return p.type;
        }).join('');
        s += ']';
        return s;
    }

    function undo_move() {
        var old = history.pop();
        if (old == null) { return null; }
        var move = old.move;
        kings = old.kings;
        ROOKS = clone_rooks(old.rooks);
        turn = old.turn;
        castling = old.castling;
        ep_square = old.ep_square;
        half_moves = old.half_moves;
        move_number = old.move_number;
        zh_hand = clone_hand(old.zh_hand);
        fake_piece_squares = old.fake_piece_squares.slice();

        var us = turn;
        var them = swap_color(turn);

        if (move.from == HAND) {
            /* Crazyhouse drop move */
            board[move.to] = null;
        } else {
            /* Normal chess move */
            var move_to = move.to;
            var move_from = move.from;

            if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
                if (mode_960) {
                    move_from = kings[us];
                    // replace the rook for a castling move
                    var rook_to, rook_from;
                    if (move.flags & BITS.KSIDE_CASTLE) {
                        // get the square that the rook started on
                        for (var i = 0; i < ROOKS[us].length; i++) {
                            if (ROOKS[us][i].flag & BITS.KSIDE_CASTLE) {
                                rook_to = ROOKS[us][i].square;
                                break;
                            }
                        }
                        move_to = us === WHITE ? SQUARES.g1 : SQUARES.g8;
                        rook_from = us === WHITE ? SQUARES.f1 : SQUARES.f8;
                    } else if (move.flags & BITS.QSIDE_CASTLE) {
                        for (var i = 0; i < ROOKS[us].length; i++) {
                            if (ROOKS[us][i].flag & BITS.QSIDE_CASTLE) {
                                rook_to = ROOKS[us][i].square;
                                break;
                            }
                        }
                        move_to = us === WHITE ? SQUARES.c1 : SQUARES.c8;
                        rook_from = us === WHITE ? SQUARES.d1 : SQUARES.d8;
                    }

                    board[rook_from] = null;
                    board[rook_to] = {type: ROOK, color: us};
                    // only set the rook_from square to empty if the king hasn't
                    // been placed there
                    if (move_to !== move_from) {
                        board[move_from] = {type: KING, color: us};
                        if (!(board[move_to] && board[move_to].type == ROOK)) {
                            board[move_to] = null;
                        }
                    }
                } else {
                    var castling_to, castling_from;
                    if (move.flags & BITS.KSIDE_CASTLE) {
                        castling_to = move.to + 1;
                        castling_from = move.to - 1;
                    } else if (move.flags & BITS.QSIDE_CASTLE) {
                        castling_to = move.to - 2;
                        castling_from = move.to + 1;
                    }
                    board[move.from] = board[move.to];
                    board[move.to] = null;
                    board[castling_to] = board[castling_from];
                    board[castling_from] = null;
                }
            } else {
                board[move_from] = board[move_to];
                if (board[move_from] != null) {
                    board[move_from].type = move.piece;  // to undo any promotions
                }
                board[move_to] = null;
            }

            if (move.flags & BITS.CAPTURE) {
                board[move.to] = {type: move.captured, color: them};
            } else if (move.flags & BITS.EP_CAPTURE) {
                var index;
                if (us === BLACK) {
                    index = move.to - 16;
                } else {
                    index = move.to + 16;
                }
                board[index] = {type: PAWN, color: them};
            }
        }
        return move;
    }

    /* this function is used to uniquely identify ambiguous moves */
    function get_disambiguator(move, sloppy) {
        var moves = generate_moves({legal: !sloppy});

        var from = move.from;
        var to = move.to;
        var piece = move.piece;

        if (from == HAND) {
            /* Crazyhouse drop move */
            return '';
        }

        // Filter out drop moves so they don't interfere
        // with disambiguations
        moves = moves.filter(function(m) {
            return m.from !== HAND;
        });

        var ambiguities = 0;
        var same_rank = 0;
        var same_file = 0;

        for (var i = 0, len = moves.length; i < len; i++) {
            var ambig_from = moves[i].from;
            var ambig_to = moves[i].to;
            var ambig_piece = moves[i].piece;

            /* if a move of the same piece type ends on the same to square, we'll
             * need to add a disambiguator to the algebraic notation
             */
            if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
                ambiguities++;

                if (rank(from) === rank(ambig_from)) {
                    same_rank++;
                }

                if (file(from) === file(ambig_from)) {
                    same_file++;
                }
            }
        }

        if (ambiguities > 0) {
            /* if there exists a similar moving piece on the same rank and file as
             * the move in question, use the square as the disambiguator
             */
            if (same_rank > 0 && same_file > 0) {
                return algebraic(from);
            }
            /* if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            else if (same_file > 0) {
                return algebraic(from).charAt(1);
            }
            /* else use the file symbol */
            else {
                return algebraic(from).charAt(0);
            }
        }

        return '';
    }

    function ascii() {
        var s = '   +------------------------+\n';
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            /* display the rank */
            if (file(i) === 0) {
                s += ' ' + '87654321'[rank(i)] + ' |';
            }

            /* empty piece */
            if (board[i] == null) {
                s += ' . ';
            } else {
                var piece = board[i].type;
                var color = board[i].color;
                var symbol = (color === WHITE) ?
                    piece.toUpperCase() : piece.toLowerCase();
                s += ' ' + symbol + ' ';
            }

            if ((i + 1) & 0x88) {
                s += '|\n';
                i += 8;
            }
        }
        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h\n';
        s += 'W hand: ';
        for (i = 0; i < zh_hand[WHITE].length; i++) {
            s += zh_hand[WHITE][i].type.toUpperCase();
        }
        s += ' | B hand: ';
        for (i = 0; i < zh_hand[BLACK].length; i++) {
            s += zh_hand[BLACK][i].type.toLowerCase();
        }
        s += '\n';
        return s;
    }

    function to_square(rank, file) {
        if (Number.isInteger(file))
            file = file_to_letter(file);
        var alg = '' + file + rank;
        alg = alg.toLowerCase();
        return SQUARES[alg];
    }

    function file_to_letter(file) {
        return 'abcdefgh'.substring(file,file+1);
    }

    function letter_to_file(letter) {
        return 'abcdefgh'.indexOf(letter.toLowerCase());
    }

    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    function move_from_san(move, sloppy) {
        // strip off any move decorations: e.g Nf3+?!
        var clean_move = stripped_san(move);

        // if we're using the sloppy parser run a regex to grab piece, to, and from
        // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
        if (sloppy) {
            var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])?x?-?@?([a-h][1-8])([qrbnQRBN])?/);
            if (matches) {
                var piece = matches[1];
                var from = matches[2];
                var to = matches[3];
                var promotion = matches[4];
            }
        }

        var moves = generate_moves();
        for (var i = 0, len = moves.length; i < len; i++) {
            // try the strict parser first, then the sloppy parser if requested
            // by the user
            if ((clean_move === stripped_san(move_to_san(moves[i]))) ||
                    (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))) {
                return moves[i];
            } else {
                if (matches &&
                        (!piece || piece.toLowerCase() == moves[i].piece) &&
                        SQUARES[from] == moves[i].from &&
                        SQUARES[to] == moves[i].to &&
                        (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                    return moves[i];
                }
            }
        }

        return null;
    }

    function new_960(position_number) {
        var fen, num;
        if (typeof position_number !== "undefined") {
            if (position_number < 0 || position_number > 959) {
                fen = DEFAULT_POSITION;
                num = 518;
            } else {
                num = position_number;
                fen = fen_from_pos_num(num);
            }
        } else {
            num = random_960_pos_num();
            fen = fen_from_pos_num(num);
        }
        start_position_number = num;
        load(fen);
        return { fen: fen, position_number: num };
    }

    function random_960_pos_num() {
        return Math.floor(Math.random() * 960);
    }

    function fen_from_pos_num(num) {
        // https://en.wikipedia.org/wiki/Chess960_numbering_scheme#Direct_derivation
        var knight_table = [
            ['n', 'n', 0, 0, 0],
            ['n', 0, 'n', 0, 0],
            ['n', 0, 0, 'n', 0],
            ['n', 0, 0, 0, 'n'],
            [0, 'n', 'n', 0, 0],
            [0, 'n', 0, 'n', 0],
            [0, 'n', 0, 0, 'n'],
            [0, 0, 'n', 'n', 0],
            [0, 0, 'n', 0, 'n'],
            [0, 0, 0, 'n', 'n']
        ];
        var pieces = [0, 0, 0, 0, 0, 0, 0, 0];
        // light square bishop
        var n2 = Math.floor(num / 4);
        var b1 = num % 4;
        pieces[2 * b1 + 1] = 'b';
        // dark square bishop
        var n3 = Math.floor(n2 / 4);
        var b2 = n2 % 4;
        pieces[2 * b2] = 'b';
        // queen
        var n4 = Math.floor(n3 / 6);
        var q = n3 % 6;
        var q_index = pieces.indexOf(0);
        for (var i = 0; i < q; i++) {
            q_index = pieces.indexOf(0, q_index+1);
        }
        pieces[q_index] = 'q';
        // place the knights
        var knights = knight_table[n4];
        var n_index = 0;
        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i] != 0) {
                continue;
            }
            pieces[i] = knights[n_index++];
        }
        // finally, place rook-king-rook in remaining 3 squares
        pieces[pieces.indexOf(0)] = 'r';
        pieces[pieces.indexOf(0)] = 'k';
        pieces[pieces.indexOf(0)] = 'r';
        // build the fen
        var fen = '';
        var black_home = pieces.join('');
        var white_home = black_home.toUpperCase();
        fen += black_home + '/';
        fen += 'pppppppp/';
        fen += '8/8/8/8/';
        fen += 'PPPPPPPP/';
        fen += white_home + '/';
        fen += ' w KQkq - 0 1';
        return fen;
    }


    /*****************************************************************************
     * UTILITY FUNCTIONS
     ****************************************************************************/
    function rank(i) {
        return i >> 4;
    }

    function file(i) {
        return i & 15;
    }

    function algebraic(i){
        if (i == HAND) {
            return '@';
        }
        var f = file(i), r = rank(i);
        return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
    }

    function swap_color(c) {
        return c === WHITE ? BLACK : WHITE;
    }

    function is_digit(c) {
        return '0123456789'.indexOf(c) !== -1;
    }

    /* pretty = external move object */
    function make_pretty(ugly_move) {
        var move = clone(ugly_move);
        move.san = move_to_san(move, false);
        move.to = algebraic(move.to);
        move.from = algebraic(move.from);

        var flags = '';

        for (var flag in BITS) {
            if (BITS[flag] & move.flags) {
                flags += FLAGS[flag];
            }
        }
        move.flags = flags;

        return move;
    }

    function clone(obj) {
        var dupe = (obj instanceof Array) ? [] : {};

        for (var property in obj) {
            if (typeof property === 'object') {
                dupe[property] = clone(obj[property]);
            } else {
                dupe[property] = obj[property];
            }
        }

        return dupe;
    }

    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    /*****************************************************************************
     * DEBUGGING UTILITIES
     ****************************************************************************/
    function perft(depth) {
        var moves = generate_moves({legal: false});
        var nodes = 0;
        var color = turn;

        for (var i = 0, len = moves.length; i < len; i++) {
            make_move(moves[i]);
            if (!king_attacked(color)) {
                if (depth - 1 > 0) {
                    var child_nodes = perft(depth - 1);
                    nodes += child_nodes;
                } else {
                    nodes++;
                }
            }
            undo_move();
        }

        return nodes;
    }

    return {
        /***************************************************************************
         * PUBLIC CONSTANTS (is there a better way to do this?)
         **************************************************************************/
        WHITE: WHITE,
        BLACK: BLACK,
        PAWN: PAWN,
        KNIGHT: KNIGHT,
        BISHOP: BISHOP,
        ROOK: ROOK,
        QUEEN: QUEEN,
        KING: KING,
        HAND: HAND,
        SQUARES: (function() {
            /* from the ECMA-262 spec (section 12.6.4):
             * "The mechanics of enumerating the properties ... is
             * implementation dependent"
             * so: for (var sq in SQUARES) { keys.push(sq); } might not be
             * ordered correctly
             */
            var keys = [];
            for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                if (i & 0x88) { i += 7; continue; }
                keys.push(algebraic(i));
            }
            return keys;
        })(),
        FLAGS: FLAGS,

        /***************************************************************************
         * PUBLIC API
         **************************************************************************/
        load: function(fen) {
            return load(fen);
        },

        reset: function() {
            return reset();
        },

        moves: function(options) {
            /* The internal representation of a chess move is in 0x88 format, and
             * not meant to be human-readable.  The code below converts the 0x88
             * square coordinates to algebraic coordinates.  It also prunes an
             * unnecessary move keys resulting from a verbose call.
             */

            var ugly_moves = generate_moves(options);
            var moves = [];

            for (var i = 0, len = ugly_moves.length; i < len; i++) {

                /* does the user want a full move object (most likely not), or just
                 * SAN
                 */
                if (typeof options !== 'undefined' && 'verbose' in options &&
                        options.verbose) {
                    moves.push(make_pretty(ugly_moves[i]));
                } else {
                    moves.push(move_to_san(ugly_moves[i], false));
                }
            }

            return moves;
        },

        in_check: function() {
            return in_check();
        },

        in_checkmate: function() {
            return in_checkmate();
        },

        in_stalemate: function() {
            return in_stalemate();
        },

        in_draw: function() {
            return in_stalemate() ||
                insufficient_material() ||
                in_threefold_repetition();
        },

        insufficient_material: function() {
            return insufficient_material();
        },

        in_threefold_repetition: function() {
            return in_threefold_repetition();
        },

        game_over: function() {
            return in_checkmate() ||
                in_stalemate() ||
                insufficient_material() ||
                in_threefold_repetition();
        },

        validate_fen: function(fen) {
            return validate_fen(fen);
        },

        fen: function() {
            return generate_fen();
        },

        board: function() {
            var output = [],
            row    = [];

            for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                if (board[i] == null) {
                    row.push(null);
                } else {
                    row.push({type: board[i].type, color: board[i].color});
                }
                if ((i + 1) & 0x88) {
                    output.push(row);
                    row = [];
                    i += 8;
                }
            }

            return output;
        },

        pgn: function(options) {
            /* using the specification from http://www.chessclub.com/help/PGN-spec
             * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
             */
            var newline = (typeof options === 'object' &&
                    typeof options.newline_char === 'string') ?
                options.newline_char : '\n';
            var max_width = (typeof options === 'object' &&
                    typeof options.max_width === 'number') ?
                options.max_width : 0;
            var result = [];
            var header_exists = false;

            /* add the PGN header headerrmation */
            for (var i in header) {
                /* TODO: order of enumerated properties in header object is not
                 * guaranteed, see ECMA-262 spec (section 12.6.4)
                 */
                result.push('[' + i + ' \"' + header[i] + '\"]' + newline);
                header_exists = true;
            }

            if (header_exists && history.length) {
                result.push(newline);
            }

            /* pop all of history onto reversed_history */
            var reversed_history = [];
            while (history.length > 0) {
                reversed_history.push(undo_move());
            }

            var moves = [];
            var move_string = '';

            /* build the list of moves.  a move_string looks like: "3. e3 e6" */
            while (reversed_history.length > 0) {
                var move = reversed_history.pop();

                /* if the position started with black to move, start PGN with 1. ... */
                if (!history.length && move.color === 'b') {
                    move_string = move_number + '. ...';
                } else if (move.color === 'w') {
                    /* store the previous generated move_string if we have one */
                    if (move_string.length) {
                        moves.push(move_string);
                    }
                    move_string = move_number + '.';
                }

                move_string = move_string + ' ' + move_to_san(move, false);
                make_move(move);
            }

            /* are there any other leftover moves? */
            if (move_string.length) {
                moves.push(move_string);
            }

            /* is there a result? */
            if (typeof header.Result !== 'undefined') {
                moves.push(header.Result);
            }

            /* history should be back to what is was before we started generating PGN,
             * so join together moves
             */
            if (max_width === 0) {
                return result.join('') + moves.join(' ');
            }

            /* wrap the PGN output at max_width */
            var current_width = 0;
            for (var i = 0; i < moves.length; i++) {
                /* if the current move will push past max_width */
                if (current_width + moves[i].length > max_width && i !== 0) {

                    /* don't end the line with whitespace */
                    if (result[result.length - 1] === ' ') {
                        result.pop();
                    }

                    result.push(newline);
                    current_width = 0;
                } else if (i !== 0) {
                    result.push(' ');
                    current_width++;
                }
                result.push(moves[i]);
                current_width += moves[i].length;
            }

            return result.join('');
        },

        load_pgn: function(pgn, options) {
            // allow the user to specify the sloppy move parser to work around over
            // disambiguation bugs in Fritz and Chessbase
            var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
                options.sloppy : false;

            function mask(str) {
                return str.replace(/\\/g, '\\');
            }

            function has_keys(object) {
                for (var key in object) {
                    return true;
                }
                return false;
            }

            function parse_pgn_header(header, options) {
                var newline_char = (typeof options === 'object' &&
                        typeof options.newline_char === 'string') ?
                    options.newline_char : '\r?\n';
                var header_obj = {};
                var headers = header.split(new RegExp(mask(newline_char)));
                var key = '';
                var value = '';

                for (var i = 0; i < headers.length; i++) {
                    key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
                    value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');
                    if (trim(key).length > 0) {
                        header_obj[key] = value;
                    }
                }

                return header_obj;
            }

            var newline_char = (typeof options === 'object' &&
                    typeof options.newline_char === 'string') ?
                options.newline_char : '\r?\n';
            var regex = new RegExp('^(\\[(.|' + mask(newline_char) + ')*\\])' +
                    '(' + mask(newline_char) + ')*' +
                '1.(' + mask(newline_char) + '|.)*$', 'g');

            /* get header part of the PGN file */
            var header_string = pgn.replace(regex, '$1');

            /* no info part given, begins with moves */
            if (header_string[0] !== '[') {
                header_string = '';
            }

            reset();

            /* parse PGN header */
            var headers = parse_pgn_header(header_string, options);
            for (var key in headers) {
                set_header([key, headers[key]]);
            }

            /* load the starting position indicated by [Setup '1'] and
             * [FEN position] */
            if (headers['SetUp'] === '1') {
                if (!(('FEN' in headers) && load(headers['FEN']))) {
                    return false;
                }
            }

            /* delete header to get the moves */
            var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' ');

            /* delete comments */
            ms = ms.replace(/(\{[^}]+\})+?/g, '');

    /* delete recursive annotation variations */
    var rav_regex = /(\([^\(\)]+\))+?/g;
    while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, '');
    }

    /* delete move numbers */
    ms = ms.replace(/\d+\.(\.\.)?/g, '');

    /* delete ... indicating black to move */
    ms = ms.replace(/\.\.\./g, '');

    /* delete numeric annotation glyphs */
    ms = ms.replace(/\$\d+/g, '');

    /* trim and get array of moves */
    var moves = trim(ms).split(new RegExp(/\s+/));

    /* delete empty entries */
    moves = moves.join(',').replace(/,,+/g, ',').split(',');
    var move = '';

    for (var half_move = 0; half_move < moves.length - 1; half_move++) {
        move = move_from_san(moves[half_move], sloppy);

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
            return false;
        } else {
            make_move(move);
        }
    }

    /* examine last move */
    move = moves[moves.length - 1];
    if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') {
            set_header(['Result', move]);
        }
    }
    else {
        move = move_from_san(move, sloppy);
        if (move == null) {
            return false;
        } else {
            make_move(move);
        }
    }
    return true;
    },

    header: function() {
        return set_header(arguments);
    },

    ascii: function() {
        return ascii();
    },

    turn: function() {
        return turn;
    },

    move: function(move, options) {
        /* The move function can be called with in the following parameters:
         *
         * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
         *
         * .move({ from: 'h7', <- where the 'move' is a move object (additional
         *         to :'h8',      fields are ignored)
         *         promotion: 'q',
         *      })
         */

        // allow the user to specify the sloppy move parser to work around over
        // disambiguation bugs in Fritz and Chessbase
        var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
            options.sloppy : false;

        var move_obj = null;
        if (typeof move === 'string') {
            move_obj = move_from_san(move, sloppy);
        } else if (typeof move === 'object') {
            var moves = generate_moves();

            /* convert the pretty move object to an ugly move object */
            for (var i = 0, len = moves.length; i < len; i++) {
                if (move.from === algebraic(moves[i].from) &&
                        move.to === algebraic(moves[i].to) &&
                        (!('promotion' in moves[i]) ||
                         move.promotion === moves[i].promotion) &&
                        (!('piece' in moves[i]) ||
                         move.piece.toLowerCase() === moves[i].piece.toLowerCase())) {
                    move_obj = moves[i];
                    break;
                }
            }
        }

        /* failed to find move */
        if (!move_obj) {
            return null;
        }

        /* need to make a copy of move because we can't generate SAN after the
         * move is made
         */
        var pretty_move = make_pretty(move_obj);

        make_move(move_obj);
        return pretty_move;
    },

    undo: function() {
        var move = undo_move();
        return (move) ? make_pretty(move) : null;
    },

    clear: function() {
        return clear();
    },

    put: function(piece, square) {
        return put(piece, square);
    },

    get: function(square) {
        return get(square);
    },

    remove: function(square) {
        return remove(square);
    },

    put_in_hand: function(piece) {
        return put_in_hand(piece);
    },

    remove_from_hand: function(piece) {
        return remove_from_hand(piece);
    },

    get_hand: function(options) {
        var color = (typeof options !== 'undefined' && 'color' in options &&
                options.color);
        if (color)
            color = color.charAt(0);
        var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                options.verbose);
        if (verbose) {
            if (color) {
                return zh_hand[color];
            } else {
                return zh_hand;
            }
        } else {
            if (color) {
                return zh_hand[color].map(function(p) {
                    return color.charAt(0) === 'w' ? p.type.toUpperCase() : p.type;
                });
            } else {
                return {w: zh_hand.w.map(function(p) { return p.type.toUpperCase(); }),
                        b: zh_hand.b.map(function(p) { return p.type; }) };
            }
        }
    },

    perft: function(depth) {
        return perft(depth);
    },

    square_color: function(square) {
        if (square in SQUARES) {
            var sq_0x88 = SQUARES[square];
            return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? 'light' : 'dark';
        }

        return null;
    },

    history: function(options) {
        var reversed_history = [];
        var move_history = [];
        var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                options.verbose);

        while (history.length > 0) {
            reversed_history.push(undo_move());
        }

        while (reversed_history.length > 0) {
            var move = reversed_history.pop();
            if (verbose) {
                move_history.push(make_pretty(move));
            } else {
                move_history.push(move_to_san(move));
            }
            make_move(move);
        }

        return move_history;
    },

    new_960: function(position_number) {
        return new_960(position_number);
    },

    position_number: function() {
        if (typeof start_position_number !== "undefined") {
            return start_position_number;
        }
        return -1;
    },

    castling_legal: function(from, to, direction, side) {
        from = SQUARES[from];
        to = SQUARES[to];
        direction = direction === 'k' ? BITS.KSIDE_CASTLE : BITS.QSIDE_CASTLE;
        return castling_legal(from, to, direction, side);
    },

    // returns the position portion of the fen string (before the first space),
    // without the crazyhouse hand or fake piece ~ indicators. useful for
    // working with chessboard.js for example.
    position: function() {
        var f = generate_fen().split(' ')[0];
        // remove hand from end
        f = f.split('/').slice(0, 8).join('/');
        // remove fake piece indicators
        f = f.replace(/~/g, '');
        return f;
    }


};
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Crazyhouse = Crazyhouse;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return Crazyhouse;  });
