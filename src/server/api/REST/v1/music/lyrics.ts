import { Request, Response } from "express";
import axios, { HttpStatusCode } from "axios";
import https from "https";
import { ytmusic } from "@/index";
import { Lyric, TimestampLyrics } from "@/interfaces/player";
import { parseLyrics } from "@/utils/parser";
import { TimedLyricsRes } from "ytmusic-api";

export type SearchLyricEngine = 'ytmusic_android' | 'ytmusic_web' | 'boidu' | 'lrclib' | 'textyl';

export async function fetchLyrics(engine: 'ytmusic_web' | 'ytmusic_android', v: string): Promise<false | Lyric>;
export async function fetchLyrics(engine: 'boidu' | 'lrclib', title: string, author: string, duration: number): Promise<false | Lyric>;
export async function fetchLyrics(engine: 'textyl', title: string, author: string): Promise<false | Lyric>;
export async function fetchLyrics(
  engine: SearchLyricEngine,
  arg1: string,
  arg2?: string,
  arg3?: number
): Promise<false | Lyric> {
  switch ( engine ) {
    case "ytmusic_android": {
      if (!arg1 )
        throw Error("Missing required arguments");

      try {
        const lyrics = await ytmusic.client.getLyrics(arg1, true) as TimedLyricsRes;
        if ( lyrics )
        {
          if (Array.isArray(lyrics)) {
            return {
              isTimestamp: false,
              lyrics: lyrics
            } as Lyric;
          } else if (lyrics.timedLyricsData) {
            const parsedLyrics = lyrics.timedLyricsData.map((lyric) => {
              return {
                lyrics: lyric.lyricLine,
                seconds: Number(lyric.cueRange.startTimeMilliseconds)/1000
              }
            }) as TimestampLyrics[];
            
            return {
              isTimestamp: true,
              lyrics: parsedLyrics
            } as Lyric;
          } else {
            throw Error("Unknown response format");
          }
        }
        throw Error("Unknown response");
      } catch (err) {
        throw Error("Error fetching lyrics: " + err);
      }
    }
    case "ytmusic_web": {
      if (!arg1 )
        throw Error("Missing required arguments");

      try {
        const lyrics = await ytmusic.client.getLyrics(arg1);
        if ( lyrics && lyrics.length > 0 )
          return {
            isTimestamp: false,
            lyrics: lyrics
          } as Lyric;
          throw Error("Unknown response");
      } catch (err) {
        throw Error("Error fetching lyrics: " + err);
      }
    }
    case "boidu": {
      if ( !arg1 || !arg2 || !arg3 )
        throw Error("Missing required arguments");
      const endpoint = new URL('https://lyrics-api.boidu.dev/getLyrics');
      endpoint.searchParams.append("s", String(arg1));
      endpoint.searchParams.append("a", String(arg2));
      endpoint.searchParams.append("d", String(arg3));
    
      try {
        const response = await axios.get(endpoint.toString());
  
        if (response.status !== 200) 
          throw Error("Failed to fetch lyrics");
        
        if (response.data.syncedLyrics || response.data.plainLyrics)
          return parseLyrics(response.data.syncedLyrics || response.data.plainLyrics);
    
        throw Error("Unknown response");
      } catch (err) {
        throw Error("Error fetching lyrics: " + err);
      }
    }
    case "lrclib": {
      if ( !arg1 || !arg2 || !arg3 )
        throw Error("Missing required arguments");
      const endpoint = new URL('https://lrclib.net/api/get');
      endpoint.searchParams.append("track_name", String(arg1));
      endpoint.searchParams.append("artist_name", String(arg2));
      endpoint.searchParams.append("duration", String(arg3));
    
      try {
        const response = await axios.get(endpoint.toString());
  
        if (response.status !== 200) 
          throw Error("Failed to fetch lyrics");
        
        if (response.data.syncedLyrics || response.data.plainLyrics)
          return parseLyrics(response.data.syncedLyrics || response.data.plainLyrics);
    
        throw Error("Unknown response");
      } catch (err) {
        throw Error("Error fetching lyrics: " + err);
      }
    }
    case "textyl": {
      if ( !arg1 || !arg2 )
        throw Error("Missing required arguments");
  
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      const endpoint = new URL('https://api.textyl.co/api/lyrics');
      endpoint.searchParams.append('q', `${String(arg2).toLowerCase()} - ${String(arg1).toLowerCase()}`);
    
      try {
        const response = await axios.get(endpoint.toString(), {
          httpsAgent: agent
        });
  
        if (response.status !== 200) 
          throw Error("Failed to fetch lyrics");
        
        if (response.data.length > 0) 
          return {
            isTimestamp: true,
            lyrics: response.data as TimestampLyrics[]
          } as Lyric
    
        throw Error("Unknown response");
      } catch (err) {
        throw Error("Error fetching lyrics: " + err);
      }
    }
  }
  throw Error("Unknown search engine");
}

export async function GET_PRIVATE (req: Request, res: Response) {
  try {
    const { title, author, duration, v, engine } = req.query;

    switch ( engine ) {
      case "dynamic": {
        if ( !v || !title || !author || !duration )
          return res.status(400).json({ error: "Missing required parameters" });

        // fetch all search engines when lyrics are still not found
        const engines: SearchLyricEngine[] = ['lrclib', 'ytmusic_android', 'ytmusic_web', 'boidu', 'textyl'] as SearchLyricEngine[];
        let lyrics;

        for ( const engine of engines ) {
          try {
            if (engine === 'ytmusic_web') {
              lyrics = await fetchLyrics('ytmusic_web', String(v));
            } else if (engine === 'ytmusic_android') {
              lyrics = await fetchLyrics('ytmusic_android', String(v));
            } else if (engine === 'textyl') {
              lyrics = await fetchLyrics('textyl', String(title), String(author));
            } else {
              lyrics = await fetchLyrics(engine as 'boidu' | 'lrclib', String(title), String(author), Number(duration));
            }
            if ( lyrics ) return res.status(200).json(lyrics);
          } catch {}
        }

        if (!lyrics ) return res.status(404).json({ error: "Lyrics not found" });
        return res.status(HttpStatusCode.Gone).json({ message: "Where i am now?" });
      }
      case "ytmusic": {
        if ( !v )
          return res.status(400).json({ error: "Missing required parameters" });

        try {
          const lyrics = await fetchLyrics('ytmusic_android', String(v));
          if ( lyrics ) return res.status(200).json(lyrics);
          return res.status(404).json({ error: "Lyrics not found" });
        } catch (err) {
          return res.status(404).json({ error: "Invalid lyrics", debug: err });
        }
      }
      case "boidu": {
        return res.status(HttpStatusCode.ServiceUnavailable).json({ error: "Service Unavailable" });
      }
      case "lrclib": {
        if ( !title || !author || !duration || !Number(duration) )
          return res.status(400).json({ error: "Missing required parameters" });

        try {
          const lyrics = await fetchLyrics('lrclib', String(title), String(author), Number(duration));
          
          if ( lyrics )
            return res.status(200).json(lyrics);
      
          return res.status(404).json({ error: "No lyrics found for the provided title and author" });
        } catch {
          return res.status(400).json({ error: "No lyrics found." });
        }
      }
      default: {
        if ( !title || !author )
          return res.status(400).json({ error: "Missing required parameters" });
      
        try {
          const lyrics = await fetchLyrics('textyl', String(title), String(author));
    
          if ( lyrics ) 
            return res.status(200).json(lyrics);
      
          return res.status(404).json({ error: "No lyrics found for the provided title and author" });
        } catch {
          return res.status(400).json({ error: "No lyrics found." });
        }
      }
    }
  } catch {
    return res.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
  }
}