from flask import Flask, request, jsonify, send_from_directory
import requests
from config import CCTV_API_KEY

app = Flask(__name__, static_folder='.', static_url_path='')

def get_coords(query):
    """VWorld 지오코더 API를 사용하여 주소나 장소 이름으로부터 좌표를 가져옵니다."""
    api_url = f"http://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address={query}&refine=true&simple=false&format=json&type=road&key=BAE2A59FB9AD4D27BE4C243AE11BDB90"
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        if data['response']['status'] == 'OK':
            return data['response']['result']['point']['x'], data['response']['result']['point']['y']
    return None, None

def get_cctv_info(x, y):
    """국가교통정보센터 CCTV API를 사용하여 좌표 주변의 CCTV 정보를 가져옵니다."""
    api_url = f"http://www.utic.go.kr/guide/openCctvPlayer.do?key={CCTV_API_KEY}&type=ex&cctvId=1&minX={float(x)-0.01}&maxX={float(x)+0.01}&minY={float(y)-0.01}&maxY={float(y)+0.01}&getType=json"
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    return None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/cctv')
def api_cctv():
    location = request.args.get('location')
    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    lon, lat = get_coords(location)

    if lon and lat:
        cctv_data = get_cctv_info(lon, lat)
        if cctv_data and cctv_data.get('cctv'):
            return jsonify(cctv_data)
        else:
            return jsonify({'message': 'No CCTV found nearby'})
    else:
        return jsonify({'error': 'Could not find location'}), 404

if __name__ == "__main__":
    app.run(debug=True)