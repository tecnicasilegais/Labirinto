import * as getRandomNumber from 'random-number';
import CloneDeep            from 'lodash/cloneDeep';

const characters = 'UDRL';
let _maze;
let _entrance;
let _exit;
let _limits;
let _output;
let _path;

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
      father = populatio[second];
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
    child = [];

    for (let i = 0; i < mother.length; i++) {
      element = (mother[i] + father[i]) / 2;
      child.push(element);
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
  //here we need to set up the model with the population weights
    //the neural network is supposed to give us a score with the current path
    //if the neural network find the path, set _path to finish the execution 
  //need to return a list with each chromossome fitness, so that we can build the next population
}

export function findPath(maze, { entrance, exit }, parameters, output) {
  _output   = output;
  _maze     = maze;
  _entrance = entrance;
  _exit     = exit;
  _limits   = {
    top: 0, bottom: _maze.length - 1, right: _maze[0].length - 1, left: 0,
  };
  _path     = '';

  _output += `ciclos: ${parameters.cycles.value}, tempInicial: ${parameters.tempInitial.value}, `;
  _output += `variaçãoTemp: ${parameters.tempVariation.value}, chanceRuim: ${parameters.percentageWrong.value}, `;
  _output += `chanceBom: ${parameters.percentageGood.value}, pesoSaída: ${parameters.fitnessWeight.pathExit.value}, `;
  _output += `pesoRepetição: ${parameters.fitnessWeight.pathRepeat.value}\n`;

  let population = populationInitialization();
  let fitness = calculateFitness(population);
  _output += 'Procura pelo caminho iniciado\n';
  //Start the cycle until numInteractions is reached
  for (let i = 0; i <= parameters.cycles.value; i++) {
    _output += `Ciclo ${i}`;

    population = buildNextPopulation(population, fitness, parameters.percentageMutation.value);
    fitness = calculateFitness(population);
    
    if( _path !== ''){
      break;
    }
  }
  _output += `Final path: ${_path}\n`;
  _output += '\n';
  return { workingPath: _path, output: _output };
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
