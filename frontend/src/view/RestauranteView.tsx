import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';
import { HFlow } from 'bold-ui';
import PedidoTable from './PedidoTable';

export default function RestauranteView() {
  const { nomeRestaurante } = useParams<{ nomeRestaurante: string }>();
  const restauranteId = "1";
  const [data, setData] = useState({ comidas: [] });
  const [novoItem, setNovoItem] = useState('');
  const [error, setError] = useState('');

  const fetchMenuData = () => {
    fetch(`http://localhost:5000/${restauranteId}/get-menu`)
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

  const handleClickDeletarItem = (item: string) => {
    fetch("http://localhost:5000/remover-comida", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'id':'1', 'comida': item}),
    })
      .then((res) => {
        if (res.status === 200) {
          fetchMenuData();
        } else if (res.status === 400) {
          alert('Item não encontrado.');
        } else {
          alert('Um erro ocorreu ao deletar este item.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleClickAdicionarItem = () => {
    fetch("http://localhost:5000/cadastrar-comida", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'id':'1', 'comida': novoItem}),
    })
      .then((res) => {
        if (res.status === 200) {
          fetchMenuData();
        } else {
          alert('Um erro ocorreu ao deletar este item.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Container className={styles.container}>
      <Row>
        <h3 className={styles.heading}>Restaurante {nomeRestaurante}</h3>
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
                  <Form.Control value={novoItem} onChange={(e) => setNovoItem(e.target.value)} />
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
      <Row className={styles.rowCardapio}>
        <Col>
          <ListGroup>
            {data.comidas.map((comida, index) => (
              <ListGroup.Item key={index}>
                <HFlow justifyContent="space-between">
                  <span>{comida}</span>
                  <Button onClick={() => handleClickDeletarItem(comida)}>Deletar</Button>
                </HFlow>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col>
          <h4>Pedidos</h4>
          <PedidoTable nome={nomeRestaurante} origin='restaurante'></PedidoTable>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: css`
    padding-top: 3rem;
  `,
  heading: css`
    font-weight: bold;
  `,
  rowSpacing: css`
    padding-top: 2rem;
  `,
  rowCardapio: css`
    padding-top: 1rem;
  `,
};
