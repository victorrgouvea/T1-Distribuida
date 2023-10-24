from flask import Flask, request, make_response, jsonify
import json
import requests
import time
#from flask_cors import CORS

app = Flask(__name__)
#CORS(app, origins=["http://localhost:3000"])
cache = {}
last_call = 0
id_number = 1
restaurant_id = 2

@app.post('/realizar-pedido')
def create_order():
  global last_call
  global id_number
  if time.time() <= last_call + 5:
    return make_response(jsonify({'retry': 1}), 500)
  if id_number == 1:
    id_number = requests.get(url=f"http://localhost:5001/get-highest-id/pedidos").json()['highest_id'] + 1
  else:
    id_number += 1
  last_call = time.time()
  data = request.get_json()
  order = {}
  for [k, v] in data.items():
    order[k] = v
  order['id'] = str(id_number)
  cache[str(id_number)] = order
  print(cache)
  return make_response("Success", 200)

@app.get('/get-menu/<name>')
def get_menu(name):
  response = requests.get(url=f"http://localhost:5001/get-menu/{name}")
  if response.status_code == 200:
    return make_response(jsonify(response.json()), 200)
  else:
    return make_response('Bad Request:Restaurant not found', 400)

@app.get('/get-status-pedido/<name>')
def get_status_pedido(name):
  for [k, v] in cache.items():
    if v['cliente']['nome'] == name:
      return make_response(jsonify({'status':cache[k]['status']}), 200)
  else:
   return make_response('Bad request: Order not found', 400)

@app.put('/cadastrar-comida')
def add_food():
  response = requests.put(url="http://localhost:5001/add-food", json=request.get_json())
  if response.status_code == 200:
    return make_response('sucess', 200)
  elif response.status_code == 401:
    return make_response('Element already in menu', 401)
  elif response.status_code == 400:
    return make_response('Restaurant not found', 400)
  else:
    return make_response('Internal Error', 500)

@app.delete('/remover-comida')
def remove_food():
  response = requests.delete(url=f"http://localhost:5001/remove-food", json=request.get_json())
  if response.status_code == 200:
    return make_response('sucess', 200)
  elif response.status_code == 401:
    return make_response('Element not in menu', 401)
  elif response.status_code == 400:
    return make_response('Restaurant not found', 400)
  else:
    return make_response('Internal Error', 500)

@app.put('/atualizar-status-pedido')
def update_order_status():
  data = request.get_json()
  if data['id'] in cache.keys():
    cache[data['id']]['status'] = data['status']
    if data['status'] == 'Finalizado':
      requests.post(url=f"http://localhost:5001/save-order", json=cache[data['id']])
      del cache[data['id']]
    return make_response("Success", 200)
  else:
    return make_response('Bad request: Order not found', 400)

@app.get('/get-pedidos-em-andamento')
def get_current_order():
  return make_response(jsonify(cache), 200)

@app.get('/get-historico-pedidos')
def get_order_history():
  return requests.get(url=f"http://localhost:5001/get-order-history")

@app.get('/get-restaurantes')
def get_restaurants():
  return requests.get(url=f"http://localhost:5001/get-restaurants")

@app.get('/get-restaurante/<name>')
def get_restaurant(name):
  data = requests.get(url=f"http://localhost:5001/get-restaurants").get_json()
  for [k, v] in data.items():
    if v['nome'] == name:
      return make_response(jsonify(v[k]), 200)
  return requests.post(url=f"http://localhost:5001/create-restaurant/<name>")

if __name__ == '__main__':
  app.run(port=5000, host='localhost', debug=True)
