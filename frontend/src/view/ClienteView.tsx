import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import { Checkbox, HFlow } from 'bold-ui';
import RestauranteSelect from '../components/RestauranteSelect';

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
    const jsonData = {
      checkbox: formData.selectedItems,
      endereco: formData.endereco,
      telefone: formData.telefone,
      nomeCliente: nomeCliente,
      restaurante: formData.restaurante,
    };

    // TODO: enviar no backend
  };

  return (
    <Container className={styles.container}>
      <Row>
        <h3>Olá {nomeCliente}, faça seu pedido.</h3>
      </Row>
      {error !== '' && (
        <Row>
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}
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
              <Row className={styles.rowSpacing}>
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
              <tr>
                <td>Batata-frita Grande</td>
                <td>Marmitas Gomes</td>
                <td>Preparando</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

    </Container>
  );
}

const styles = {
  container: css`
    padding-top: 3rem;
  `,
  rowSpacing: css`
    padding-top: 1rem;
  `,
};
