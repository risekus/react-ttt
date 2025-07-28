import { useState } from 'react'; // React의 상태 관리 Hook

// 하나의 칸(Square) 컴포넌트 정의
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value} {/* X, O, 또는 빈칸 */}
    </button>
  );
}

// 보드(Board) 컴포넌트: 3x3 그리드 전체를 표현
function Board({ xIsNext, squares, onPlay }) {
  // 칸 클릭 시 호출되는 함수
  function handleClick(i) {
    // 이미 승자가 있거나 클릭된 칸이 비어있지 않으면 무시
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // 기존 보드 상태 복사
    const nextSquares = squares.slice();

    // 현재 차례에 따라 'X' 또는 'O' 표시
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    // 부모(Game)에게 상태 업데이트 요청
    onPlay(nextSquares);
  }

  // 승자 계산
  const winner = calculateWinner(squares);

  // 상태 표시 텍스트
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div> {/* 상태 표시 */}
      {/* 3x3 그리드 렌더링 */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// 최상위 Game 컴포넌트
export default function Game() {
  // 상태 1: 각 턴의 보드 상태 기록 (처음엔 빈 배열 하나)
  const [history, setHistory] = useState(() => [Array(9).fill(null)]);

  // 상태 2: 현재 몇 번째 수인지
  const [currentMove, setCurrentMove] = useState(0);

  // X 차례인지 여부
  const xIsNext = currentMove % 2 === 0;

  // 현재 보드 상태 가져오기
  const currentSquares = history[currentMove];

  // 사용자가 수를 두었을 때 처리
  function handlePlay(nextSquares) {
    // 되돌아가기 이후에 새 수를 두면, 이후 수들은 제거됨
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    // 새로운 히스토리와 현재 수 설정
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 특정 수로 되돌아가기
  function jumpTo(nextMove) {
    if (currentMove === nextMove) return;
    setCurrentMove(nextMove);
  }

  // 이동 목록 버튼들 생성
  const moves = history.map((squares, move) => {
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

  return (
    <div className="game">
      <div className="game-board">
        {/* 보드 컴포넌트 전달 */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* 이동 기록 버튼 리스트 출력 */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 승자 판단 함수
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
    [0, 4, 8], [2, 4, 6],           // 대각선
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // 'X' 또는 'O'
    }
  }
  return null; // 승자가 없음
}
