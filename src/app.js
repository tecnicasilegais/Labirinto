import * as getRandomNumber from 'random-number';
import CloneDeep            from 'lodash/cloneDeep';

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

/**
 * Return a random integer between 0 and the quantity sent as argument
 * @param qtd - current position
 * @returns {number} - Random integer
 */
function getRandomInteger(qtd) {
  return Math.floor(Math.random() * qtd);
}

function buildNextPath(path, parameters) {
  let hit               = false;
  let firstWrong        = null; //indice do primeiro nodo incorreto no path
  const currPosition    = { line: _entrance.line, col: _entrance.col };
  const walkedPositions = [];
  let cMaze             = CloneDeep(_maze);

  for (let i = 0; i < path.length; i++) {
    walkedPositions.push(cMaze[currPosition.line][currPosition.col]);

    const movement = path[i];
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
      if (!hit) {
        hit        = true;
        firstWrong = i;
      }
      break;
    } else {
      if (hitsWall(cMaze[currPosition.line][currPosition.col])) {
        if (!hit) {
          hit        = true;
          firstWrong = i;
        }
      }
      if (alreadyVisited(cMaze[currPosition.line][currPosition.col])) {
        if (!hit) {
          hit        = true;
          firstWrong = i;
        }
      }
      cMaze[currPosition.line][currPosition.col].wasVisited = true;
    }
  }

  const prctFixed      = parameters.percentageWrong.value; //porcentagem de vezes que ele resolve o primeiro errado
  const prctGoodChoice = parameters.percentageGood.value; //porcentagem de vezes que ele escolhe a primeira opção de caminho alteranativo

  const moves = ['U', 'R', 'D', 'L'];
  if (!hit) {
    //Caso de ter o caminho completo sem batida
    path.push(moves[getRandomInteger(3)]);
  } else {
    //Caso de existir pelo menos uma batida no caminho
    let rnd = getRandomNumber();
    if (prctFixed <= rnd) {
      //Caso tenha que arrumar o primeiro movimento errado
      let possibilities = walkedPositions[firstWrong].possiblePaths;
      possibilities     = possibilities.filter(move => move !== path[firstWrong]);
      if (possibilities.length > 0) {
        //modifica para uma das possibilidades de movimento
        path[firstWrong] = possibilities[getRandomInteger(possibilities.length)];
      } else {
        //ou caso nao tenha possibilidades, pega aleatoriamente umas das outras 3 opções de movimento
        path[firstWrong] = moves.filter(move => move !== path[firstWrong])[getRandomInteger(3)];
      }
    } else {
      //caso que pega uma posição aleatoria da sequencia e muda conforme a porcentagem de escolhas boas
      let pos  = getRandomInteger(path.length);
      let rnd2 = getRandomNumber();
      if (pos < walkedPositions.length && prctGoodChoice <= rnd2) {
        //caso que modifica para uma possibilidade de movimento
        let possibilities = walkedPositions[pos].possiblePaths;
        possibilities     = possibilities.filter(move => move !== path[pos]);
        if (possibilities.length > 0) {
          //se existir uma possibilidade de movimento
          path[pos] = possibilities[getRandomInteger(possibilities.length)];
        } else {
          //mesmo caso do else mais abaixo
          path[pos] = moves.filter(move => move !== path[pos])[getRandomInteger(3)];
        }
      } else {
        //caso que pega a posição e adiciona aleatoriamente um movimento
        path[pos] = moves.filter(move => move !== path[pos])[getRandomInteger(3)];
      }
    }
  }

  //Retorna o caminho atualizado
  return path;
}

function calculateFitness(path, weights) {
  let fitness = 0;
  let cMaze   = CloneDeep(_maze);

  const currPosition = { line: _entrance.line, col: _entrance.col };

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
    if (outOfMaze(currPosition)) {
      fitness += weights.pathExit.value;
    } else {
      if (hitsWall(cMaze[currPosition.line][currPosition.col])) {
        fitness++;
      }
      if (alreadyVisited(cMaze[currPosition.line][currPosition.col])) {
        fitness += weights.pathRepeat.value;
      }
      cMaze[currPosition.line][currPosition.col].wasVisited = true;
    }
  }

  const movToExit = nOfMovementsToExit(currPosition);
  fitness += movToExit;
  //_output += `indivíduo '${path}', aptidão '${fitness}', distânciaSaída '${movToExit}'\n`;
  return fitness;
}

/**
 * Tries to find a path that solves the maze using the Simulated Annealing method
 * @param maze
 * @param entrance
 * @param exit
 * @param parameters
 * @param output
 */
export function findPath(maze, { entrance, exit }, parameters, output) {
  _output   = output;
  _maze     = maze;
  _entrance = entrance;
  _exit     = exit;
  _limits   = {
    top: 0, bottom: _maze.length - 1, right: _maze[0].length - 1, left: 0,
  };

  _output += `ciclos: ${parameters.cycles.value}, tempInicial: ${parameters.tempInitial.value}, `;
  _output += `variaçãoTemp: ${parameters.tempVariation.value}, chanceRuim: ${parameters.percentageWrong.value}, `;
  _output += `chanceBom: ${parameters.percentageGood.value}, pesoSaída: ${parameters.fitnessWeight.pathExit.value}, `;
  _output += `pesoRepetição: ${parameters.fitnessWeight.pathRepeat.value}\n`;

  let temperature   = parameters.tempInitial.value;
  let tempVariation = parameters.tempVariation.value;

  let currentPath    = generateString(1);
  let currentFitness = calculateFitness(currentPath, parameters.fitnessWeight);
  let nextPath;
  let nextFitness;

  _output += 'Simulated Annealing iniciado\n';
  //Start the cycle until numInteractions is reached
  for (let i = 0; i <= parameters.cycles.value; i++) {
    _output += `Ciclo ${i}, \t Temperatura ${temperature}\n`;
    _output += `Solução atual: ${currentPath}\n`;

    if (currentFitness === 0) {
      break;
    }
    nextPath    = buildNextPath([...currentPath], parameters);
    nextFitness = calculateFitness(nextPath, parameters.fitnessWeight);
    _output += `Solução vizinha: ${nextPath}\n`;

    let energy = nextFitness - currentFitness;
    if (energy <= 0) {
      currentPath    = nextPath;
      currentFitness = nextFitness;
    } else {
      let probability = Math.exp(-energy / temperature);
      let random      = getRandomNumber();
      if (random < probability) {
        _output += 'Aceitou solução pior\n';
        currentPath    = nextPath;
        currentFitness = nextFitness;
      }
    }
    temperature *= tempVariation;
  }

  //Conforme temperatura baixa, escolhe menos vezes o pior caminho

  _output += `Final path: ${nextPath}\n`;
  _output += '\n';
  return { workingPath: nextPath, output: _output };
}

/**
 * Generates a string using the given characters
 * @param length - length of the string
 * @returns {string} - random string
 */
function generateString(length) {
  let result             = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
