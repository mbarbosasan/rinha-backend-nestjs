import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Cliente } from './domain/Cliente';
import { ClienteService } from './cliente.service';

export interface Transacao {
  valor: number;
  tipo: 'c' | 'd';
  descricao: string;
}

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post(':id/transacoes')
  @HttpCode(200)
  novaTransacao(@Param() param: any, @Body() transacao: Transacao) {
    return this.clienteService.criarTransacao({
      ...transacao,
      id_cliente: param.id,
    });
  }

  @Get(':id/extrato')
  @HttpCode(200)
  buscarExtrato(@Param() param: { [key: string]: any }) {
    return this.clienteService.buscarExtrato(param.id);
  }
  @Post()
  criarCliente(@Body() cliente: Cliente) {
    return this.clienteService.criarCliente(cliente);
  }
  @Get(':id')
  getClientes(@Param('id') id: string) {
    return this.clienteService.getClientById(+id);
  }

  @Get()
  getAllClientes() {
    return this.clienteService.getAllClient();
  }
}
