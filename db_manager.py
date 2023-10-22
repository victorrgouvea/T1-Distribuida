from flask import Flask, request, make_response, jsonify
import json


app = Flask(__name__)

db_path = 'db.json'

@app.delete('/remove-food')
def get_order_by_id():
  data = request.get_json()
  with open(db_path, 'r+') as file_out:
        j = json.load(file_out)
        j['restaurantes'][data.id]['comidas'].remove(data.comida)
        file_out.seek(0)
        json.dump(j, file_out, indent=4)
  return make_response('Sucess', 200)

@app.post('/add_food')
def add_food():
  data = request.get_json()
  with open(db_path, 'r+') as file_out:
        j = json.load(file_out)
        j['restaurantes'][data.id]['comidas'].append(data.comida)
        file_out.seek(0)
        json.dump(j, file_out, indent=4)
  return make_response('Sucess', 200)

@app.post('/save-order')
def save_order():
  data = request.get_json()
  with open(db_path, 'r+') as file_out:
        j = json.load(file_out)
        for [k, v] in data.items():
            if k == 'id':
                continue
            j['pedidos'][data.id][k] = v
        file_out.seek(0)
        json.dump(j, file_out, indent=4)
  return make_response('Sucess', 200)

@app.get('/get-menu')
def get_order_by_id():
  data = None
  with open(db_path) as file_out:
        j = json.load(file_out)
        data = j['restaurantes']
  return make_response(jsonify(data), 200)




if __name__ == '__main__':
  pass
  app.run(port=5001, host='localhost', debug=True)
