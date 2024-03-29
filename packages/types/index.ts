import { Type, Static } from "@sinclair/typebox";
export { Value } from "@sinclair/typebox/value";

export const baseInfo = Type.Object({
	id: Type.String(),
	url: Type.String(),
	title: Type.String(),
	type: Type.Union([
		Type.Literal("video"),
		Type.Literal("playlist"),
	]),
	channel: Type.String(),
	thumbnail: Type.String(),
	requestedUrl: Type.String(),
});

export type BaseInfo = Static<typeof baseInfo>;

export const format = Type.Object({
	formatId: Type.String(),
	format: Type.String(),
	formatNote: Type.Optional(Type.String()),
	fileSize: Type.Optional(Type.Union([ Type.Number(), Type.Null() ])),
	fps: Type.Optional(Type.Union([ Type.Number(), Type.Null() ])),
	resolution: Type.String(),
	tbr: Type.Union([ Type.Number(), Type.Null() ]),
	vbr: Type.Union([ Type.Number(), Type.Null() ]),
	extension: Type.String(),
	videoCodec: Type.String(),
	audioCodec: Type.Optional(Type.String()),
	abr: Type.Union([ Type.Number(), Type.Null() ]),
	container: Type.Optional(Type.String()),
	width: Type.Optional(Type.Union([ Type.Number(), Type.Null() ])),
	height: Type.Optional(Type.Union([ Type.Number(), Type.Null() ])),
});

export type Format = Static<typeof format>;

export const videoInfo = Type.Composite([ baseInfo, Type.Object({
	type: Type.Literal("video"),
	formats: Type.Array(format),
	duration: Type.Number(),
	viewCount: Type.Number()
})]);

export type VideoInfo = Static<typeof videoInfo>;

export const playlistEntry = Type.Object({
	id: Type.String(),
	url: Type.String(),
	title: Type.String(),
	duration: Type.Number(),
	channel: Type.String(),
	channelUrl: Type.String(),
	viewCount: Type.Number(),
	thumbnail: Type.String()
});

export type PlaylistEntry = Static<typeof playlistEntry>;

export const playlistInfo = Type.Composite([ baseInfo, Type.Object({
	type: Type.Literal("playlist"),
	entries: Type.Array(playlistEntry)
})]);

export type PlaylistInfo = Static<typeof playlistInfo>;

export const quality = Type.Union([
	Type.Literal("best"),
	Type.Literal("worst")
]);

export type Quality = Static<typeof quality>;