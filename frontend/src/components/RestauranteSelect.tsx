import React from 'react';
import Form from 'react-bootstrap/Form';

interface RestauranteSelectProps {
  restaurantes: Record<string, { nome: string; comidas: string[]; }>;
  onSelect: (restaurante: { id: string; nome: string; comidas: string[]; } | null) => void;
}

const RestauranteSelect: React.FC<RestauranteSelectProps> = ({ restaurantes, onSelect }) => {
  return (
    <Form.Select onChange={(e) => {
      const restauranteId = e.target.value;
      if (restauranteId) {
        onSelect({
          id: restauranteId,
          nome: restaurantes[restauranteId].nome,
          comidas: restaurantes[restauranteId].comidas,
        });
      } else {
        onSelect(null);
      }
    }}>
      <option value="">Selecione um restaurante</option>
      {Object.keys(restaurantes).map((restauranteId) => (
        <option key={restauranteId} value={restauranteId}>
          {restaurantes[restauranteId].nome}
        </option>
      ))}
    </Form.Select>
  );
};

export default RestauranteSelect;
