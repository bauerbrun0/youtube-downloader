package main

import (
	"context"
	"errors"
	"github.com/a-h/templ"
	"github.com/go-playground/form"
	"github.com/invopop/ctxi18n"
	"log/slog"
	"net/http"

	"github.com/bauerbrun0/youtube-downloader/internal/locales"
)

func (app *application) render(ctx context.Context, w http.ResponseWriter, r *http.Request, t templ.Component) {
	err := t.Render(ctx, w)
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) serverError(w http.ResponseWriter, r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	app.logger.Error(err.Error(), slog.String("method", method), slog.String("uri", uri))
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func (app *application) clientError(w http.ResponseWriter, r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	app.logger.Error(err.Error(), slog.String("method", method), slog.String("uri", uri))
	http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
}

func (app *application) decodePostForm(r *http.Request, dst any) error {
	err := r.ParseForm()
	if err != nil {
		return err
	}

	err = app.formDecoder.Decode(dst, r.PostForm)
	if err != nil {
		var invalidDecoderError *form.InvalidDecoderError
		if errors.As(err, &invalidDecoderError) {
			panic(err)
		}
		return err
	}
	return nil
}

func loadLanguages() error {
	return ctxi18n.Load(locales.Content)
}

func createLanguageCookie(locale string) *http.Cookie {
	return &http.Cookie{
		Name:     "lang",
		Value:    locale,
		Path:     "/",
		MaxAge:   0,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}
}

func createThemeCookie(theme string) *http.Cookie {
	return &http.Cookie{
		Name:     "theme",
		Value:    theme,
		Path:     "/",
		MaxAge:   0,
		HttpOnly: false,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}
}
