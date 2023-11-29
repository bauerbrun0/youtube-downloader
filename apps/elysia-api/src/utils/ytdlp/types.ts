import { Static, Type } from "@sinclair/typebox";

export const format = Type.Object({
	format_id: Type.String(),
	format: Type.String(),
	format_note: Type.Optional(Type.String()),
	filesize: Type.Optional(Type.Union([ Type.Number(), Type.Null() ])),
	fps: Type.Optional(Type.Union([ Type.Number(), Type.Null() ])),
	resolution: Type.String(),
	tbr: Type.Union([ Type.Number(), Type.Null() ]),
	vbr: Type.Union([ Type.Number(), Type.Null() ]),
	ext: Type.String(),
	vcodec: Type.String(),
	acodec: Type.Optional(Type.String()),
	abr: Type.Union([ Type.Number(), Type.Null() ]),
	container: Type.Optional(Type.String()),
	width: Type.Optional(Type.Union([ Type.Number(), Type.Null() ])),
	height: Type.Optional(Type.Union([ Type.Number(), Type.Null() ]))
});

export type Format = Static<typeof format>;

export const entry = Type.Object({
	id: Type.String(),
	url: Type.String(),
	title: Type.String(),
	duration: Type.Number()
});

export type Entry = Static<typeof entry>;

export const ytdlpResult = Type.Object({
	id: Type.String(),
	webpage_url: Type.String(),
	title: Type.String(),
	_type: Type.Union([
		Type.Literal("video"),
		Type.Literal("playlist"),
	]),
	formats: Type.Optional(Type.Array(format)),
	entries: Type.Optional(Type.Array(entry)),
});

export type YTDLPResult = Static<typeof ytdlpResult>;