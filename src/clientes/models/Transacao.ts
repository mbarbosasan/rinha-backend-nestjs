export interface Transacao {
  valor: number;
  tipo: 'c' | 'd';
  descricao: string;
}
