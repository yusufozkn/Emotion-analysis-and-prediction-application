# model.py
import torch
import heapq
from transformers import AutoTokenizer, AutoModel
import torch.nn as nn

class EmotionClassifier(nn.Module):
    def __init__(self, bert):
        super(EmotionClassifier, self).__init__()
        self.bert = bert
        self.dropout = nn.Dropout(0.1)
        self.relu = nn.ReLU()
        self.fc1 = nn.Linear(768, 512)
        self.fc3 = nn.Linear(512, 9)
        self.softmax = nn.LogSoftmax(dim=1)

    def forward(self, sent_id, mask):
        _, cls_hs = self.bert(sent_id, attention_mask=mask, return_dict=False)
        x = self.fc1(cls_hs)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.fc3(x)
        x = self.softmax(x)
        return x

def load_model():
    tokenizer = AutoTokenizer.from_pretrained("maymuni/bert-base-turkish-cased-emotion-analysis")
    bert = AutoModel.from_pretrained("maymuni/bert-base-turkish-cased-emotion-analysis", return_dict=False)
    model = EmotionClassifier(bert)
    model.load_state_dict(torch.load('model/model_Final_son.pt', map_location=torch.device('cpu')))
    model.eval()
    return tokenizer, model

def predict_emotion(text, tokenizer, model):
    tokenized = tokenizer.encode_plus(
        text,
        pad_to_max_length=True,
        truncation=True,
        return_token_type_ids=False
    )

    input_ids = torch.tensor(tokenized['input_ids']).unsqueeze(0)
    attention_mask = torch.tensor(tokenized['attention_mask']).unsqueeze(0)

    with torch.no_grad():
        preds = model(input_ids, attention_mask)
        probabilities = torch.nn.functional.softmax(preds, dim=1)

    top3_emotions = heapq.nlargest(3, enumerate(probabilities[0]), key=lambda x: x[1])
    top3_emotion_names = ['kızgın', 'üzgün', 'korku', 'iğrenme', 'mutlu', 'aşk', 'merak', 'utanç', 'şaşkınlık']
    top3_emotion_probabilities = {top3_emotion_names[index]: float(prob) for index, prob in top3_emotions}

    return top3_emotion_probabilities
