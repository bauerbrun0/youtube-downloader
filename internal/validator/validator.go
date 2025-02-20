package validator

import (
	"net/url"
	"slices"
	"strings"
)

type Validator struct {
	FieldErrors    map[string]string
	NonFieldErrors []string
}

func (v *Validator) Valid() bool {
	return len(v.FieldErrors) == 0 && len(v.NonFieldErrors) == 0
}

func (v *Validator) AddNonFieldError(message string) {
	v.NonFieldErrors = append(v.NonFieldErrors, message)
}

func (v *Validator) AddFieldError(key, message string) {
	if v.FieldErrors == nil {
		v.FieldErrors = make(map[string]string)
	}

	if _, exists := v.FieldErrors[key]; !exists {
		v.FieldErrors[key] = message
	}
}

func (v *Validator) CheckField(ok bool, key, message string) {
	if !ok {
		v.AddFieldError(key, message)
	}
}

func NotBlank(value string) bool {
	return strings.TrimSpace(value) != ""
}

func ValidYoutubeContentUrl(value string) bool {
	u, err := url.Parse(value)
	if err != nil {
		return false
	}

	var (
		hostname = u.Hostname()
		path     = u.Path
		query    = u.Query()
		protocol = u.Scheme
	)

	validProtocols := []string{"http", "https"}
	if !slices.Contains(validProtocols, protocol) {
		return false
	}

	validHostnames := []string{"www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be"}
	if !slices.Contains(validHostnames, hostname) {
		return false
	}

	if hostname == "youtu.be" && path == "/" {
		return false
	}

	if hostname != "youtu.be" && path != "/watch" {
		return false
	}

	if hostname != "youtu.be" {
		v, ok := query["v"]
		if !ok {
			return false
		}
		if len(v) != 1 {
			return false
		}
	}

	return true
}
