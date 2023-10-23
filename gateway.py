from flask import Flask, request, make_response, jsonify
import json
import requests
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
cache = {}
last_call = 0

@app.post('/realizar-pedido')
def create_order():
  global last_call
  if time.time() <= last_call + 5:
    return make_response(jsonify({'retry': 1}), 500)
  last_call = time.time()
  data = request.get_json()
  order = {}
  for [k, v] in data.items():
    order[k] = v
  cache[order['id']] = order
  return make_response("Success", 201)

@app.get('/get-menu/<name>')
def get_menu(name):
  response = requests.get(url=f"http://localhost:5001/get-menu/{name}")
  if response.status_code == 200:
    return response
  else:
    return jsonify({'Error': 'Erro na solicitação à API externa'}), 500


@app.get('/get-status-pedido/<name>')
def get_status_pedido(name):
  if name in cache:
    resp = make_response(jsonify({'status':cache[id]['status']}), 200)
    return resp
  else:
   return make_response('Order not found', 404)

@app.put('/cadastrar-comida')
def add_food():
  response = requests.put(url="http://localhost:5001/add-food", json=request.get_json())
  if response.status_code == 200:
    return make_response("Success", 200)
  else:
    return jsonify({'Error': 'Erro na solicitação à API externa'}), 500

@app.delete('/remover-comida')
def remove_food():
  response = requests.delete(url=f"http://localhost:5001/remove-food", json=request.get_json())
  if response.status_code == 200:
    return make_response("Success", 200)
  elif response.status_code == 400:
    return make_response("Bad request: Food not found", 400)
  else:
    return make_response(jsonify({'Error': 'Erro na solicitação à API externa'}), 500)

@app.put('/atualizar-status-pedido')
def update_order_status():
  data = request.get_json()
  if data['id'] in cache.keys():
    cache[data['id']]['status'] = data['status']
    if data['status'] == 'Finalizado':
      requests.post(url=f"http://localhost:5001/save-order", json=cache[data['id']])
      del cache[data['id']]
    return make_response("Success", 202)
  else:
    return make_response('Bad request: Order not found', 400)

@app.get('/get-pedido-em-andamento/<name>')
def get_current_order(name):
  for [k, v] in cache.items():
    if v['name'] == name:
      return make_response(jsonify(cache[k]), 200)
  return make_response('Bad request: Order not found', 400)

if __name__ == '__main__':
  app.run(port=5000, host='localhost', debug=True)
