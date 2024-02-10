import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './Cliente';

@Entity()
export class Transacao {
  @PrimaryGeneratedColumn()
  id_transacao: number;
  @ManyToOne(() => Cliente, (cliente) => cliente.id)
  id_cliente: number;
  @Column()
  valor: number;
  @Column()
  tipo: 'c' | 'd';
  @Column()
  descricao: string;
}
