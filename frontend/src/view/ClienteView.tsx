import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Form, ListGroup, Row, Table } from 'react-bootstrap';
import { Checkbox, HFlow } from 'bold-ui';
import jsonData from './db.json';
import RestauranteSelect from '../components/RestauranteSelect';
import { Pedido } from '../types';
import { css } from '@emotion/css';

interface PedidoFormModel {
  endereco: string;
  telefone: string;
  selectedItems: boolean[];
  restaurante: string;
}

export default function ClienteView() {
  const { nomeCliente } = useParams<{ nomeCliente: string }>();
  const [data, setData] = useState({ comidas: [] });
  const [formData, setFormData] = useState<PedidoFormModel>({
    endereco: '',
    telefone: '',
    selectedItems: [],
    restaurante: '',
  });  

  const [error, setError] = useState('');

  const fetchMenuData = () => {
    fetch(`http://localhost:5000/1/get-menu`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar o cardápio');
        }
        return res.json();
      })
      .then((menuData) => {
        setData(menuData);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleCheckboxChange = (index: number) => {
    const updatedSelectedItems = [...formData.selectedItems];
    updatedSelectedItems[index] = !updatedSelectedItems[index];
    setFormData({ ...formData, selectedItems: updatedSelectedItems });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  

  const handleSubmit = () => {
    const requestData = {
      'comida': 'pastel',
      'restaurante': 'Pastelaria do Felipe',
      'status': 'entregue'
    };
  
    fetch('http://localhost:5000/realizar-pedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'id': '4', 'comida': 'pastel', 'restaurante': 'teste', 'status': 'Preparando'}),
    })
      .then((response) => {
        if (response.ok) {
          // Handle success, e.g., show a success message to the user
          console.log('Pedido enviado com sucesso!');
        } else {
          // Handle errors, e.g., show an error message to the user
          console.error('Erro ao enviar o pedido.');
        }
      })
      .catch((error) => {
        console.error('Erro ao enviar o pedido:', error);
      });
  };  

  const pedidosData: Record<string, Pedido> = jsonData.pedidos;

  return (
    <Container className={styles.container}>
      <Row>
        <h3 className={styles.heading}>Olá {nomeCliente}, faça seu pedido.</h3>
      </Row>
      {error !== '' && (
        <Row>
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}

      <Container className={styles.form}>
        <Row className={styles.rowSpacing}>
          <Col>
            <h4>Área de pedidos</h4>
            <h6>Selecione um restaurante</h6>
            <RestauranteSelect />
          </Col>
        </Row>

        <Row className={styles.rowSpacing}>
          <Col>
            <h6>Selecione os itens</h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              {data.comidas.map((comida, index) => (
                <ListGroup.Item key={index}>
                  <HFlow justifyContent="space-between">
                    <span>{comida}</span>
                    <Checkbox />
                  </HFlow>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
        <Row className={styles.rowSpacing}>
          <Col lg={8}>
            <h6>Preencha seus dados de entrega</h6>
            <Form>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>
                <Row className={styles.finalizarPedidoButton}>
                  <Col>
                    <Button variant="primary" onClick={handleSubmit}>
                      Finalizar pedido
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>

      <Row className={styles.rowSpacing}>
        <Col>
          <h5>Acompanhe seus pedidos</h5>
        </Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Restaurante</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(pedidosData)
                .filter((pedidoId) => pedidosData[pedidoId].cliente === nomeCliente)
                .map((pedidoId) => {
                  const pedido = pedidosData[pedidoId];
                  return (
                    <tr key={pedidoId}>
                      <td>{pedido.comida}</td>
                      <td>{pedido.restaurante.nome}</td>
                      <td>{pedido.status}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  heading: css`
  font-weight: bold;
`,
  container: css`
    padding-top: 3rem;
  `,
  rowSpacing: css`
    padding-top: 1rem;
  `,
  finalizarPedidoButton: css`
    padding-top: 1rem;
    padding-bottom: 1rem;
`,
  form: css`
    background-color: #fafafa;
    margin: 2rem;
`,
};
