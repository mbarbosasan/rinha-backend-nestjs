import { Injectable } from '@nestjs/common';
import { Cliente } from './domain/Cliente';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>,
  ) {}
  criarCliente(cliente: Cliente) {
    return this.clienteRepository.save(cliente);
  }

  getClientById(id: number) {
    return this.clienteRepository.findOneBy({ id });
  }

  getAllClient() {
    return this.clienteRepository.find();
  }
}
