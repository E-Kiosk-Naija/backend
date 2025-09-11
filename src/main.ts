import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception/all-exceptions.filter';
import { ApiResponse } from './universal/api.response';
import { UserDto } from './users/schema/dtos/user.dto';
import { UserLoginResponse } from './auth/users/dtos/user-login.response';
import { WalletDto } from './wallet/schema/dto/wallet.dto';
import { AdminLoginResponse } from './auth/admins/dtos/admin-login.response';
import { ProductCategoryDto } from './product-categories/schema/dto/product-catrgory.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Ensure class-validator uses the NestJS dependency injection container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Use global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('e-Kiosk Naija API')
    .setDescription('The E-Kiosk Naija API documentation')
    .setVersion('1.0.0')
    .setLicense('MIT', 'https://opensource.org/license/mit/')
    .setContact(
      'e-Kiosk Naija',
      'https://ekiosknaija.com.ng',
      'info@ekiosknaija.com.ng',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token in the format "Bearer {token}"',
      },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      ApiResponse,
      UserDto,
      UserLoginResponse,
      WalletDto,
      AdminLoginResponse,
      ProductCategoryDto,
    ], // Add any additional models that are not automatically included
  });
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Persist authorization across page reloads
      docExpansion: 'none', // Collapse all sections by default
      filter: true, // Enable filtering of endpoints
      showRequestDuration: true, // Show request duration
      defaultModelsExpandDepth: -1, // Hide models section by default
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
