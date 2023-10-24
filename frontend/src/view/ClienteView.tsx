import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { css } from '@emotion/css';
import PedidoForm from './PedidoForm';
import PedidoTable from './PedidoTable';

export default function ClienteView() {
  const { nomeCliente } = useParams<{ nomeCliente: string }>();

  return (
    <Container className={styles.container}>
      <Row>
        <h3 className={styles.heading}>Olá {nomeCliente}, faça seu pedido.</h3>
      </Row>

      <PedidoForm nomeCliente={nomeCliente} />

      <Row>
        <Col>
          <h4>Acompanhe seus pedidos</h4>
          <PedidoTable nome={nomeCliente} origin="cliente" type="andamento" />
        </Col>
      </Row>

      <Row className={styles.rowSpacing}>
        <Col>
          <h4>Histórico de pedidos</h4>
          <PedidoTable nome={nomeCliente} origin="cliente" type="historico" />
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
};
