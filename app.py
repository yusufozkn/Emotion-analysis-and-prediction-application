from flask import Flask, request, render_template, jsonify
from model import load_model, predict_emotion
import random

app = Flask(__name__)

tokenizer, model = load_model()

emotions = ['kızgın', 'üzgün', 'korku', 'iğrenme', 'mutlu', 'aşk', 'merak', 'utanç', 'şaşkınlık']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    emotion = random.choice(emotions)
    return render_template('game.html', emotion=emotion)

@app.route('/game/predict', methods=['POST'])
def game_predict():
    text = request.form['input_text']
    target_emotion = request.form['target_emotion']
    predictions = predict_emotion(text, tokenizer, model)
    
    top_emotion = max(predictions, key=predictions.get)
    score = int(predictions[top_emotion] * 100) if top_emotion == target_emotion else 0  # Puanı tam sayıya yuvarla

    return jsonify({'predictions': predictions, 'top_emotion': top_emotion, 'score': score})


@app.route('/predict', methods=['POST'])
def predict():
    text = request.form['input_text']
    predictions = predict_emotion(text, tokenizer, model)
    return jsonify({'predictions': predictions})


@app.route('/game/next')
def game_next():
    emotion = random.choice(emotions)
    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(debug=True)
