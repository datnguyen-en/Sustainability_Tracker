from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor, AdaBoostRegressor
import joblib
import os

app = Flask(__name__)
CORS(app)

# Global variables for models
m1 = None  # RandomForest
m2 = None  # AdaBoost

def load_or_train_models():
    """Load existing models or train new ones"""
    global m1, m2
    
    # Check if models exist
    if os.path.exists('random_forest_model.pkl') and os.path.exists('adaboost_model.pkl'):
        try:
            m1 = joblib.load('random_forest_model.pkl')
            m2 = joblib.load('adaboost_model.pkl')
            print("Models loaded successfully")
            return True
        except Exception as e:
            print(f"Error loading models: {e}")
    
    # Train new models if they don't exist
    try:
        print("Training new models...")
        air_quality_data = pd.read_csv('AQI-and-Lat-Long-of-Countries.csv')
        
        # Prepare training data
        train1 = air_quality_data.drop(['AQI Value'], axis=1)
        target = air_quality_data['AQI Value']
        
        # Train Random Forest
        m1 = RandomForestRegressor(random_state=42)
        m1.fit(train1, target)
        
        # Train AdaBoost
        m2 = AdaBoostRegressor(random_state=42)
        m2.fit(train1, target)
        
        # Save models
        joblib.dump(m1, 'random_forest_model.pkl')
        joblib.dump(m2, 'adaboost_model.pkl')
        
        print("Models trained and saved successfully")
        return True
    except Exception as e:
        print(f"Error training models: {e}")
        return False

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        co = float(data.get('co', 0))
        ozone = float(data.get('ozone', 0))
        no2 = float(data.get('no2', 0))
        pm25 = float(data.get('pm25', 0))
        lat = float(data.get('lat', 0))
        lng = float(data.get('lng', 0))
        
        # Create input array
        input_data = np.array([[co, ozone, no2, pm25, lat, lng]])
        
        # Make predictions with both models
        rf_prediction = m1.predict(input_data)[0]
        adaboost_prediction = m2.predict(input_data)[0]
        
        # Average the predictions
        final_prediction = (rf_prediction + adaboost_prediction) / 2
        
        return jsonify({
            'prediction': round(final_prediction, 2),
            'rf_prediction': round(rf_prediction, 2),
            'adaboost_prediction': round(adaboost_prediction, 2),
            'inputs': {
                'co': co,
                'ozone': ozone,
                'no2': no2,
                'pm25': pm25,
                'lat': lat,
                'lng': lng
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'models_loaded': m1 is not None and m2 is not None})

if __name__ == '__main__':
    # Load or train models on startup
    if load_or_train_models():
        print("Starting Flask server...")
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print("Failed to load or train models. Exiting.") 