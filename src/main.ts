import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  registerSwagger(app);

  await app.listen(3000);
}

async function registerSwagger(app): Promise<void> {
  const version = process.env.npm_package_version;

  const config = new DocumentBuilder()
    .addBasicAuth()
    .setTitle('Upload Service')
    .setDescription('Upload Service')
    .setVersion(version)
    .addSecurity('basic', { type: 'http', scheme: 'basic' })
    .addSecurityRequirements('basic')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes('public')
      ) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup('/api/docs', app, document);
}

bootstrap();
