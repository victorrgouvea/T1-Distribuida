export interface PedidoFormModel {
    cliente: Cliente;
    restaurante: Restaurante;
    itensSelecionados: string[];
    status: string;
  }
  
  export interface Restaurante {
    id?: string;
    nome?: string;
    comidas?: string[];
  }
  
  export interface Cliente {
    nome?: string;
    endereco: string;
    telefone: string;
  }