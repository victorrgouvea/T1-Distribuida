import { Col, Row, Table } from 'react-bootstrap';
import { useState } from 'react';
import OrderStatusSelect from '../components/OrderStatusSelect';
import jsonData from './db.json';
import { PedidoFormModel } from '../model';
import { css } from '@emotion/css';

interface PedidoTableProps {
  nome?: string;
  origin: 'cliente' | 'restaurante'; // Use string literals to represent origin
}

export default function PedidoTable(props: PedidoTableProps) {
  const { nome, origin } = props;
  const [status, setStatus] = useState('');

  const pedidosData: Record<string, PedidoFormModel> = jsonData.pedidos;

  const handleClickUpdateStatusPedido = (id: string, newStatus: string) => {
    console.log(newStatus);
    console.log(id);

    fetch(`http://localhost:5000/atualizar-status-pedido/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status: newStatus }),
    })
      .then((res) => {
        if (res.status === 202) {
          // Handle success as needed
        } else {
          alert('Um erro ocorreu ao atualizar o status do pedido.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const matchingOrders = Object.keys(pedidosData).filter((pedidoId) => {
    const pedido = pedidosData[pedidoId];
    return (
      (origin === 'cliente' && pedido.cliente.nome === nome) ||
      (origin === 'restaurante' && pedido.restaurante.nome === nome)
    );
  });

  return (
    <Row className={styles.rowSpacing}>
      <Col>
        {matchingOrders.length !== 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Restaurante</th>
                <th>Cliente</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {matchingOrders.map((pedidoId) => {
                const pedido = pedidosData[pedidoId];
                return (
                  <tr key={pedidoId}>
                    <td>{pedido.itensSelecionados.join(', ')}</td>
                    <td>{pedido.restaurante.nome}</td>
                    <td>{pedido.cliente.nome}</td>
                    <td>
                      {origin === 'restaurante' ? (
                        <OrderStatusSelect
                          status={status}
                          setStatus={(newStatus) => {
                            setStatus(newStatus);
                            handleClickUpdateStatusPedido(pedidoId, newStatus);
                          }}
                        />
                      ) : (
                        pedido.status
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>Não há nada a ser exibido.</p>
        )}
      </Col>
    </Row>
  );
}

const styles = {
  rowSpacing: css`
    padding-top: 1rem;
  `,
};
