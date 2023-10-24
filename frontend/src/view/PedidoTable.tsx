import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Col, Row, Table } from 'react-bootstrap';
import { css } from '@emotion/css';
import { PedidoFormModel } from '../model';
import StatusPedidoSelect from '../components/StatusPedidoSelect';

const socket = io('http://localhost:5000');

interface PedidoTableProps {
  nome?: string;
  origin: 'cliente' | 'restaurante';
  type: 'andamento' | 'historico';
}

export default function PedidoTable(props: PedidoTableProps) {
  const { nome, origin, type } = props;
  const [pedidosData, setPedidosData] = useState<Record<string, PedidoFormModel>>({});
  
  const API_URL = type === 'andamento' ? 'get-pedidos-em-andamento' : 'get-historico-pedidos';

  const fetchPedidos = useCallback(() => {
    fetch(`http://localhost:5000/${API_URL}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar pedidos.');
        }
        return res.json();
      })
      .then((pedidosData) => {
        setPedidosData(pedidosData);
        console.log(pedidosData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [API_URL]);

  useEffect(() => {
    const handlePedidoEvent = () => {
      fetchPedidos();
      console.log('cheguei aqui');
    };

    socket.on('novo_pedido', handlePedidoEvent);
    socket.on('status_atualizado', handlePedidoEvent);

    return () => {
      socket.off('novo_pedido', handlePedidoEvent);
      socket.off('status_atualizado', handlePedidoEvent);
    };
  }, [fetchPedidos]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const refetchPedidosOnStatusChange = () => {
    fetchPedidos();
  };
  
  const handleClickUpdateStatusPedido = (id: string, newStatus: string) => {
    fetch(`http://localhost:5000/atualizar-status-pedido`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, status: newStatus }),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('Status atualizado')
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
                        <StatusPedidoSelect
                          status={pedido.status}
                          setStatus={(newStatus) => {
                            handleClickUpdateStatusPedido(pedidoId, newStatus);
                            refetchPedidosOnStatusChange();
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
