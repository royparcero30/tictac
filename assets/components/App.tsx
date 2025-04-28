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

const initialBoard = Array(9).fill(null);

const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (buttons && buttons[0]?.onPress) buttons[0].onPress();
  } else {
    RNAlert.alert(title, message, buttons);
  }
};

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('Player1');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ Player1: 0, Player2: 0 });
  const [winningCombo, setWinningCombo] = useState(null);
  const [playerNames, setPlayerNames] = useState({ Player1: 'Player 1', Player2: 'Player 2' });

  const handlePress = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winnerCombo = checkWinner(newBoard);
    if (winnerCombo) {
      const winPlayer = newBoard[winnerCombo[0]];
      setScores((prev) => ({ ...prev, [winPlayer]: prev[winPlayer] + 1 }));
      setWinningCombo(winnerCombo);
      setGameOver(true);
      showAlert('Game Over', `${playerNames[winPlayer]} wins!`, [
        { text: 'Next Round', onPress: resetBoard },
      ]);
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameOver(true);
      showAlert('Game Over', "It's a draw!", [{ text: 'Next Round', onPress: resetBoard }]);
    } else {
      setCurrentPlayer(currentPlayer === 'Player1' ? 'Player2' : 'Player1');
    }
  };

  const checkWinner = (board) => {
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
    setCurrentPlayer('Player1');
    setGameOver(false);
    setWinningCombo(null);
  };

  const resetScores = () => {
    setScores({ Player1: 0, Player2: 0 });
    resetBoard();
  };

  const renderCell = (index) => {
    const isWinning = winningCombo?.includes(index);
    return (
      <TouchableOpacity
        key={index}
        style={[styles.cell, isWinning && styles.winningCell]}
        onPress={() => handlePress(index)}
      >
        <Text style={styles.cellText}>
          {board[index] === 'Player1' ? 'X' : board[index] === 'Player2' ? 'O' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleNameChange = (player, name) => {
    setPlayerNames((prev) => ({ ...prev, [player]: name }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.scoreContainer}>
        <View style={styles.playerCard}>
          <TextInput
            style={styles.playerNameInput}
            value={playerNames['Player1']}
            onChangeText={(text) => handleNameChange('Player1', text)}
            placeholder="Player 1"
            placeholderTextColor="#888"
          />
          <Text style={styles.scoreText}>Score: {scores['Player1']}</Text>
        </View>
        <View style={styles.playerCard}>
          <TextInput
            style={styles.playerNameInput}
            value={playerNames['Player2']}
            onChangeText={(text) => handleNameChange('Player2', text)}
            placeholder="Player 2"
            placeholderTextColor="#888"
          />
          <Text style={styles.scoreText}>Score: {scores['Player2']}</Text>
        </View>
      </View>

      <Text style={styles.turnText}>
        Turn: {currentPlayer === 'Player1' ? playerNames['Player1'] : playerNames['Player2']}
      </Text>

      <View style={styles.board}>
        {board.map((_, index) => renderCell(index))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={resetBoard}>
          <Text style={styles.buttonText}>New Round</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetScores}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#00eaff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerCard: {
    backgroundColor: '#00eaff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: 130,
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 10,
  },
  playerNameInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#718093',
    width: '100%',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 16,
    color: '#2f3640',
  },
  turnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00eaff',
    marginBottom: 10,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 2,
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  cellText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00eaff',
    textShadowColor: '#00eaff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  winningCell: {
    backgroundColor: '#004d4d',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 10,
  },
  button: {
    backgroundColor: '#00eaff',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default App;
