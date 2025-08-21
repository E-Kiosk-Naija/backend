import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception/all-exceptions.filter';
import { Request, Response } from 'express';

const express = require('express');
let serverInstance: any = null;

async function bootstrap(): Promise<any> {
  if (serverInstance) return serverInstance;

  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // Mirror the same global setup as src/main.ts but do NOT call listen()
  expressApp.use((req, res, next) => {
    res.setHeader(
      'Access-Control-Allow-Origin',
      process.env.CORS_ORIGIN || '*',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();

  serverInstance = expressApp;
  return serverInstance;
}

// Default export required by Vercel's Node builder
export default async function handler(
  req: Request,
  res: Response,
) {
  const server = await bootstrap();
  server(req, res);
}
