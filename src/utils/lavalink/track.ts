import { TrackData } from "@/interfaces/lavaUtils";

export const createTrackData = (song: any): TrackData => ({
    encoded: song.track,
    info: {
        timestamp: song.timestamp,
        uniqueId: song.uniqueId,
        identifier: song.identifier,
        isSeekable: song.isSeekable,
        author: song.author,
        artist: song.artist,
        position: song.position,
        cleanAuthor: song.cleanAuthor,
        length: song.duration,
        isrc: song.isrc,
        isStream: song.isStream,
        title: song.title,
        cleanTitle: song.cleanTitle,
        uri: song.uri,
        artworkUrl: song.artworkUrl,
        videoInfo: song.videoInfo,
        accentColor: song.accentColor,
        lyrics: song.lyrics,
        sourceName: song.sourceName,
    },
    pluginInfo: (song.pluginInfo as Record<string, string>),
});