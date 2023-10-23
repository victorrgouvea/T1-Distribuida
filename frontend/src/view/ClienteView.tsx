import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function ClienteView() {
  const { nomeCliente } = useParams<{ nomeCliente: string }>();

  return (
    <Container>
      <Row>
        <h3>Olá, {nomeCliente}! Faça seu pedido.</h3>
      </Row>
    </Container>
  );
}
