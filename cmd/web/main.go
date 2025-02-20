package main

import (
	"flag"
	"github.com/go-playground/form"
	"log/slog"
	"net/http"
	"os"
)

type application struct {
	logger      *slog.Logger
	dev         bool
	formDecoder *form.Decoder
}

func main() {
	addr := flag.String("addr", ":4000", "HTTP network address")
	dev := flag.Bool("dev", false, "Development mode")
	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	err := loadLanguages()
	if err != nil {
		logger.Error("Failed to load languages", "error", err.Error())
		os.Exit(1)
	}

	app := &application{
		logger:      logger,
		dev:         *dev,
		formDecoder: form.NewDecoder(),
	}

	logger.Info("Starting server", slog.String("addr", *addr))
	err = http.ListenAndServe(*addr, app.routes())
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}
