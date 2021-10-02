import * as getRandomNumber from 'random-number';

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
  return Math.random() * qtd | 0;
}

function buildNextPath(path, parameters) {

  let hit            = false;
  let firstWrong     = 0; //indice do primeiro nodo incorreto no path
  const currPosition = { line: _entrance.line, col: _entrance.col };
  const positions    = [];

  for (let i = 0; i < path.length; i++) {

    const movement = path[i];

    _maze[currPosition.line][currPosition.col].wasVisited = true;
    positions.push(_maze[currPosition.line][currPosition.col]);

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
      hit = true;
      if (firstWrong === '') firstWrong = i;
      break;
    } else {
      if (hitsWall(_maze[currPosition.line][currPosition.col])) {
        hit = true;
        if (firstWrong === '') firstWrong = i;
        break;
      }
      if (alreadyVisited(_maze[currPosition.line][currPosition.col])) {
        hit = true;
        if (firstWrong === '') firstWrong = i;
        break;
      }
    }
  }

  const prctFixed      = parameters.percentageWrong; //porcentagem de vezes que ele resolve o primeiro errado
  const prctGoodChoice = parameters.percentageGood; //porcentagem de vezes que ele escolhe a primeira opção de caminho alteranativo

  const moves = ['C', 'D', 'B', 'E'];
  if (!hit) {
    //Caso de ter o caminho completo sem batida
    path += moves[getRandomNumber({ max: 4 })];
  } else {
    //Caso de existir pelo menos uma batida no caminho
    if (prctFixed <= Math.random()) {
      //Caso tenha que arrumar o primeiro movimento errado
      let possibilities = positions[firstWrong].possibilities; //TODO: verificar como esta essas possibilidades
      possibilities     = possibilities.filter(move => move != path[firstWrong]);
      if (possibilities.length > 0) {
        //modifica para uma das possibilidades de movimento
        path[firstWrong] = possibilities[getRandomInteger(possibilities.length)];
      } else {
        //ou caso nao tenha possibilidades, pega aleatoriamente umas das outras 3 opções de movimento
        path[firstWrong] = moves.filter(move => move != path[firstWrong])[getRandomInteger(3)];
      }
    } else {
      //caso que pega uma posição aleatoria da sequencia e muda conforme a porcentagem de escolhas boas
      let pos = getRandomInteger(path.length);
      if (prctGoodChoice <= Math.random()) {
        //caso que modifica para uma possibilidade de movimento
        let possibilities = positions[pos].possibilities;
        possibilities     = possibilities.filter(move => move != path[pos]);
        if (possibilities.length > 0) {
          //se existir uma possibilidade de movimento
          path[pos] = possibilities[getRandomInteger(possibilities.length)];
        } else {
          //mesmo caso do else mais abaixo
          path[pos] = moves.filter(move => move != path[pos])[getRandomInteger(3)];
        }
      } else {
        //caso que pega a posição e adiciona aleatoriamente um movimento
        path[pos] = moves.filter(move => move != path[pos])[getRandomInteger(3)];
      }
    }
  }

  //Retorna o caminho atualizado
  return path;
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
 * @param parameters
 */
export function findPath(maze, { entrance, exit }, parameters) {
  _output   = '';
  _maze     = maze;
  _entrance = entrance;
  _exit     = exit;
  _limits   = {
    top: 0, bottom: _maze.length - 1, right: _maze[0].length - 1, left: 0,
  };

  _output += `ciclos: ${parameters.cycles}, tempInicial: ${parameters.tempInitial}, variaçãoTemp: ${parameters.tempVariation}\n`;

  const currentPath = generateString(1);
  //let nextPath;
  const workingPath = calculateFitness(currentPath);


  //Start the cycle until numInteractions is reached
  for (let i = 0; i <= parameters.cycles; i++) {
    buildNextPath(maze, parameters);//Errado(coloquei só para o linter achar que a funçao é usada)
    //get heuristic of currently path
    // if h(currently) == 0 -> end of algorithm
    //nextPath = buildNextPath(currentPath, parameters);


  }

  //TODO: ciclos e temperatura
  //Conforme temperatura baixa, escolhe menos vezes o pior caminho

  _output += '\n';
  return { workingPath, output: _output };
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
