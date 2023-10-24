import { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';
import { HFlow } from 'bold-ui';

export default function MainView() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (role: string) => {
    if (nome.trim() !== '') {
      navigate(`/${role}/${nome}`);
    } else {
      setError('Insira o nome para acessar o sistema.');
    }
  };

  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <h2 className={styles.heading}>Aplicativo de Gestão de Pedidos</h2>
        </Col>
      </Row>

      {error && (
        <Row>
          <Col lg={6}>
            <div className={styles.error}>{error}</div>
          </Col>
        </Row>
      )}

      <Row className={styles.rowSpacing}>
        <Col lg={6}>
          <Form>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Row className={styles.rowSpacing}>
        <HFlow hSpacing={1}>
          <Col lg={3}>
            <Button
              variant="primary"
              className={styles.button}
              onClick={() => handleLogin('restaurante')}
            >
              Quero logar como restaurante
            </Button>
          </Col>
          <Col lg={3}>
            <Button
              variant="primary"
              className={styles.button}
              onClick={() => handleLogin('cliente')}
            >
              Quero logar como cliente
            </Button>
          </Col>
        </HFlow>
      </Row>
    </Container>
  );
}

const styles = {
  button: css`
    width: 19.4rem;
    height: 2.5rem;
  `,
  container: css`
    padding-top: 3rem;
  `,
  heading: css`
    font-weight: bold;
  `,
  rowSpacing: css`
    padding-top: 1rem;
  `,
  error: css`
    color: red;
  `,
};
