import * as getRandomNumber from 'random-number';

const characters = 'UDRL';
let _maze;
let _entrance;
let _exit;
let _limits;
let _path;

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

function populationInitialization() {
  //start population with weights of each neuron in the network
  //supposed to be 10 chromosomes each having 44 genes
  //each weight need to be between -1 and 1
  let chromosomes = 10;
  let genes = 44;
  const population = [];

  for (let chromo = 0; chromo < chromosomes; chromo++) {
    let chromosome = [];
    for (let g = 0; g < genes; g++) {
      chromosome.push((Math.random() * 2) - 1);
    }
    population.push(chromosome);
  }

  return population;
}

function buildNextPopulation(population, fitness, percentageMutation) {
  const nextPopulation = [];
  //get the biggest fitness position
  let biggest = 0;
  let pos = 0;
  for (let i = 0; i < fitness.length; i++) {
    const element = fitness[i];
    if (element > biggest) {
      pos = i;
    }
  }
  //with the biggest one, send it to the next population
  nextPopulation.push(population[pos]);

  //now its time to tournament
  while (nextPopulation.length < 10) {
    let father = [];
    let mother = [];
    let first = 0;
    let second = 0;

    //get the father, choosing the best between two chosen randomly

    first = getRandomInteger(population.length);
    second = getRandomInteger(population.length);

    if(fitness[first] >= fitness[second]){
      father = population[first];
    }else{
      father = population[second];
    }

    //get the mother, choosing the best between two chosen randomly

    first = getRandomInteger(population.length);
    second = getRandomInteger(population.length);

    if(fitness[first] >= fitness[second]){
      mother = population[first];
    }else{
      mother = population[second];
    }

    //now the crossover
    let child = [];

    for (let i = 0; i < mother.length; i++) {
      child.push((mother[i] + father[i]) / 2);
    }

    nextPopulation.push(child);
  }

  //now the mutation

  if (percentageMutation <= Math.random()){
    let chromosome = getRandomInteger(nextPopulation.length);
    let gene = getRandomInteger(nextPopulation[0].length);
    nextPopulation[chromosome][gene] = (Math.random() * 2) - 1;
  }

  return nextPopulation;

}

function calculateFitness(population) {
  console.log(population);
  //here we need to set up the model with the population weights
  //the neural network is supposed to give us a score with the current path
  //if the neural network find the path, set _path to finish the execution
  //need to return a list with each chromossome fitness, so that we can build the next population
}

export function findPath(maze, positions, parameters) {
  // ====== JUST TO STOP ERRORS TEMPORARILY ======
  alreadyVisited();
  hitsWall();
  outOfMaze();
  nOfMovementsToExit();
  populationInitialization();
  buildNextPopulation();
  console.log(_entrance);
  // ====== JUST TO STOP ERRORS TEMPORARILY ======

  _maze     = maze;
  _entrance = positions.entrance;
  _exit     = positions.exit;
  _limits   = {
    top: 0, bottom: _maze.length - 1, right: _maze[0].length - 1, left: 0,
  };
  _path     = '';

  sendStatus('started');

  let { cycles, percentageMutation } = parameters;

  let population = populationInitialization();
  let fitness = calculateFitness(population);
  writeOutput('Procura pelo caminho iniciado\n');
  //Start the cycle until numInteractions is reached
  for (let i = 0; i <= cycles; i++) {
    writeOutput(`Ciclo ${i}`);

    population = buildNextPopulation(population, fitness, percentageMutation);
    fitness = calculateFitness(population);

    if( _path !== ''){
      break;
    }
  }
  sendStatus('finished');

  writeOutput(`Final path: ${_path}\n`);
  writeOutput('\n');
  return _path;
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
