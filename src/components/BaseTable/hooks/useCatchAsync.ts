export function useCatchAsync(promise: Promise<any>) {
    return Promise.resolve(promise)
      .then((data) => ({ data, error: null, success: true }))
      .catch((error) => ({ data: null, error, success: false }))
  }