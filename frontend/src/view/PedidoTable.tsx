import { Col, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import StatusPedidoSelect from '../components/StatusPedidoSelect';
import { PedidoFormModel } from '../model';
import { css } from '@emotion/css';

interface PedidoTableProps {
  nome?: string;
  origin: 'cliente' | 'restaurante'; // Use string literals to represent origin
}

export default function PedidoTable(props: PedidoTableProps) {
  const { nome, origin } = props;
  const [status, setStatus] = useState('');
  const [pedidosData, setPedidosData] = useState<Record<string, PedidoFormModel>>({});

  useEffect(() => {
    fetchPedidos();
  }, []);
  
  const fetchPedidos = () => {
    fetch(`http://localhost:5000/get-pedidos-em-andamento`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar pedidos.');
        }
        return res.json();
      })
      .then((pedidosData) => {
        setPedidosData(pedidosData);
        console.log(pedidosData)
      })
      .catch((err) => {
        // setError(err.message);
      });
  };

  const refetchPedidosOnStatusChange = () => {
    fetchPedidos();
  };

  const handleClickUpdateStatusPedido = (id: string, newStatus: string) => {
    console.log(newStatus);
    console.log(id);

    fetch(`http://localhost:5000/atualizar-status-pedido`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, status: newStatus }),
    })
      .then((res) => {
        if (res.status === 200) {
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
                        <StatusPedidoSelect
                          status={status}
                          setStatus={(newStatus) => {
                            setStatus(newStatus);
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
