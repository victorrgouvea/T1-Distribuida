import React from 'react';
import Form from 'react-bootstrap/Form';

interface OrderStatusSelectProps {
  status: string;
  setStatus: (status: string) => void;
}

function OrderStatusSelect({ status, setStatus }: OrderStatusSelectProps) {
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
  };

  return (
    <Form.Select value={status} onChange={handleStatusChange}>
      <option value="Preparando">Preparando</option>
      <option value="Saiu para entrega">Saiu para entrega</option>
      <option value="Finalizado">Finalizado</option>
    </Form.Select>
  );
}

export default OrderStatusSelect;
