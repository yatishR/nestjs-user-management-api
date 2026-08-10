import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import {
  Request,
  Response,
  NextFunction,
} from 'express';

@Injectable()

export class LoggerMiddleware implements NestMiddleware {

    use(req:Request,res:Response,next:NextFunction){
        const startTime = Date.now();
        console.log('----------------------------');
        console.log('Method:', req.method);
        console.log('URL:', req.originalUrl);
        console.log('Time:', new Date().toISOString());
         res.on('finish', () => {

      const duration =
        Date.now() - startTime;

      console.log('Status:', res.statusCode);
      console.log('Duration:', `${duration}ms`);
      console.log('----------------------------');
    });
    next();
    }
  }