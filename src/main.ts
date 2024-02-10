import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FiltraTodasExcecoesFilter } from './filtra-todas-excecoes/filtra-todas-excecoes.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FiltraTodasExcecoesFilter());
  await app.listen(3000);
}

bootstrap();
