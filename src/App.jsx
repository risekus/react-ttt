import { useState } from "react";

// export는 다른 파일에서 접근 가능한 함수(컴포넌트)가 됨
// default는 다른 파일에서 이 함수가 주요 함수(컴포넌트)임을 알려줌

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0); // 현재 이동 상태
    console.log(history);
    console.log(currentMove);
    const xIsNext = currentMove % 2 === 0; // 현재 차례가 X인지 O인지 결정
    // scurrentMove로 xIsNext를 알 수 있기에, 불필요한 state를 제거
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        // 이전 히스토리에서 currentMove까지 자르고, nextSquares를 추가
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        // history.push(nextSquares); // 배열을 푸쉬하는 것과 동일
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        setHistory(history.slice(0, nextMove + 1));
        // 현재 이동 상태를 nextMove로 설정하고, 그 이전의 히스토리만 유지
    }

    const moves = history.map((squares, move) => {
        // 여기서 move는 history 배열의 인덱스
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    // 부모 컴포넌트에서 상태를 관리하고, 자식 컴포넌트로 전달할 수 있음
    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

function Board( { xIsNext, squares, onPlay }) {
    function handleClick(i) {
        // 이미 클릭된 칸은 무시
        if ( squares[i] || calculateWinner(squares) ) {
            return; // 이미 값이 있는 경우, 함수 종료
        }

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X'; // X가 다음 차례인 경우
        } else {
            nextSquares[i] = 'O'; // O가 다음 차례인 경우
        }
        onPlay(nextSquares); // 부모 컴포넌트에 상태 변경 요청
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "승리 : " + winner;
    } else if (!squares.includes(null)) {
        status = "비겼어!";
    }
    else {
        status = "이번 차례는 : " + (xIsNext ? 'X' : 'O');
    }

    
    //    <Square value={squares[0]} onSquareClick={handleClick(0)}/>
    // 이렇게 하면 handleClick(0) 함수를 즉시 실행하여, 그 결과를 전달하게 됨
    return (
    <>
        <div className="status">{status}</div>
        <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
            <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
            <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
        </div>
        <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
            <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
            <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
        </div>
        <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
            <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
            <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
        </div>
    </>
    )
}

function Square({value, onSquareClick}) {

    // function handleClick() {
    //     setValue('X');
    // }

    return (
    <button className="square" onClick={onSquareClick}>
        {value}
    </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]; // 승자를 반환
        }
    }
    return null; // 승자가 없는 경우
}