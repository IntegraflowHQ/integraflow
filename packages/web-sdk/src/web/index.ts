import Integraflow from '../index';

type CmdFn = (k: Integraflow) => void;
type Cmd = string | CmdFn;
type QueuedCommand = [Cmd, ...any[]];
type LazyIntegraflow = { q?: QueuedCommand[] };

interface Win extends Window {
  Integraflow?: LazyIntegraflow;
}

declare var window: Win;

function main() {
  if (!window.Integraflow?.q) {
    return;
  }

  const q = window.Integraflow.q;
  const init = q.find(item => item[0] === 'init');

  if (init?.length !== 2) {
    return;
  }

  if (location.protocol !== 'https:') {
    console.warn(
      'Integraflow: this page is not served over HTTPS, some features may be unavailable...'
    );
  }

  const instance = Integraflow.init(init[1]);
  const executor = function (cmd: Cmd, ...args: any[]) {
    try {
      if (typeof cmd === 'function') {
        cmd(instance);
      } else {
        (instance as any)[cmd](...args);
      }
    } catch (e) {
      console.error(e);
    }
  };

  for (let i = 0; i < q.length; ++i) {
    const cmd = q[i][0];

    if (cmd === 'init') {
      continue;
    }

    executor(...q[i]);
  }

  (window.Integraflow as any) = executor;
}

main();
