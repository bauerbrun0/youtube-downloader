package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/invopop/ctxi18n"
	"net/http"

	"github.com/bauerbrun0/youtube-downloader/internal/appctx"
)

func (app *application) disableCacheInDevMode(next http.Handler) http.Handler {
	if !app.dev {
		return next
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}

func commonHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// w.Header().Set("Content-Security-Policy",
		// 	"default-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com",
		// )

		w.Header().Set("Referrer-Policy", "origin-when-cross-origin")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "deny")
		w.Header().Set("X-XSS-Protection", "0")

		w.Header().Set("Server", "Go")

		next.ServeHTTP(w, r)
	})
}

func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				app.serverError(w, r, fmt.Errorf("%s", err))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func (app *application) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var (
			ip     = r.RemoteAddr
			proto  = r.Proto
			method = r.Method
			uri    = r.URL.RequestURI()
		)

		app.logger.Info("received request", "ip", ip, "proto", proto, "method", method, "uri", uri)

		next.ServeHTTP(w, r)
	})
}

func (app *application) languageMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var locale string
		cookie, err := r.Cookie("lang")
		if err != nil {
			switch {
			case errors.Is(err, http.ErrNoCookie):
				locale = "en"
				languageCookie := createLanguageCookie(locale)
				http.SetCookie(w, languageCookie)
			default:
				app.serverError(w, r, err)
				return
			}
		} else {
			locale = cookie.Value
		}

		if locale != "en" && locale != "hu" {
			locale = "en"
		}

		ctx, err := ctxi18n.WithLocale(r.Context(), locale)
		if err != nil {
			app.serverError(w, r, err)
			return
		}
		ctx = context.WithValue(ctx, appctx.LanguageContextKey, locale)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (app *application) themeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var theme string
		cookie, err := r.Cookie("theme")
		if err != nil {
			switch {
			case errors.Is(err, http.ErrNoCookie):
				theme = "system"
				themeCookie := createThemeCookie(theme)
				http.SetCookie(w, themeCookie)
			default:
				app.serverError(w, r, err)
				return

			}
		} else {
			theme = cookie.Value
		}

		if theme != "light" && theme != "dark" && theme != "system" {
			theme = "system"
		}

		ctx := context.WithValue(r.Context(), appctx.ThemeContextKey, theme)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
