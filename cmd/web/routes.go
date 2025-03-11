package main

import (
	"github.com/justinas/alice"
	"net/http"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./ui/static"))))

	mux.HandleFunc("GET /{$}", app.home)
	mux.HandleFunc("POST /{$}", app.homePost)
	mux.HandleFunc("POST /set-language/{locale}", app.setLanguage)

	mux.HandleFunc("GET /watch", app.watchAndPlaylist)
	mux.HandleFunc("GET /playlist", app.watchAndPlaylist)

	mux.HandleFunc("GET /info/", app.info)
	mux.HandleFunc("GET /{youtube_url}", app.infoLoading)

	mux.HandleFunc("POST /quick-download", app.quickDownload)
	mux.HandleFunc("GET /format-download/{formatId}", app.formatDownload)

	standard := alice.New(app.recoverPanic, app.logRequest, app.disableCacheInDevMode, commonHeaders, app.languageMiddleware, app.themeMiddleware)

	return standard.Then(mux)
}
