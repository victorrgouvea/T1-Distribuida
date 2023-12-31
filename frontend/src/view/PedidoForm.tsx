import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { Checkbox, HFlow } from 'bold-ui';
import RestauranteSelect from '../components/RestauranteSelect';
import { convertPedidoFormModelToJson } from '../convert';
import { API_BASE_URL } from '../config';
import { PedidoFormModel, Restaurante } from '../model';

import { css } from '@emotion/css';

interface PedidoFormProps {
  nomeCliente?: string;
}

export default function PedidoForm(props: PedidoFormProps) {
  const { nomeCliente } = props;

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [restaurantes, setRestaurantes] = useState<Record<string, { nome: string; comidas: string[]; }>>({});

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      restaurante: {
        id: restaurante?.id,
        nome: restaurante?.nome,
      },
    }));
  }, [restaurante]);

  const fetchRestaurantes = () => {
    fetch(`http://localhost:5000/get-restaurantes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar restaurantes.');
        }
        return res.json();
      })
      .then((restaurantData) => {
        setRestaurantes(restaurantData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [formData, setFormData] = useState<PedidoFormModel>({
    cliente: {
      nome: nomeCliente,
      endereco: '',
      telefone: '',
    },
    restaurante: {
      id: restaurante?.id,
      nome: restaurante?.nome,
    },
    itensSelecionados: [],
    status: "Preparando"
  });

  const handleCheckboxChange = (comida: string) => {
    setFormData((prevData) => {
      const updatedSelectedItems = [...prevData.itensSelecionados];

      const isComidaSelected = updatedSelectedItems.includes(comida);

      if (isComidaSelected) {
        const index = updatedSelectedItems.indexOf(comida);
        if (index !== -1) {
          updatedSelectedItems.splice(index, 1);
        }
      } else {
        updatedSelectedItems.push(comida);
      }

      return { ...prevData, itensSelecionados: updatedSelectedItems };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      cliente: {
        ...prevData.cliente,
        [name]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const requestData = convertPedidoFormModelToJson(formData);

    const sendRequest = () => {
      fetch(`${API_BASE_URL}/realizar-pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
      })
        .then((response) => {
          if (response.ok) {
            console.log('Pedido enviado com sucesso!');
          } else if (response.status === 500) {
            return response.json().then((data) => {
              console.log('Server returned a 500 error. Retrying in ' + data.retry + ' seconds...');
              setTimeout(sendRequest, data.retry * 1000); // Retry the request after the specified delay in seconds
            });
          } else {
            console.error('Erro ao enviar o pedido.');
          }
        })
        .catch((error) => {
          console.error('Erro ao enviar o pedido:', error);
        });
    };

    sendRequest();
  };

  return (
    <Container className={styles.form}>
      <Row className={styles.rowSpacing}>
        <Col>
          <h4>Área de pedidos</h4>
          <h6>Selecione um restaurante</h6>
          <RestauranteSelect restaurantes={restaurantes} onSelect={setRestaurante} />
        </Col>
      </Row>
  
      <Row className={styles.rowSpacing}>
        <Col>
          <h6>Selecione os itens</h6>
        </Col>
      </Row>
      <Row>
        <Col>
          {restaurante ? (
            restaurante.comidas?.length ? (
              <ListGroup>
                {restaurante.comidas.map((comida, index) => (
                  <ListGroup.Item key={index}>
                    <HFlow justifyContent="space-between">
                      <span>{comida}</span>
                      <Checkbox onChange={() => handleCheckboxChange(comida)} />
                    </HFlow>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>Ainda não há itens no cardápio.</p>
            )
          ) : (
            <p>Selecione um restaurante para visualizar o cardápio.</p>
          )}
        </Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col lg={8}>
          <h6>Preencha seus dados de entrega</h6>
          <Form>
            <Row>
              <Col>
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  name="endereco"
                  value={formData.cliente.endereco}
                  onChange={handleInputChange}
                />
              </Col>
              <Col>
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  name="telefone"
                  value={formData.cliente.telefone}
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
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
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
