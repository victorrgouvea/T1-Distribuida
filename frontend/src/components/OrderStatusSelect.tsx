import Form from 'react-bootstrap/Form';

function OrderStatusSelect() {
  return (
    <Form.Select defaultValue="1">
      <option value="1">Preparando</option>
      <option value="2">Saiu para entrega</option>
      <option value="3">Finalizado</option>
    </Form.Select>
  );
}

export default OrderStatusSelect;
