package main

import (
	"errors"
	"fmt"
	"github.com/invopop/ctxi18n/i18n"
	"net/http"
	"net/url"
	"time"

	"github.com/bauerbrun0/youtube-downloader/internal/validator"
	"github.com/bauerbrun0/youtube-downloader/internal/ytdlp"
	errorPage "github.com/bauerbrun0/youtube-downloader/ui/pages/error"
	homePage "github.com/bauerbrun0/youtube-downloader/ui/pages/home"
	infoPage "github.com/bauerbrun0/youtube-downloader/ui/pages/info"
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

func (app *application) quickDownload(w http.ResponseWriter, r *http.Request) {
	time.Sleep(1 * time.Second)
	var v validator.Validator
	var form infoPage.QuickDownloadFormData

	err := app.decodePostForm(r, &form)
	if err != nil {
		w.Header().Set("HX-Retarget", "#main")
		app.render(r.Context(), w, r, errorPage.ErrorPage(i18n.T(r.Context(), "error.server_error")))
		return
	}

	v.CheckField(validator.NotBlank(form.AudioQuality), "audioQuality", "audio quality must be provided")
	v.CheckField(validator.NotBlank(form.VideoUrl), "videoUrl", "video url must be provided")
	v.CheckField(validator.NotBlank(form.Convert), "convert", "convert value must be provided")
	v.CheckField(validator.NotBlank(form.Stream), "stream", "stream must be provided")

	v.CheckField(validator.PermittedValue(form.Stream, "audio", "audio_and_video"), "stream", "invalid stream")
	v.CheckField(validator.PermittedValue(form.AudioQuality, "best", "worst"), "audioQuality", "invalid audio quality")
	v.CheckField(validator.ValidYoutubeContentUrl(form.VideoUrl), "videoUrl", "invalid video url")

	if form.Stream == "audio_and_video" {
		v.CheckField(validator.NotBlank(form.VideoQuality), "videoQuality", "video quality must be provided")
		v.CheckField(validator.PermittedValue(form.VideoQuality, "best", "worst"), "videoUrl", "invalid video quality")
		v.CheckField(validator.PermittedValue(form.Convert, "none", "mp4"), "convert", "invalid convert")
	} else {
		v.CheckField(validator.PermittedValue(form.Convert, "none", "mp3"), "convert", "invalid convert")
	}

	if !v.Valid() {
		w.Header().Set("HX-Retarget", "#main")
		app.render(r.Context(), w, r, errorPage.ErrorPage(i18n.T(r.Context(), "error.server_error")))
		return
	}

	app.logger.Info("Quick download", "form", form)

	w.Header().Set("HX-Retarget", "#main")
	app.render(r.Context(), w, r, errorPage.ErrorPage("TODO"))
}
