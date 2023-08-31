import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'; // Use uuid library for generating unique IDs

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.requestId = uuidv4(); // Generate a unique requestId
    next();
  }
}
