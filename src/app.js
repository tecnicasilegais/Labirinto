import * as getRandomNumber from 'random-number';

const characters = 'UDRL';
let _maze;
let _entrance;
let _exit;
let _limits;

function alreadyVisited(visitedPositions, currPosition) {
  return visitedPositions[currPosition.line]?.[currPosition.col] === true;
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
  let visitedPositions  = {};

  for (let i = 0; i < path.length; i++) {
    walkedPositions.push(_maze[currPosition.line][currPosition.col]);

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
      if (hitsWall(_maze[currPosition.line][currPosition.col])) {
        if (!hit) {
          hit        = true;
          firstWrong = i;
        }
      }
      if (alreadyVisited(visitedPositions, currPosition)) {
        if (!hit) {
          hit        = true;
          firstWrong = i;
        }
      }
      (visitedPositions[currPosition.line] ??= {})[currPosition.col] ??= true;
    }
  }

  const prctFixed      = parameters.percentageWrong; //porcentagem de vezes que ele resolve o primeiro errado
  const prctGoodChoice = parameters.percentageGood; //porcentagem de vezes que ele escolhe a primeira opção de caminho alteranativo

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
  let fitness          = 0;
  let visitedPositions = {};

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
      fitness += weights.pathExit;
    } else {
      if (hitsWall(_maze[currPosition.line][currPosition.col])) {
        fitness += weights.pathWall;
      }
      if (alreadyVisited(visitedPositions, currPosition)) {
        fitness += weights.pathRepeat;
      }
      (visitedPositions[currPosition.line] ??= {})[currPosition.col] ??= true;
    }
  }

  const movToExit = nOfMovementsToExit(currPosition);
  fitness += movToExit;
  //_output += `indivíduo '${path}', aptidão '${fitness}', distânciaSaída '${movToExit}'\n`;
  return fitness;
}

onmessage = e => {
  let data = e.data;
  console.log('worker got in right place ', data);
  let result = findPath(data.maze, data.position, data.parameters);
  sendResult(result);
};

function sendResult(msg) {
  postMessage({
    contentType: 'result',
    content:     msg,
  });
}

function sendStatus(msg) {
  postMessage({
    contentType: 'status',
    content:     msg,
  });
}

function writeOutput(str) {
  postMessage({
    contentType: 'console',
    content:     str,
  });
}

/**
 * Tries to find a path that solves the maze using the Simulated Annealing method
 * @param maze
 * @param positions
 * @param parameters
 */
export function findPath(maze, positions, parameters) {
  _maze     = maze;
  _entrance = positions.entrance;
  _exit     = positions.exit;
  _limits   = {
    top: 0, bottom: _maze.length - 1, right: _maze[0].length - 1, left: 0,
  };

  sendStatus('started');

  let { cycles, percentageGood, percentageWrong, tempInitial, tempVariation, weight } = parameters;
  //let temperature                                                                     = parameters.tempInitial;
  //let tempVariation                                                                   = parameters.tempVariation;

  let currentPath    = generateString(1);
  let currentFitness = calculateFitness(currentPath, weight);
  let nextPath;
  let nextFitness;

  writeOutput(`ciclos: ${cycles}, tempInicial: ${tempInitial}, \`variaçãoTemp: ${tempVariation}\n`);
  writeOutput(`chanceBom: ${percentageGood}, chanceRuim: ${percentageWrong}\n`);
  writeOutput(`pesoRepetição: ${weight.pathRepeat}, pesoBatida:${weight.pathWall}, pesoSaída: ${weight.pathExit}\n`);
  writeOutput('Simulated Annealing iniciado\n');
  //Start the cycle until numInteractions is reached
  let cycleOutput;
  for (let i = 0; i <= cycles; i++) {
    cycleOutput = `Ciclo ${i}, \t Temperatura ${tempInitial}\n`;
    cycleOutput += `Solução atual: ${currentPath}\n`;

    if (currentFitness === 0) {
      break;
    }
    nextPath    = buildNextPath([...currentPath], parameters);
    nextFitness = calculateFitness(nextPath, weight);
    cycleOutput += `Solução vizinha: ${nextPath}\n`;

    let energy = nextFitness - currentFitness;
    if (energy <= 0) {
      currentPath    = nextPath;
      currentFitness = nextFitness;
    } else {
      let probability = Math.exp(-energy / tempInitial);
      let random      = getRandomNumber();
      if (random < probability) {
        cycleOutput += 'Aceitou solução pior\n';
        currentPath    = nextPath;
        currentFitness = nextFitness;
      }
    }
    tempInitial *= tempVariation;
    writeOutput(cycleOutput);
  }
  //Conforme temperatura baixa, escolhe menos vezes o pior caminho

  sendStatus('finished');

  writeOutput(`Final path: ${nextPath}\n`);
  writeOutput('\n');
  return nextPath;
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
