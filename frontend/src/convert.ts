import { PedidoFormModel } from "./model";

export const convertPedidoFormModelToJson = (
    model: PedidoFormModel
  ): string => (
    JSON.stringify({
      // TODO: remover id quando for adicionado pelo backend
      "cliente": {
        "nome": model.cliente.nome,
        "endereco": model.cliente.endereco,
        "telefone": model.cliente.telefone,
      },
      "restaurante": {
        "id": model.restaurante.id,
        "nome": model.restaurante.nome
      },
      "itensSelecionados": model.itensSelecionados,
      "status": model.status,
    })
  )