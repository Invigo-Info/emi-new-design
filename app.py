# app.py
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculator/<calc_type>')
def calculator(calc_type):
    return render_template('index.html', calculator_type=calc_type)

@app.route('/car-loan-emi-calculator/')
def car_loan_calculator():
    return render_template('index.html', calculator_type='car')

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
