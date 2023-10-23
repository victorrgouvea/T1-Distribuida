import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { css } from '@emotion/css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function MainView() {
  const navigate = useNavigate();

  const handleClickSouRestaurante = () => {
    navigate('/restaurante-view/');
  };

  const handleClickSouCliente = () => {
    navigate('/cliente-view/');
  };

  return (
    <Container className={styles.container}>
      <Row>
        <Col className={styles.centeredText}>
          <h3>Aplicativo de Gestão de Pedidos</h3>
        </Col>
      </Row>
      <Row>
        <Button variant="danger" onClick={handleClickSouRestaurante}>
          Sou restaurante
        </Button>{' '}
        <Button variant="danger" onClick={handleClickSouCliente}>
          Sou cliente
        </Button>
      </Row>
    </Container>
  );
}

const styles = {
  container: css`
    text-align: center;
  `,
  centeredText: css`
    display: flex;
    justify-content: center;
    align-items: center;
    // height: 100vh;
  `,
};
