export interface Moto {
  id?: string | number;
  placa: string;
  status: string;
  servico?: string;
  os?: string;
  motor?: string;
  [key: string]: any;
}
