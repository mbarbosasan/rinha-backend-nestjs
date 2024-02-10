import { Injectable } from '@nestjs/common';
import { Cliente } from './domain/Cliente';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transacao } from './domain/Transacao';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>,
    @InjectRepository(Transacao)
    private transacaoRepository: Repository<Transacao>,
  ) {}
  criarCliente(cliente: Cliente) {
    return this.clienteRepository.save(cliente);
  }

  criarTransacao(transacao: Transacao) {
    return this.transacaoRepository.save(transacao);
  }

  getClientById(id: number) {
    return this.clienteRepository.findOneBy({ id });
  }

  getAllClient() {
    return this.clienteRepository.find();
  }
}
