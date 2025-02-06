import express from 'express';
import { HttpStatusCode } from 'axios';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
  return response.status(HttpStatusCode.ServiceUnavailable).json({
    message: 'Service Unavailable'
  });
}