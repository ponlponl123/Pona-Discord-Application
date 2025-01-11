import express from 'express';
import { HttpStatusCode } from 'axios';
import { lavalink } from '@/index';

export function GET(request: express.Request, response: express.Response) {
  if ( lavalink.lavanodes.length === 0 )
    return response.status(HttpStatusCode.ServiceUnavailable).json({
      message: 'Service Unavailable',
    });

  return response.status(HttpStatusCode.Ok).json({
    message: 'OK',
  });
}