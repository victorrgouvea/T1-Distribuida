from flask import Flask, request, make_response, jsonify
import json
import requests

app = Flask(__name__)
cache = {}

@app.post('/realizar-pedido')
def create_order():
  data = request.get_json();
  order = {}
  for [k, v] in data.items():
    order[k] = v
  cache[order['id']] = order
  return make_response("Success", 201)

@app.get('/<id>/get-menu')
def get_menu(id):
  return requests.get(url=f"http://localhost:5001/get-menu/{id}")

@app.get('/<int:id>/get-status-pedido')
def get_status_pedido(id):
  if id in cache:
    resp = make_response(jsonify({'status':cache[id]['status']}), 200)
    return resp
  else:
   return make_response('Order not found', 404)

@app.post('/cadastrar-comida')
def add_food():
  return requests.post(url=f"http://localhost:5001/add-food/", data=request.get_json())

@app.delete('/remover-comida')
def remove_food():
  return requests.post(url=f"http://localhost:5001/remove-food/", data=request.get_json())

@app.put('/atualizar-status-pedido')
def update_order_status():
  data = request.get_json()
  if data['id'] in cache:
    cache[data['id']]['status'] = data['status']
    if data['status'] == 'entregue':
      requests.post(url=f"http://localhost:5001/save-order/", data=cache[data['id']])
      del cache[data['id']]
    return make_response("Success", 202)
  else:
    return make_response('Order not found', 404)

if __name__ == '__main__':
  pass
  app.run(port=5000, host='localhost', debug=True)
