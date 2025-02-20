package appctx

import "context"

type contextKey string

const LanguageContextKey = contextKey("language")
const ThemeContextKey = contextKey("theme")

func GetLanguage(ctx context.Context) string {
	if locale, ok := ctx.Value(LanguageContextKey).(string); ok {
		return locale
	}
	return "en"
}

func GetTheme(ctx context.Context) string {
	if theme, ok := ctx.Value(ThemeContextKey).(string); ok {
		return theme
	}
	return "system"
}
