import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import { HFlow } from 'bold-ui';

export default function RestauranteView() {
  const { nomeRestaurante } = useParams<{ nomeRestaurante: string }>();
  const [data, setData] = useState({ comidas: [] });
  const [novoItem, setNovoItem] = useState('');

  const fetchMenuData = () => {
    fetch(`http://localhost:5000/1/get-menu`)
      .then((res) => res.json())
      .then((menuData) => {
        setData(menuData);
      });
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleClickDeletarItem = (index: number) => {
    // TODO: Implementar deleção de item do menu
    console.log(index);
  }

  const handleClickAdicionarItem = () => {
    // TODO: Implementar adição de item do menu
    console.log(novoItem);
  }

  return (
    <Container>
      <Row>
        <h3>Restaurante {nomeRestaurante}</h3>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col>
          <h4>Cardápio</h4>
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Form>
            <Form.Group controlId="nome">
              <Form.Label>Novo item</Form.Label>
              <Row>
                <Col lg={6}>
                  <Form.Control
                    value={novoItem}
                    onChange={(e) => setNovoItem(e.target.value)}
                  />
                </Col>
                <Col lg={2}>
                  <Button variant="primary" onClick={handleClickAdicionarItem}>
                    Adicionar
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col>
          <ListGroup>
            {data.comidas.map((comida, index) => (
              <ListGroup.Item key={index}>
                <HFlow justifyContent="space-between">
                  <span>{comida}</span>
                  <Button onClick={() => handleClickDeletarItem(index)}>Deletar</Button>
                </HFlow>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  rowSpacing: css`
    padding-top: 1rem;
  `,
};
