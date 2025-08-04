import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { error } from 'console';
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
    };

    process.env.NODE_ENV !== 'production' &&
      Logger.error(
        `Exception thrown: ${exception instanceof Error ? exception.message : exception}`,
        exception instanceof Error ? exception.stack : '',
        'AllExceptionsFilter',
      );

    if (exception instanceof HttpException) {
      process.env.NODE_ENV !== 'production' &&
        Logger.error(
          `HTTP Exception: ${exception.message}`,
          exception.stack,
          'AllExceptionsFilter',
        );

      const res = exception.getResponse();
      if (typeof res === 'string') {
        errorResponse.message = res;
      } else if (typeof res === 'object') {
        errorResponse = {
          ...errorResponse,
          ...res,
        };

        if (process.env.NODE_ENV !== 'production') {
          errorResponse.stack = (exception as Error).stack;
        }
      }
    }

    response.status(status).json({
      success: false,
      status: 'Error',
      ...errorResponse,
    });
  }
}
