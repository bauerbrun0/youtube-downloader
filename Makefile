# run templ generation in watch mode to detect all .templ files and
# re-create _templ.txt files on change, then send reload event to browser.
dev/templ:
	templ generate --watch --proxy="http://localhost:4000" --proxyport 8080 --proxybind "0.0.0.0" --open-browser=false -v

# run air to detect any go file changes to re-build and re-run the server.
dev/server:
	go run github.com/cosmtrek/air@v1.51.0 \
	--build.cmd "go build -o tmp/bin/web ./cmd/web" --build.bin "tmp/bin/web --dev" --build.delay "100" \
	--build.exclude_dir "node_modules" \
	--build.include_ext "go" \
	--build.stop_on_error "false" \
	--misc.clean_on_exit true

# run tailwindcss to generate the main.css bundle in watch mode.
dev/tailwind:
	npx --yes tailwindcss -i ./ui/css/input.css -o ./ui/static/css/main.css --minify --watch

# watch for any js or css change in the ui/static/ folder, then reload the browser via templ proxy.
dev/sync_static:
	go run github.com/cosmtrek/air@v1.51.0 \
	--build.cmd "templ generate --notify-proxy --proxyport 8080 --proxybind \"0.0.0.0\"" \
	--build.bin "true" \
	--build.delay "100" \
	--build.exclude_dir "" \
	--build.include_dir "ui/static" \
	--build.include_ext "js,css"

# runs an npm script which uses concurrently to run the four dev/ commands above.
# $ make -j4 ... would only work if dev/tailwind is specified as the first command for some reason
# also, concurrently supports prefixing the output of each command with the name of the command, and
# issuing Ctrl+C seems to work better with concurrently.
dev:
	npm run dev
