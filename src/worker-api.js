import Worker from 'worker-loader!./app';

const worker     = new Worker();
worker.onmessage = function (msg) {
  console.log('got msg from app ', msg);
};

export function sendMessage(msg) {
  worker.postMessage(msg);
}
