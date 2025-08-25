import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:[ 'http://localhost:4200', 'http://192.168.1.87:4200'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  // await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
