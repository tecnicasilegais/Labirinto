import { findPath } from '@/app';

onmessage = e => {
  let data = e.data;
  console.log('worker got ', data);
  teste();
  let result = findPath(data.maze, data.position, data.parameters);
  console.log(result);
};

function teste() {
  console.log('testei foda');
}
