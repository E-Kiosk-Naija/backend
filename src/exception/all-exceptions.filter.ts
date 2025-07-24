import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: any = {
      statusCode: status,
      message: 'Internal server error',
      error: 'Error',
    };

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        errorResponse.message = res;
      } else if (typeof res === 'object') {
        errorResponse = { ...errorResponse, ...res };
      }
    }

    response.status(status).json({
      success: false,
      ...errorResponse,
    });
  }
}
