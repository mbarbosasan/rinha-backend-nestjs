import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { DataSource } from 'typeorm';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './domain/Cliente';
import { Transacao } from './domain/Transacao';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Transacao])],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {
  constructor(private dataSource: DataSource) {}
}
