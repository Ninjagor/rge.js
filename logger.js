const originalLog = console.log;
const originalError = console.error;
const originalOnError = console.onerror;

class ConsoleLogger {
	constructor() {
		this.logs = []
	}
}

const CL = new ConsoleLogger();

export function getLogs() {
	return CL.logs;
}

let isReset = false;

export function resetLogger() {
	console.log = originalLog;
	console.error = originalError;
	console.onerror = originalOnError;
}



// console.log has protections built in to prevent recursive calling of it (which would result in an infinite loop of console.log's). console.error does not have this built in as it is not needed.
let isLogging = false;
console.log = function(...args) {
	const optOut = args.some(arg => arg && arg.optOut === true);
	if (optOut) {
		originalLog.apply(console, args);
		return;
	}

	if (!isLogging) {
		isLogging = true
		CL.logs.push({
			type: "log",
			message: args
		});
		originalLog.apply(console, args);
		isLogging = false
	} else {

		originalLog.apply(console, args);
	}
}

console.error = function(...args) {
	CL.logs.push({
		type: "thrown_error",
		message: args
	});

	originalError.apply(console, args);
}

if (typeof window !== "undefined") {
    window.onerror = function(message, source, lineno, colno, error) {
        if (!isReset) {
            CL.logs.push(
                {
                    type: "window_error",
                    message: { message, source, lineno, colno, error }
                }
            );
            originalError('Uncaught error:', message, 'at', source, 'line', lineno, 'column', colno, 'error object:', error);
        }
    };
}
