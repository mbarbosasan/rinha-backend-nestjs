import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { Cliente } from './clientes/domain/Cliente';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'rinha-backend',
      entities: [Cliente],
      synchronize: true,
    }),
    ClientesModule,
    TransacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
