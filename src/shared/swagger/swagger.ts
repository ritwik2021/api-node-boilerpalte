import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Ten DEX 1.0 APIs')
    .setDescription('Ten DEX backend api documentation')
    .setVersion('1.0')
    .addTag('TenDEX')
    .build();
  app.setGlobalPrefix('/api/v1');

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false
  });
  SwaggerModule.setup('api', app, document);
}
