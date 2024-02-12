import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './clientes/cliente.module';
import { Cliente } from './clientes/domain/Cliente';
import { Transacao } from './clientes/domain/Transacao';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.HOST}`,
      port: 3306,
      username: `${process.env.MYSQL_USER}`,
      password: `${process.env.MYSQL_PASSWORD}`,
      database: `${process.env.MYSQL_DATABASE}`,
      entities: [Cliente, Transacao],
      synchronize: true,
    }),
    ClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
