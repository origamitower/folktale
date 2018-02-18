//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// See https://github.com/origamitower/folktale/issues/174 for details

const { task } = require('folktale/concurrency/task');

it('concurrency Regression: chained tasks are not cancelled if partially settled', (done) => {
  const started = [];
  const finished = [];
  let isCancelled = false;

  const delay = (ms, data) => task(resolver => {
    started.push(data);
    const timer = setTimeout(() => {
      finished.push(data);
      if (isCancelled)  return;
      resolver.resolve(data)
    }, ms);
    resolver.onCancelled(() => clearTimeout(timer));
  });

  const chain = delay(100, 'a')
    .chain(x => delay(100, 'b'))
    .chain(x => delay(100, 'c'));

  const execution = chain.run();
  setTimeout(() => {
    isCancelled = true;
    execution.cancel()
  }, 150);

  execution.listen({
    onCancelled: () => {
      if (started.join(',') === 'a,b' && finished.join(',') === 'a') {
        done(null);
      } else {
        done(new Error(`Task was cancelled, but expected a and b to be started, but only a to be finished. 
Got ${started.join(', ')} started and ${finished.join(', ')} finished`));
      }
    },

    onResolved: () => {
      done(new Error(`Expected task chain to be cancelled, but they were resolved.`));
    },

    onRejected: () => {
      done(new Error(`Expected task chain to be cancelled, but they were rejected.`));
    }
  })


});