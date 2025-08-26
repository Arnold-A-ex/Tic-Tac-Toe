# Tic-Tac-Toe Game

A classic Tic-Tac-Toe game implemented using React. This project offers both single-player (against an AI) and multi-player modes, allowing users to enjoy the timeless game with various opponents.

## Features

* **Single Player Mode**: Challenge a smart AI opponent. The AI is designed to make optimal moves, including blocking your wins and trying to win itself.
* **Multiplayer Mode**: Play against a friend on the same device.
* **Win Detection**: Clearly indicates the winner with a celebratory effect (confetti!) and highlights the winning line.
* **Tie Detection**: Announces a tie when all cells are filled and no winner is found.
* **Undo Functionality**: Go back one or more moves (in single-player mode, it undoes both your move and the AI's move).
* **Restart Game**: Quickly start a new game at any point.
* **Responsive Design**: Enjoy the game on various screen sizes.

## Technologies Used

* **React**: A JavaScript library for building user interfaces.
* **React Icons**: For various icons used in the UI (e.g., player icons, mode selection).
* **React Confetti**: For a fun confetti animation when a player wins.
* **CSS**: For styling the game board and components.

## How to Play

1.  **Choose Your Mode**: Upon launching the game, select either "Single Player" to play against the AI or "Multi Player" to play with another person.
2.  **Make Your Move**: Click on any empty cell to place your "X" or "O".
3.  **Win or Tie**: The game automatically detects a winner or a tie.
4.  **Controls**:
    * **Change Mode**: Go back to the mode selection screen.
    * **Restart**: Start a new game in the current mode.
    * **Undo**: Revert the last move (or the last two moves in single-player mode).

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Arnold-A-ex/Tic-Tac-Toe.git](https://github.com/Arnold-A-ex/Tic-Tac-Toe.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Tic-Tac-Toe
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```

    This will open the application in your browser at `http://localhost:5174`.

## Code Structure

The project is organized into the following main components:

* `App.js`: The main application component, handling mode selection (single-player vs. multiplayer).
* `components/MultiPlayer.js`: Implements the game logic for human-vs-human gameplay.
* `components/SinglePlayer.js`: Implements the game logic for human-vs-AI gameplay, including the AI's move logic.
* `components/Cell.js`: Represents an individual cell on the Tic-Tac-Toe board.
* `App.css`: Contains all the styling for the application.

## AI Logic (Single Player Mode)

The AI in single-player mode follows a strategic approach to determine its moves:

1.  **Winning Move**: Checks if it can win in the current turn.
2.  **Blocking Move**: Checks if the human player can win in their next turn and blocks them.
3.  **Center Preference**: If the center cell (index 4) is available, the AI will try to take it.
4.  **Double Win Creation Prevention**: Tries to block scenarios where the human player could create two winning lines simultaneously.
5.  **Corner Preference**: Prioritizes taking available corner cells.
6.  **Random Move**: If no strategic moves are available, it picks a random empty square.

## Contributing

Feel free to fork this repository, make improvements, and submit pull requests. Any contributions are welcome!

## License

This project is open source and available under the [MIT License](LICENSE).

---