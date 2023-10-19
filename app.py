from flask import Flask, request
import json
app = Flask(__name__)


db_path = 'db.json'
in_memory_datastore = {
   "Python" : {"name": "Python", "publication_year": 10960, "contribution": "record data"}
}

def write_json(path, json_data):
    with open(path, 'r+') as file_out:
        j = json.load(file_out)
        for k, v in json_data.items():
            j[k] = v
        file_out.seek(0)
        json.dump(j, file_out, indent=4)

def read_json(path):
    with open(path) as file_in:
        return json.load(file_in)

@app.get('/orders/<int:id>')
def list_order_by_id(id):
  orders = read_json(db_path)
  for [k, v] in orders.items():
    if k == id:
       return v

@app.get('/orders')
def get_order_by_id():
  orders = read_json(db_path)
  return orders

@app.put('/orders/<int:id>')
def write_order():
  order = request.get_json()
  write_json(db_path, )


#write_json(db_path, in_memory_datastore)
#response = read_json(db_path)
#print(response)
if __name__ == '__main__':
  pass
  #app.run(port=5000, host='localhost', debug=True)
