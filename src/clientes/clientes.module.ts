import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { DataSource } from 'typeorm';
import { ClienteController } from './clienteController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './domain/Cliente';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClientesModule {
  constructor(private dataSource: DataSource) {}
}
