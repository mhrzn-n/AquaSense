import sys
import json
import joblib
import os
import pandas as pd

# Getting the directory where this script lives
script_dir = os.path.dirname(os.path.abspath(__file__))

# Loading both trained Gradient Boosting models
# Selected over Random Forest based on 7 of 9 metric comparison
freshness_model = joblib.load(os.path.join(script_dir, 'saved-models', 'aquasense_freshness_model.pkl'))
risk_model = joblib.load(os.path.join(script_dir, 'saved-models', 'aquasense_risk_model.pkl'))

# Reading sensor values passed in as command line arguments
# Expected order: level, temperature, tds, ph, turbidity
level = float(sys.argv[1])
temperature = float(sys.argv[2])
tds = float(sys.argv[3])
ph = float(sys.argv[4])
turbidity = float(sys.argv[5])

# Building the input as a DataFrame with matching column names
# Matching exactly how the model was trained
input_data = pd.DataFrame([{
    'level': level,
    'temperature': temperature,
    'tds': tds,
    'ph': ph,
    'turbidity': turbidity
}])

# Making predictions using both Gradient Boosting models
freshness_prediction = freshness_model.predict(input_data)[0]
risk_prediction = risk_model.predict(input_data)[0]

# Returning results as JSON so Node can parse it
result = {
    "freshness_window_hours": round(float(freshness_prediction), 1),
    "risk_score": round(float(risk_prediction), 2)
}

print(json.dumps(result))