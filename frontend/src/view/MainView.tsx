import { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';

export default function MainView() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');

  const handleClickSouRestaurante = () => {
    if (nome.trim() !== '') {
      navigate(`/restaurante-view/${nome}`);
    } else {
      alert('Insira o nome do restaurante para acessar o sistema.');
    }
  };

  const handleClickSouCliente = () => {
    if (nome.trim() !== '') {
      navigate(`/cliente-view/${nome}`);
    } else {
      alert('Insira o seu nome para acessar o sistema.');
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <h3>Aplicativo de Gestão de Pedidos</h3>
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <Form>
            <Form.Group controlId="nome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className={styles.buttonRow}>
        <Col lg={2}>
          <Button variant="primary" className={styles.button} onClick={handleClickSouRestaurante}>
            Quero logar como restaurante
          </Button>
        </Col>
        <Col lg={2}>
          <Button variant="primary" className={styles.button} onClick={handleClickSouCliente}>
            Quero logar como cliente
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  button: css`
    width: 16rem;
  `,
  buttonRow: css`
    padding-top: 1rem;
  `,
};
