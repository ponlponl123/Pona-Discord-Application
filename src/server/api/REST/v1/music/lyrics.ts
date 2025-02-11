import { Request, Response } from "express";
import axios, { HttpStatusCode } from "axios";
import https from "https";
import { ytmusic } from "@/index";
import { Lyric, TimestampLyrics } from "@/interfaces/player";
import { parseLyrics } from "@/utils/parser";

export async function GET_PRIVATE (req: Request, res: Response) {
    const { title, author, duration, v, engine } = req.query;

  switch ( engine ) {
    case "ytmusic": {
      if ( !v )
        return res.status(400).json({ error: "Missing required parameters" });

      try {
        const lyrics = await ytmusic.client.getLyrics(String(v));
        if ( lyrics && lyrics.length > 0 ) {
          return res.status(200).json({
            isTimestamp: false,
            lyrics: lyrics
          } as Lyric);
        }
        return res.status(404).json({ error: "Lyrics not found" });
      } catch {
        return res.status(404).json({ error: "Invalid lyrics" });
      }
    }
    case "boidu": {
      return res.status(HttpStatusCode.ServiceUnavailable).json({ error: "Service Unavailable" });
      if ( !title || !author || !duration )
        return res.status(400).json({ error: "Missing required parameters" });
      const endpoint = new URL('https://lyrics-api.boidu.dev/getLyrics');
      endpoint.searchParams.append("s", String(title));
      endpoint.searchParams.append("a", String(author));
      endpoint.searchParams.append("d", String(duration));
    
      try {
        const response = await axios.get(endpoint.toString());
  
        if (response.status !== 200) 
          return res.status(response.status).json({ error: "Failed to fetch lyrics from any endpoints" });
        
        if (response.data.syncedLyrics || response.data.plainLyrics)
          return res.status(200).json(parseLyrics(response.data.syncedLyrics || response.data.plainLyrics));
    
        return res.status(404).json({ error: "No lyrics found for the provided title and author" });
      } catch {
        return res.status(400).json({ error: "No lyrics found." });
      }
    }
    case "lrclib": {
      if ( !title || !author || !duration )
        return res.status(400).json({ error: "Missing required parameters" });
      const endpoint = new URL('https://lrclib.net/api/get');
      endpoint.searchParams.append("track_name", String(title));
      endpoint.searchParams.append("artist_name", String(author));
      endpoint.searchParams.append("duration", String(duration));
    
      try {
        const response = await axios.get(endpoint.toString());
  
        if (response.status !== 200) 
          return res.status(response.status).json({ error: "Failed to fetch lyrics from any endpoints" });
        
        if (response.data.syncedLyrics || response.data.plainLyrics)
          return res.status(200).json(parseLyrics(response.data.syncedLyrics || response.data.plainLyrics));
    
        return res.status(404).json({ error: "No lyrics found for the provided title and author" });
      } catch {
        return res.status(400).json({ error: "No lyrics found." });
      }
    }
    default: {
      if ( !title || !author )
        return res.status(400).json({ error: "Missing required parameters" });
  
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      const endpoint = new URL('https://api.textyl.co/api/lyrics');
      endpoint.searchParams.append('q', `${String(author).toLowerCase()} - ${String(title).toLowerCase()}`);
    
      try {
        const response = await axios.get(endpoint.toString(), {
          httpsAgent: agent
        });
  
        if (response.status !== 200) 
          return res.status(response.status).json({ error: "Failed to fetch lyrics from any endpoints" });
        
        if (response.data.length > 0) 
          return res.status(200).json({
            isTimestamp: true,
            lyrics: response.data as TimestampLyrics[]
          } as Lyric);
    
        return res.status(404).json({ error: "No lyrics found for the provided title and author" });
      } catch {
        return res.status(400).json({ error: "No lyrics found." });
      }
    }
  }
}