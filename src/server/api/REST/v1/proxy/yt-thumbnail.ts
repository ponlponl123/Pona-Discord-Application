import { Request, Response } from "express";

export const path = "/:vid?/:options?";

async function fetchYTthumbnailEndpoint(endpoint: string[]): Promise<false | { buffer: ArrayBuffer, endpoint: string }> {
    let endpoint_ = endpoint[0];
    try {
        const response = await fetch(endpoint_);
        if (!response.ok) {
            if (endpoint.length > 0) {
                const fetchAnotherEndpoint = await fetchYTthumbnailEndpoint(endpoint.slice(1));;
                return fetchAnotherEndpoint;
            }
            return false;
        }

        return {
            buffer: await response.arrayBuffer(),
            endpoint: endpoint_
        }
    
    } catch (err) {
        return false;
    }
}

export async function GET_PRIVATE(req: Request, res: Response) {
    const { vid, options } = req.params;
    const { endpoint } = req.query;
    
    if (!vid) {
        return res.status(400).json({ error: "Missing videoId parameter" });
    }

    const HighRes_youtubeThumbnailUrl = [
        `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${vid}/mqdefault.jpg`
    ];

    const LowRes_youtubeThumbnailUrl = [
        `https://img.youtube.com/vi/${vid}/default.jpg`,
        `https://img.youtube.com/vi/${vid}/sddefault.jpg`,
        `https://img.youtube.com/vi/${vid}/mqdefault.jpg`
    ];

    const fetch = await fetchYTthumbnailEndpoint(options==='highres' ? HighRes_youtubeThumbnailUrl : LowRes_youtubeThumbnailUrl);
    
    if (!fetch ) return res.status(404).json({ error: "Failed to fetch youtube thumbnail." });

    if ( endpoint )
        return res.status(200).json({ endpoint: fetch.endpoint });

    const contentType = req.header("content-type");
    const imageBuffer = fetch.buffer;

    return res.status(200).header({
        headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate"
        }
    }).send(Buffer.from(imageBuffer));
}