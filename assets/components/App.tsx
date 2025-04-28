import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

const initialBoard = Array(9).fill(null);

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winningCombo, setWinningCombo] = useState(null);

  const handlePress = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winnerCombo = checkWinner(newBoard);
    if (winnerCombo) {
      const winner = newBoard[winnerCombo[0]];
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      setWinningCombo(winnerCombo);
      setGameOver(true);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const checkWinner = (board) => {
    const combos = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6],
    ];
    for (let combo of combos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combo;
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setGameOver(false);
    setWinningCombo(null);
  };

  const renderCell = (index) => {
    const isWinningCell = winningCombo?.includes(index);
    return (
      <TouchableOpacity
        key={index}
        style={[styles.cell, isWinningCell && styles.winningCell]}
        onPress={() => handlePress(index)}
      >
        <Text style={[styles.cellText, board[index] === 'X' && styles.xText, board[index] === 'O' && styles.oText]}>
          {board[index]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>

      <View style={styles.scoreBoard}>
        <Text style={styles.score}>X Won - {scores.X}</Text>
        <Text style={styles.score}>O Won - {scores.O}</Text>
      </View>

      <Text style={styles.turnText}>
        {gameOver 
          ? (winningCombo ? `${currentPlayer} Wins!` : "It's a Draw!")
          : `Turn: ${currentPlayer}`}
      </Text>

      <View style={styles.board}>
        {board.map((_, index) => renderCell(index))}
      </View>

      <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
        <Text style={styles.restartButtonText}>RESTART</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00eaff',
    marginBottom: 10,
  },
  scoreBoard: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: 'white',
  },
  turnText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00eaff',
    marginBottom: 20,
  },
  board: {
    width: 260,
    height: 260,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },
  cellText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  xText: {
    color: 'limegreen',
  },
  oText: {
    color: '#00eaff',
  },
  winningCell: {
    backgroundColor: '#004d4d',
  },
  restartButton: {
    backgroundColor: '#00cc00',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
