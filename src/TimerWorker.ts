/* eslint-disable no-restricted-globals */
self.onmessage = (e: MessageEvent<string>) => {
  setInterval(() => {
    postMessage("tick-back");
  }, 1000);
};

export {};
