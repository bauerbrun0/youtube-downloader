export function fullyDecodeURIComponent(str: string): string {
	let prev: string;
	let decoded = str;

	do {
		prev = decoded;
		decoded = decodeURIComponent(decoded);
	} while (prev !== decoded);

	return decoded;
}