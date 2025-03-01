package main

import (
	"errors"
	"fmt"
	"github.com/bauerbrun0/youtube-downloader/internal/validator"
	"github.com/bauerbrun0/youtube-downloader/internal/ytdlp"
	errorPage "github.com/bauerbrun0/youtube-downloader/ui/pages/error"
	homePage "github.com/bauerbrun0/youtube-downloader/ui/pages/home"
	infoPage "github.com/bauerbrun0/youtube-downloader/ui/pages/info"
	"github.com/invopop/ctxi18n/i18n"
	"net/http"
	"net/url"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	app.render(r.Context(), w, r, homePage.Page())
}

func (app *application) homePost(w http.ResponseWriter, r *http.Request) {
	var form homePage.HomeForm
	err := app.decodePostForm(r, &form)
	if err != nil {
		app.clientError(w, r, err)
		return
	}

	form.CheckField(validator.NotBlank(form.Url), "url", i18n.T(r.Context(), "home.blank_url"))
	form.CheckField(validator.ValidYoutubeContentUrl(form.Url), "url", i18n.T(r.Context(), "home.not_youtube_url"))

	if !form.Valid() {
		app.render(r.Context(), w, r, homePage.Form(form))
		return
	}

	w.Header().Set("HX-Redirect", fmt.Sprintf("/%s", url.QueryEscape(form.Url)))
}

func (app *application) watchAndPlaylist(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	query := r.URL.RawQuery
	youtubeUrl := fmt.Sprintf("https://www.youtube.com%s/%s", path, query)
	http.Redirect(w, r, fmt.Sprintf("/%s", url.QueryEscape(youtubeUrl)), http.StatusSeeOther)
}

func (app *application) infoLoading(w http.ResponseWriter, r *http.Request) {
	path := r.URL.RawPath[1:]

	app.render(r.Context(), w, r, infoPage.LoadingPage(path))
}

func (app *application) info(w http.ResponseWriter, r *http.Request) {
	err, video, playlist := ytdlp.GetInfo(r.URL.Path[6:])

	if err != nil {
		if errors.Is(err, ytdlp.ErrYouTubeResourceNotFound) {
			app.render(r.Context(), w, r, errorPage.ErrorPage(i18n.T(r.Context(), "error.resource_not_found")))
			return
		}

		app.render(r.Context(), w, r, errorPage.ErrorPage(i18n.T(r.Context(), "error.server_error")))
		app.logger.Error("A server error occurred", "error", err.Error())
		return
	}

	if video != nil {
		app.render(r.Context(), w, r, infoPage.VideoInfoPage(*video))
		return
	}

	app.render(r.Context(), w, r, infoPage.PlaylistInfoPage(*playlist))
}

func (app *application) setLanguage(w http.ResponseWriter, r *http.Request) {
	locale := r.PathValue("locale")
	if locale == "" {
		locale = "en"
	}

	if locale != "en" && locale != "hu" {
		locale = "en"
	}

	languageCookie := createLanguageCookie(locale)
	http.SetCookie(w, languageCookie)

	referer := r.Referer()
	if referer == "" {
		referer = "/"
	}
	http.Redirect(w, r, referer, http.StatusSeeOther)
}
