export function dontThrow(fn: () => any): boolean {
	try {
		fn();
		return true;
	} catch {
		return false;
	}
}