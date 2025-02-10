import { Request, Response } from "express";
import axios from "axios";
import https from "https";


export async function PRIVATE_GET (req: Request, res: Response) {
    const { title, author } = req.query;

    if ( !title || !author )
        return res.status(400).json({ error: "Missing required parameters" });

    const agent = new https.Agent({
      rejectUnauthorized: false
    });
  
    const apiEndpoint = `https://api.textyl.co/api/lyrics?q=${author}%20-%20${title}`;
  
    try {
      const response = await axios.get(apiEndpoint, {
        httpsAgent: agent
      });

      if (response.status !== 200) {
        return res.status(response.status).json({ error: "Failed to fetch lyrics from any endpoints" });
      }
      
      if (!response.data.lyrics) {
        return res.status(404).json({ error: "No lyrics found for the provided title and author" });
      }
  
      return res.status(200).json(response.data);
    } catch {
        return res.status(400).json({ error: "No lyrics found." });
    }
}