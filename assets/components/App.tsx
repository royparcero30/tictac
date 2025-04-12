import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert as RNAlert,
} from 'react-native';

type Player = 'X' | 'O';
type Cell = Player | null;

const initialBoard: Cell[] = Array(9).fill(null);

// ✅ Safe alert function
const showAlert = (title: string, message?: string, buttons?: any[]) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (buttons && buttons[0]?.onPress) buttons[0].onPress();
  } else {
    RNAlert.alert(title, message, buttons);
  }
};

const App = () => {
  const [board, setBoard] = useState<Cell[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [playerNames, setPlayerNames] = useState<{ X: string; O: string }>({
    X: 'Player X',
    O: 'Player O',
  });

  const handlePress = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winnerCombo = checkWinner(newBoard);
    if (winnerCombo) {
      const winPlayer = newBoard[winnerCombo[0]] as Player;
      setScores((prev) => ({ ...prev, [winPlayer]: prev[winPlayer] + 1 }));
      setWinningCombo(winnerCombo);
      setGameOver(true);
      setWinner(winPlayer);
      showAlert('Game Over', `${playerNames[winPlayer]} wins!`, [
        { text: 'Next Round', onPress: resetBoard },
      ]);
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameOver(true);
      setWinner(null);
      showAlert('Game Over', "It's a draw!", [{ text: 'Next Round', onPress: resetBoard }]);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const checkWinner = (board: Cell[]): number[] | null => {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let combo of combos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combo;
      }
    }
    return null;
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setGameOver(false);
    setWinningCombo(null);
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetBoard();
  };

  const renderCell = (index: number) => {
    const isWinning = winningCombo?.includes(index);
    return (
      <TouchableOpacity
        key={index}
        style={[styles.cell, isWinning && styles.winningCell]}
        onPress={() => handlePress(index)}
      >
        <Text style={styles.cellText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  const handleNameChange = (player: Player, name: string) => {
    setPlayerNames((prev) => ({ ...prev, [player]: name }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <View style={styles.playerCard}>
          <TextInput
            style={styles.playerNameInput}
            value={playerNames['X']}
            onChangeText={(text) => handleNameChange('X', text)}
            placeholder="Player X"
            placeholderTextColor="#777"
          />
          <Text style={styles.playerSymbol}>X</Text>
          <Text style={styles.scoreText}>{scores['X']}</Text>
        </View>

        <Text style={styles.turnArrow}>{currentPlayer === 'X' ? '←' : '→'}</Text>

        <View style={styles.playerCard}>
          <TextInput
            style={styles.playerNameInput}
            value={playerNames['O']}
            onChangeText={(text) => handleNameChange('O', text)}
            placeholder="Player O"
            placeholderTextColor="#777"
          />
          <Text style={styles.playerSymbol}>O</Text>
          <Text style={styles.scoreText}>{scores['O']}</Text>
        </View>
      </View>

      <View style={styles.board}>{board.map((_, i) => renderCell(i))}</View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={resetBoard}>
          <Text style={styles.buttonText}>Reset Current Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={resetScores}>
          <Text style={styles.buttonText}>Reset Scores</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkred',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  playerCard: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: 120,
  },
  playerNameInput: {
    color: '#eee',
    fontSize: 16,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'darkred',
    width: '100%',
    textAlign: 'center',
  },
  playerSymbol: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreText: {
    color: '#bbb',
    fontSize: 18,
    marginTop: 5,
  },
  turnArrow: {
    color: '#fff',
    fontSize: 32,
    marginHorizontal: 20,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 20,
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  winningCell: {
    backgroundColor: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});
export default App;
