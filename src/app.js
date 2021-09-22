export function teste() {
  let output = '';
  for (let i = 0; i < 25; i++) {
    output += `${i}\n`;
  }
  return output;
}

/**
 * Checks if moving to the next cell hits a wall
 * @param nextCell - cell to check contents
 * @returns {boolean} - boolean indicating if a wall was hit
 */
function hitsWall(nextCell) {
  return nextCell === '1';
}

/**
 * Checks if a given position is outside the bounds of the given top, bottom, right and left limits
 * @param position - position to check
 * @param limits - maze limits (top, bottom, right, left)
 * @returns {boolean} - boolean indicating if the position is outside the maze
 */
function outOfMaze(position, limits) {
  return position.line < limits.top || position.line > limits.bottom
         || position.col < limits.left || position.col > limits.right;
}

/**
 * Calculates number of movements from current position to exit position
 * @param currPos - current position
 * @param exit - exit position
 * @returns {number} - number of movements to get to exit
 */
function nOfMovementsToExit(currPos, exit) {
  return Math.abs(currPos.line - exit.line) + Math.abs(currPos.col - exit.col);
}

function fitness(maze, entrance, exit, limits, path) {
  let fitness = 0;

  let currPosition = entrance;

  // Para cada movimento, verificar se está mais perto da saída, atravessa paredes ou sai do mapa,
  // verificar distancia ao final e somar quantidade de movimentos restantes
  for (const movement of path) {
    switch (movement) {
      case 'U':
        currPosition.line--;
        break;
      case 'D':
        currPosition.line++;
        break;
      case 'R':
        currPosition.col++;
        break;
      case 'L':
        currPosition.col--;
        break;
      default:
        throw new Error('Invalid movement');
    }
    if (hitsWall(maze[currPosition.line][currPosition.col])) {
      fitness++;
    }
    if (outOfMaze(currPosition, limits)) {
      fitness++;
    }
  }
  fitness += nOfMovementsToExit(currPosition, exit);
}

const characters = 'UDRL';

/**
 * Tries to find a path that solves the maze using the Simulated Annealing method
 * @param maze
 * @param entrance
 * @param exit
 */
export function findPath(maze, { entrance, exit }) {
  const limits = {
    top: 0, bottom: maze.length - 1, right: maze[0].length - 1, left: 0,
  };

  const initialPath = generateString(characters, maze.length * 3);
  const workingPath = fitness(maze, entrance, exit, limits, initialPath);
  if (workingPath) {
    console.log('Random path already working');
  }
}

/**
 * Generates a string using the given characters
 * @param usedCharacters - characters that will compose the string
 * @param length - length of the string
 * @returns {string} - random string
 */
function generateString(usedCharacters, length) {
  let result = '';
  const charactersLength = usedCharacters.length;
  for (let i = 0; i < length; i++) {
    result += usedCharacters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
