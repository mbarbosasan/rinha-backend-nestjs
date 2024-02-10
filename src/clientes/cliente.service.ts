import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cliente } from './domain/Cliente';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transacao } from './domain/Transacao';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>,
    @InjectRepository(Transacao)
    private transacaoRepository: Repository<Transacao>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  criarCliente(cliente: Cliente) {
    return this.clienteRepository.save(cliente);
  }
  async criarTransacao(transacao: Transacao) {
    const cliente = await this.clienteRepository.findOne({
      where: { id: transacao.id_cliente },
    });

    if (!cliente)
      throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);

    const clienteSaldoAtualizado = {
      limite: cliente.limite,
      saldoInicial:
        transacao.tipo === 'c'
          ? cliente.saldoInicial + transacao.valor
          : cliente.saldoInicial - transacao.valor,
    };

    if (
      clienteSaldoAtualizado.saldoInicial < 0 &&
      clienteSaldoAtualizado.saldoInicial < cliente.limite
    )
      throw new HttpException(
        'Não há limite suficiente para essa operação',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return this.dataSource.transaction(async (transactionEntityManager) => {
      await transactionEntityManager.getRepository(Transacao).save(transacao);
      await transactionEntityManager
        .getRepository(Cliente)
        .update(transacao.id_cliente, clienteSaldoAtualizado);

      return clienteSaldoAtualizado;
    });
  }

  getSaldoCliente(id: number) {
    const transacoesCliente = this.transacaoRepository.find({
      where: {
        id_cliente: id,
      },
    });
    const clienteInfo = this.clienteRepository.findOneBy({ id });

    return Promise.allSettled([transacoesCliente, clienteInfo]).then(
      ([transacoesClienteResult, clienteInfoResult]) => {
        if (
          transacoesClienteResult.status === 'rejected' ||
          clienteInfoResult.status === 'rejected'
        )
          return new HttpException(
            'Houve um erro interno, por favor, tente novamente ou volte mais tarde.',
            HttpStatus.I_AM_A_TEAPOT,
          );
        return {
          limite: clienteInfoResult.value.limite,
          saldo: transacoesClienteResult.value.reduce((acc, transacao) => {
            if (transacao.tipo === 'c') return acc + transacao.valor;
            else return acc - transacao.valor;
          }, clienteInfoResult.value.saldoInicial),
        };
      },
    );
  }

  getClientById(id: number) {
    return this.clienteRepository.findOneBy({ id });
  }

  getAllClient() {
    return this.clienteRepository.find();
  }
}
