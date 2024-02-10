import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cliente } from './domain/Cliente';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transacao } from './domain/Transacao';
import { response } from 'express';

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
      throw new HttpException(
        'É da polícia? Eu queria denunciar um cliente que sumiu',
        HttpStatus.NOT_FOUND,
      );

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

  buscarExtrato(id: number) {
    const extrato = this.dataSource
      .getRepository(Transacao)
      .createQueryBuilder()
      .select()
      .where({
        id_cliente: id,
      })
      .orderBy('realizada_em', 'DESC')
      .take(10)
      .getMany();

    const cliente = this.clienteRepository.findOne({
      where: { id },
    });

    return Promise.allSettled([extrato, cliente]).then(
      ([extratoResult, clienteResult]) => {
        if (
          extratoResult.status === 'rejected' ||
          clienteResult.status === 'rejected'
        )
          throw new HttpException(
            'Houve um erro interno ao carregar as informações, tente novamente ou volte mais tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

        if (!clienteResult.value)
          throw new HttpException(
            'Não foi possível encontrar esse usuário, talvez ele não exista? Afinal o que é existir? Para platão...',
            HttpStatus.NOT_FOUND,
          );
        return {
          saldo: {
            total: clienteResult.value.saldoInicial,
            limite: clienteResult.value.limite,
            data_extrato: new Date().toISOString(),
          },
          ultimas_transacoes: [
            extratoResult.value.map((transacao) => ({
              valor: transacao.valor,
              tipo: transacao.tipo,
              descricao: transacao.descricao,
              realizada_em: transacao.realizada_em,
            })),
          ],
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
