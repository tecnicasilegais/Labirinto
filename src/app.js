export function findPath(maze, { entrance, exit }) {
  const limits = {
    top: 0, bottom: maze.length - 1, right: maze[0].length - 1, left: 0,
  };

  const initialPath = generateString(maze.length * 3);
  const workingPath = testPath(maze, { entrance, exit }, limits, initialPath);
  if (workingPath) {
    console.log('Random path already working');
  }
}

function testPath(maze, { entrance, exit }, limits, path) {
  let currPos = entrance;
  let nextPos;

  for (const movement of path) {
    switch (movement) {
      case 'C':
        nextPos = [currPos[0]--, currPos[1]];
        break;
      case 'B':
        nextPos = [currPos[0]++, currPos[1]];
        break;
      case 'D':
        nextPos = [currPos[0], currPos[1]++];
        break;
      case 'E':
        nextPos = [currPos[0], currPos[1]--];
        break;
      default:
        break;
    }
    if (nextPos[0] < limits.top || nextPos[0] > limits.bottom
        || nextPos[1] < limits.left || nextPos[1] > limits.right) {
      console.log('Out of limits');
      return false;
    }
    if (...nextPos == ...exit)
    currPos = [...nextPos];
  }
  return false;
}

const characters = 'CBDE';

function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

(function (logger, ...args) {
  console.old = console.log;
  console.log = function () {
    let output = '';
    let arg;
    let i;

    for (i = 0; i < arguments.length; i++) {
      arg = args[i];
      output += `<span class="log-${typeof arg}">`;

      if (
        typeof arg === 'object'
        && typeof JSON === 'object'
        && typeof JSON.stringify === 'function'
      ) {
        output += JSON.stringify(arg);
      } else {
        output += arg;
      }

      output += '</span>&nbsp;';
    }

    logger.innerHTML += `${output}<br>`;
    console.old.apply(undefined, args);
  };
})(document.getElementById('logger'));
