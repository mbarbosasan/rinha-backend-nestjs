import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class FiltraTodasExcecoesFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    console.warn(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Erro interno.',
    });
  }
}
