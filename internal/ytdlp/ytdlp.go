package ytdlp

import (
	"encoding/json"
	"io"
	"log"
	"os/exec"

	"github.com/bauerbrun0/youtube-downloader/internal/validator"
)

type Response struct {
	Type string `json:"_type"`
}

type BaseInfo struct {
	Id           string `json:"id"`
	Url          string `json:"webpage_url"`
	Title        string `json:"title"`
	Type         string `json:"_type"`
	Channel      string `json:"channel"`
	ThumbnailUrl string `json:"thumbnail"`
}

type Format struct {
	FormatID   string  `json:"formatId"`
	Format     string  `json:"format"`
	FormatNote string  `json:"formatNote"`
	FileSize   float64 `json:"fileSize"`
	FPS        float64 `json:"fps"`
	Resolution string  `json:"resolution"`
	TBR        float64 `json:"tbr"`
	VBR        float64 `json:"vbr"`
	Extension  string  `json:"extension"`
	VideoCodec string  `json:"videoCodec"`
	AudioCodec string  `json:"audioCodec"`
	ABR        float64 `json:"abr"`
	Container  string  `json:"container"`
	Width      float64 `json:"width"`
	Height     float64 `json:"height"`
}

type VideoInfo struct {
	BaseInfo
	Duration  int      `json:"duration"`
	ViewCount int      `json:"view_count"`
	Formats   []Format `json:"formats"`
}

type Thumbnail struct {
	Url   string `json:"url"`
	Width int    `json:"width"`
}
type PlaylistEntry struct {
	Id         string      `json:"id"`
	Url        string      `json:"url"`
	Title      string      `json:"title"`
	Duration   int         `json:"duration"`
	ChannelUrl string      `json:"channel_url"`
	ViewCount  int         `json:"view_count"`
	Thumbnails []Thumbnail `json:"thumbnails"`
}

type PlaylistInfo struct {
	BaseInfo
	Entries []PlaylistEntry `json:"entries"`
}

func GetInfo(url string) (error, *VideoInfo, *PlaylistInfo) {
	cmd := exec.Command("yt-dlp", url, "--dump-single-json", "--flat-playlist", "--no-warnings")

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err, nil, nil
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return err, nil, nil
	}

	if err := cmd.Start(); err != nil {
		return err, nil, nil
	}

	var rawJson json.RawMessage
	if err := json.NewDecoder(stdout).Decode(&rawJson); err != nil {
		return ErrYouTubeInfoParsing, nil, nil
	}

	slurp, err := io.ReadAll(stderr)

	if err != nil {
		return err, nil, nil
	}

	if err := cmd.Wait(); err != nil {
		if validator.ContainsAny(string(slurp), "Video unavailable", "playlist does not exist", "non-existent", "HTTP Error 404: Not Found") {
			return ErrYouTubeResourceNotFound, nil, nil
		}
		log.Println(string(slurp))
		return err, nil, nil
	}

	var response Response
	if err := json.Unmarshal(rawJson, &response); err != nil {
		return ErrYouTubeInfoParsing, nil, nil
	}

	switch response.Type {
	case "video":
		var video VideoInfo
		if err := json.Unmarshal(rawJson, &video); err != nil {
			return ErrYouTubeInfoParsing, nil, nil
		}
		return nil, &video, nil
	case "playlist":
		var playlist PlaylistInfo
		if err := json.Unmarshal(rawJson, &playlist); err != nil {
			return ErrYouTubeInfoParsing, nil, nil
		}
		return nil, nil, &playlist
	default:
		return ErrUnknownResourceType, nil, nil
	}
}
