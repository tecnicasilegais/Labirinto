export function findPath(maze, { entrance, exit }) {
  const limits = {
    top: 0, left: 0, bottom: maze.length - 1, right: maze.length - 1,
  };

  const initialPath = generateString(maze.length * 3);
}

const characters = 'UDLR';

function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
