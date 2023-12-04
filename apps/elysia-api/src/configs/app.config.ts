const port = Bun.env.PORT ?? 8080;
const mode = Bun.env.MODE ?? "development";

if (typeof port === "string" && isNaN(parseInt(port))) {
	throw new Error(`Invalid port number: ${port}`);
}

if (mode !== "development" && mode !== "production") {
	throw new Error(`Invalid mode: ${mode}`);
}

export default {
	port: typeof port === "string" ? parseInt(port) : port,
	mode,
};
