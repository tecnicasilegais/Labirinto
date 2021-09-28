import * as rn from 'random-number';

const characters = 'UDRL';
let _maze;
let _entrance;
let _exit;
let _limits;
let _output;

function alreadyVisited(cell) {
  return cell.wasVisited === true;
}

/**
 * Checks if moving to the next cell hits a wall
 * @param nextCell - cell to check contents
 * @returns {boolean} - boolean indicating if a wall was hit
 */
function hitsWall(nextCell) {
  return nextCell.content === '1';
}

/**
 * Checks if a given position is outside the bounds of the given top, bottom, right and left limits
 * @param position - position to check
 * @returns {boolean} - boolean indicating if the position is outside the maze
 */
function outOfMaze(position) {
  return position.line < _limits.top || position.line > _limits.bottom
         || position.col < _limits.left || position.col > _limits.right;
}

/**
 * Calculates number of movements from current position to exit position
 * @param currPos - current position
 * @returns {number} - number of movements to get to exit
 */
function nOfMovementsToExit(currPos) {
  return Math.abs(currPos.line - _exit.line) + Math.abs(currPos.col - _exit.col);
}

function calculateFitness(path) {
  let fitness = 0;

  const currPosition = { line: _entrance.line, col: _entrance.col };

  // Para cada movimento, verificar se está mais perto da saída, atravessa paredes ou sai do mapa,
  // verificar distancia ao final e somar quantidade de movimentos restantes
  for (const movement of path) {
    _maze[currPosition.line][currPosition.col].wasVisited = true;
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
    if (outOfMaze(currPosition)) {
      fitness++;
    } else {
      if (hitsWall(_maze[currPosition.line][currPosition.col])) {
        fitness++;
      }
      if (alreadyVisited(_maze[currPosition.line][currPosition.col])) {
        fitness++;
      }
    }
  }

  const movToExit = nOfMovementsToExit(currPosition);//TODO: Talvez problematico?
  fitness += movToExit;
  _output += `indivíduo '${path}', aptidão '${fitness}', distânciaSaída '${movToExit}'\n`;
  return fitness;
}

/**
 * Tries to find a path that solves the maze using the Simulated Annealing method
 * @param maze
 * @param entrance
 * @param exit
 */
export function findPath(maze, { entrance, exit }, parameters) {
  _output = '';
  _maze = maze;
  _entrance = entrance;
  _exit = exit;
  _limits = {
    top: 0, bottom: _maze.length - 1, right: _maze[0].length - 1, left: 0,
  };

  _output += `ciclos: ${parameters.cycles}, tempInicial: ${parameters.tempInitial}, variaçãoTemp: ${parameters.tempVariation}\n`;

  const initialPath = generateString(1);
  const workingPath = calculateFitness(initialPath);

  const randomNumber = rn();
  _output += `${randomNumber}\n`;

  //TODO: ciclos e temperatura
  //Conforme temperatura abaixa, muda menos os movimentos iniciais

  _output += '\n';
  return { workingPath, output: _output };
}

/**
 * Generates a string using the given characters
 * @param length - length of the string
 * @returns {string} - random string
 */
function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
