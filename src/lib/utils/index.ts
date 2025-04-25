export function generatePromise<T>() {
	let resolve: ((val: T | PromiseLike<T>) => void) | null = null;
	let reject: ((reason: T) => void) | null = null;

	let promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	return { resolve, reject, promise };
}
