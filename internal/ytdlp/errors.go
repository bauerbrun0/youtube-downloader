package ytdlp

import "errors"

var ErrYouTubeResourceNotFound = errors.New("YouTube resource not found")

var ErrYouTubeInfoParsing = errors.New("YouTube info parsing error occurred")

var ErrUnknownResourceType = errors.New("unknown YouTube resource type")
