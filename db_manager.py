from flask import Flask, request, make_response, jsonify
import json

app = Flask(__name__)

db_path = 'db.json'

@app.delete('/remove-food')
def remove_food():
  data = request.get_json()
  j = None
  with open(db_path, 'r') as file_out:
    j = json.load(file_out)
    if data['id'] not in j['restaurantes']:
       return make_response('Restaurant not found', 400)
    if data['comida'] not in j['restaurantes'][data['id']]['comidas']:
      return  make_response('Element not in menu', 400)
        
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
      return make_response('Element already in menu', 400)
    
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
            if k == 'id':
                continue
            j['pedidos'][data['id']][k] = v
        file_out.seek(0)
        json.dump(j, file_out, indent=4)
  return make_response('Sucess', 200)

@app.get('/get-menu/<id>')
def get_menu(id):
  data = None
  with open(db_path) as file_out:
        j = json.load(file_out)
        data = j['restaurantes'][str(id)]
  return make_response(jsonify(data), 200)


if __name__ == '__main__':
  app.run(port=5001, host='localhost', debug=True)
