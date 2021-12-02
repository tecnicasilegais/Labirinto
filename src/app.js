import CloneDeep from 'lodash/cloneDeep';
import Rede      from './Rede/Rede';

let _maze;
let _entrance;
let _exit;
let _limits;
let _path;
let _coins;

function alreadyVisited(currPosition) {
    return _maze[currPosition.line][currPosition.col].wasVisited === true;
}

/**
 * Checks if current position hitted a wall
 * @param position - position to check contents
 * @returns {boolean} - boolean indicating if a wall was hit
 */
function hitsWall(position) {
    return _maze[position.line][position.col] === '1';
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
    let chromosomes  = 10;
    let genes        = 44;
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

/**
 * Create the next population with the current population and fitness
 * @param population - current population
 * @param fitness - current fitness
 * @param percentageMutation - percentage of mutation
 * @returns New population
 */
function buildNextPopulation(population, fitness, percentageMutation) {
    const nextPopulation = [];
    //get the biggest fitness position
    let biggest          = 0;
    let pos              = 0;
    for (let i = 0; i < fitness.length; i++) {
        const element = fitness[i];
        if (element > biggest) {
            biggest = element;
            pos     = i;
        }
    }
    //with the biggest one, send it to the next population
    nextPopulation.push(population[pos]);

    //now its time to tournament
    while (nextPopulation.length < 10) {
        let father = [];
        let mother = [];
        let first  = 0;
        let second = 0;

        //get the father, choosing the best between two chosen randomly

        first  = getRandomInteger(population.length);
        second = getRandomInteger(population.length);

        if (fitness[first] >= fitness[second]) {
            father = population[first];
        } else {
            father = population[second];
        }

        //get the mother, choosing the best between two chosen randomly

        first  = getRandomInteger(population.length);
        second = getRandomInteger(population.length);

        if (fitness[first] >= fitness[second]) {
            mother = population[first];
        } else {
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

    if (percentageMutation <= Math.random()) {
        let chromosome                   = getRandomInteger(nextPopulation.length);
        let gene                         = getRandomInteger(nextPopulation[0].length);
        nextPopulation[chromosome][gene] = (Math.random() * 2) - 1;
    }

    return nextPopulation;

}

/**
 * Get sides of the current position in the maze
 * @param position - Current position
 * @returns Sides of the current position and the number of moves to exit
 */
function getSides(position) {
    let sides = [];
    //add up position
    if (position.line - 1 < _limits.top) sides.push(1);
    else sides.push(_maze[position.line - 1][position.col]);

    //add down position
    if (position.line + 1 < _limits.bottom) sides.push(1);
    else sides.push(_maze[position.line + 1][position.col]);

    //add left position
    if (position.col - 1 < _limits.left) sides.push(1);
    else sides.push(_maze[position.line][position.col - 1]);

    //add up position
    if (position.col + 1 > _limits.right) sides.push(1);
    else sides.push(_maze[position.line][position.col + 1]);

    sides.push(nOfMovementsToExit(position));

    return sides;
}

function calculateFitness(population) {

    let fitnessArray = [];
    let model        = new Rede(5, 4);
    let cMaze        = CloneDeep(_maze);
    //TODO: how to deal with path in front-end maze?
    //"push position"(best) or movements?
    let path = []; // or  = '';

    for (const chromossome in population) {
        let currentFitness = 0;
        const currPosition = { line: _entrance.line, col: _entrance.col };
        //here we need to set up the model with the population weights
        model.setModelWeights(5, chromossome);
        let finish = false;
        while (!finish) {
            //get the sides positions
            let entrance = getSides(currPosition);
            //send to the model and get the biggest move
            let out      = model.propagation(entrance);
            let biggest  = out[0];
            let pos      = 0;
            for (let i = 1; i < out.length; i++) {
                const element = out[i];
                if (biggest < element) {
                    biggest = element;
                    pos     = i;
                }
            }

            switch (pos) {
                case 0://up
                    currPosition.line -= 1;
                    break;
                case 1://down
                    currPosition.line += 1;
                    break;
                case 2://left
                    currPosition.col -= 1;
                    break;
                case 3://right
                    currPosition.col += 1;
                    break;
            }

            //TODO: current position equal to the exit position
            //finish the execution sending
            if (currPosition.line == _exit.line && currPosition.col == _exit.col) {
                path.push(currPosition);
                _path  = path;
                finish = true;
            } else if (outOfMaze(currPosition) || alreadyVisited(currPosition) || hitsWall(currPosition)) {
                break;
            } else {
                path.push(currPosition);
                cMaze[currPosition.line][position.col].wasVisited = true;
                currentFitness += 1;
                //TODO: check if there is a coin and sum a value. What is the best value? 10?
                //if(cMaze[currPosition.line][position.col] == "    COIN??????    ") currentFitness += 10;
            }
        }
        fitnessArray.push(currentFitness);
        if (finish) break;
    }
    return fitnessArray;
}

export function findPath(maze, positions, parameters) {
    // ====== JUST TO STOP ERRORS TEMPORARILY ======
    alreadyVisited();
    hitsWall();
    outOfMaze();
    nOfMovementsToExit();
    populationInitialization();
    buildNextPopulation();
    addCoins(50);
    console.log(_entrance);
    // ====== JUST TO STOP ERRORS TEMPORARILY ======
    //TODO: what is the dict of the maze,
    //walls and out is 1? coins is ''? free space is 0?


    _maze     = maze;
    _entrance = positions.entrance;
    _exit     = positions.exit;
    _limits   = {
        top: 0, bottom: _maze.length - 1, right: _maze[0].length - 1, left: 0,
    };
    _coins    = 0;
    _path     = '';

    sendStatus('started');

    let { cycles, percentageMutation } = parameters;

    let population = populationInitialization();
    let fitness    = calculateFitness(population);
    writeOutput('Procura pelo caminho iniciado\n');
    //Start the cycle until numInteractions is reached
    for (let i = 0; i <= cycles; i++) {
        writeOutput(`Ciclo ${i}`);

        population = buildNextPopulation(population, fitness, percentageMutation);
        fitness    = calculateFitness(population);
        //TODO: "array of position"(best) or string of movements
        if (_path !== '') {
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

function addCoins(nCoins) {
    _coins += nCoins;
    postMessage({
        contentType: 'status',
        statusType:  'coins',
        content:     _coins,
    });
}

function sendResult(msg) {
    postMessage({
        contentType: 'result',
        content:     msg,
    });
}

function sendStatus(msg) {
    postMessage({
        contentType: 'status',
        statusType:  'execution',
        content:     msg,
    });
}

function writeOutput(str) {
    postMessage({
        contentType: 'console',
        content:     str,
    });
}
