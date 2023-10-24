from flask import Flask, request, make_response, jsonify
import json

app = Flask(__name__)

db_path = 'db.json'
restaurant_id = 2

@app.get('/get-highest-id/<key>')
def get_highest_id(key):
  highest_id = 0
  with open(db_path) as file_out:
    j = json.load(file_out)
    for [k, v] in j[key].items():
      if int(v['id']) > highest_id:
        highest_id = int(v['id'])
  return make_response(jsonify({'highest_id': highest_id}), 200)

@app.delete('/remove-food')
def remove_food():
  data = request.get_json()
  j = None
  with open(db_path, 'r') as file_out:
    j = json.load(file_out)
    if data['id'] not in j['restaurantes']:
      return make_response('Restaurant not found', 400)
    if data['comida'] not in j['restaurantes'][data['id']]['comidas']:
      return  make_response('Element not in menu', 401)

  with open(db_path, 'w') as file_out:
    j['restaurantes'][data['id']]['comidas'].remove(data['comida'])
    file_out.seek(0)
    json.dump(j, file_out, indent=4)

  return make_response('Sucess', 200)

@app.put('/add-food')
def add_food():
  data = request.get_json()
  j = None
  with open(db_path, 'r') as file_out:
    j = json.load(file_out)
    if data['id'] not in j['restaurantes']:
      return make_response('Restaurant not found', 400)
    if data['comida'] in j['restaurantes'][data['id']]['comidas']:
      return make_response('Element already in menu', 401)

  with open(db_path, 'w') as file_out:
    j['restaurantes'][data['id']]['comidas'].append(data['comida'])
    file_out.seek(0)
    json.dump(j, file_out, indent=4)
  return make_response('Sucess', 200)

@app.post('/save-order')
def save_order():
  data = request.get_json()
  with open(db_path, 'r+') as file_out:
        j = json.load(file_out)
        j['pedidos'][data['id']] = {}
        for [k, v] in data.items():
            j['pedidos'][data['id']][k] = v
        file_out.seek(0)
        json.dump(j, file_out, indent=4)
  return make_response('Sucess', 200)

@app.get('/get-menu/<id>')
def get_menu(id):
  data = None
  with open(db_path) as file_out:
        j = json.load(file_out)
        for [k, v] in j['restaurantes'].items():
           if id == v['id']:
              data = j['restaurantes'][k]
  if data != None:
     return make_response(jsonify(data), 200)
  else:
     return make_response('Bad Request:Restaurant not found', 400)

@app.get('/get-restaurants')
def get_restaurants():
  data = None
  with open(db_path) as file_out:
    j = json.load(file_out)
    data = j['restaurantes']
  return make_response(jsonify(data), 200)

@app.get('/get-order-history')
def get_order_history():
  data = None
  with open(db_path) as file_out:
    j = json.load(file_out)
    data = j['pedidos']
  return make_response(jsonify(data), 200)

@app.post('/create-restaurant/<name>')
def create_restaurant(name):
  global restaurant_id
  if restaurant_id == 2:
    restaurant_id = get_highest_id('restaurantes').json['highest_id'] + 1
  else:
    restaurant_id += 1
  j = None
  with open(db_path, 'r') as file_out:
    j = json.load(file_out)
  with open(db_path, 'w') as file_out:
    j['restaurantes'][str(restaurant_id)] = {}
    j['restaurantes'][str(restaurant_id)]['nome'] = name
    j['restaurantes'][str(restaurant_id)]['comidas'] = []
    j['restaurantes'][str(restaurant_id)]['id'] = str(restaurant_id)
    file_out.seek(0)
    json.dump(j, file_out, indent=4)
  return make_response(jsonify(j['restaurantes'][str(restaurant_id)]), 200)

if __name__ == '__main__':
  app.run(port=5001, host='localhost', debug=True)
