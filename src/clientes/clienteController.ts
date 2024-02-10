import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Cliente } from './domain/Cliente';
import { ClienteService } from './cliente.service';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}
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
