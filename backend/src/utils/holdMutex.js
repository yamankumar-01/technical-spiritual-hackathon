/**
 * In-process per-key asynchronous mutex lock.
 * Serializes concurrent requests targeting the same key (e.g. problemId)
 * to guarantee atomic capacity verification and hold acquisition without race conditions.
 */
class KeyedMutex {
  constructor() {
    this.locks = new Map();
  }

  async runExclusive(key, asyncFn) {
    const stringKey = String(key);
    let currentPromise = this.locks.get(stringKey) || Promise.resolve();

    let release;
    const nextPromise = new Promise((resolve) => {
      release = resolve;
    });

    // Chain the next task onto the current promise queue
    this.locks.set(stringKey, currentPromise.then(() => nextPromise));

    try {
      await currentPromise;
      return await asyncFn();
    } finally {
      release();
      // Clean up map entry if this was the last chained promise
      if (this.locks.get(stringKey) === nextPromise) {
        this.locks.delete(stringKey);
      }
    }
  }
}

export const problemMutex = new KeyedMutex();
