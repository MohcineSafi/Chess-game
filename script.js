document.addEventListener('DOMContentLoaded', () => {
    let chessboard = null; 
    const chessGame = new Chess(); 
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1; 
    let userColor = 'w';

    const makeRandomMove = () => {
        const possibleMoves = chessGame.moves();

        if (chessGame.game_over()) {
            alert("Checkmate!");
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            chessGame.move(move);
            chessboard.position(chessGame.fen());
            recordMove(move, moveCount); 
            moveCount++; 
        }
    };

    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    const onDragStart = (source, piece) => {
        return !chessGame.game_over() && piece.search(userColor) === 0;
    };

    const onDrop = (source, target) => {
        const move = chessGame.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); 
        moveCount++;
    };

    const onSnapEnd = () => {
        chessboard.position(chessGame.fen());
    };

    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    chessboard = Chessboard('board', boardConfig);

    document.querySelector('.play-again').addEventListener('click', () => {
        chessGame.reset();
        chessboard.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position!");
        if (fen !== null) {
            if (chessGame.load(fen)) {
                chessboard.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            } else {
                alert("Invalid FEN notation. Please try again.");
            }
        }
    });

    document.querySelector('.flip-board').addEventListener('click', () => {
        chessboard.flip();
        makeRandomMove();
        userColor = userColor === 'w' ? 'b' : 'w';
    });

});
