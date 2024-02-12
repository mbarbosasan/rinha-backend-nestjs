import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FiltraTodasExcecoesFilter } from './filtra-todas-excecoes/filtra-todas-excecoes.filter';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FiltraTodasExcecoesFilter());
  console.log(`App is running on ${process.env.APP_PORT}`);
  await app.listen(process.env.APP_PORT);
}

bootstrap();
