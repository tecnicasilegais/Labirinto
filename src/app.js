export function teste() {
  let output = '';
  for (let i = 0; i < 25; i++) {
    output += `${i}\n`;
  }
  return output;
}

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
    if (nextPos[0] === exit[0]
        && nextPos[1] === exit[1]) {
      console.log('Arrived at exit');
    }
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
