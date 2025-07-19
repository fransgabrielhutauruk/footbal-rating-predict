from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import logging
from datetime import datetime
import traceback
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for models
models = {}
model_components = {}
scaler = None

# ================================================================
# UTILITY FUNCTIONS
# ================================================================

def load_models():
    """Load all required models and components"""
    global models, model_components, scaler
    
    try:
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Check if model files exist
        required_files = [
            'rf_overall_model.pkl',
            'rf_potential_model.pkl',
            'feature_scaler.pkl',
            'model_components.pkl'
        ]
        
        for file in required_files:
            file_path = os.path.join(script_dir, file)
            if not os.path.exists(file_path):
                logger.error(f"❌ Model file not found: {file_path}")
                return False
        
        # Load models with full paths
        models['overall'] = joblib.load(os.path.join(script_dir, 'rf_overall_model.pkl'))
        models['potential'] = joblib.load(os.path.join(script_dir, 'rf_potential_model.pkl'))
        
        # Load scaler
        scaler = joblib.load(os.path.join(script_dir, 'feature_scaler.pkl'))
        
        # Load model components
        model_components = joblib.load(os.path.join(script_dir, 'model_components.pkl'))
        
        logger.info("✅ All models loaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error loading models: {str(e)}")
        return False

def preprocess_input(player_data):
    """Preprocess input data to match model requirements"""
    
    # Handle categorical encodings
    categorical_encoders = model_components.get('categorical_encoders', {})
    
    # Encode categorical variables
    for cat_feature, encoder in categorical_encoders.items():
        if cat_feature in player_data and player_data[cat_feature] is not None:
            try:
                # Handle new categories not seen during training
                if player_data[cat_feature] in encoder.classes_:
                    encoded_value = encoder.transform([player_data[cat_feature]])[0]
                else:
                    # Use most frequent class for unseen categories
                    encoded_value = encoder.transform([encoder.classes_[0]])[0]
                
                player_data[f'{cat_feature}_encoded'] = encoded_value
            except Exception as e:
                logger.warning(f"Error encoding {cat_feature}: {str(e)}")
                player_data[f'{cat_feature}_encoded'] = 0
    
    # Remove original categorical columns
    for cat_feature in categorical_encoders.keys():
        if cat_feature in player_data:
            del player_data[cat_feature]
    
    # Create composite features
    df_temp = pd.DataFrame([player_data])
    
    # Ensure all required features are present
    feature_names = model_components.get('feature_names', [])
    
    # Create DataFrame with all required features
    final_data = pd.DataFrame(columns=feature_names)
    
    # Fill with available data
    for feature in feature_names:
        if feature in df_temp.columns:
            final_data[feature] = df_temp[feature]
        else:
            final_data[feature] = np.nan
    
    # # Handle missing values with median imputation
    final_data = final_data.fillna(final_data.median())
    final_data = final_data.fillna(0)  # In case all values are NaN
    
    return final_data

def calculate_confidence(model, X_input):
    """Calculate prediction confidence using tree variance"""
    try:
        # Get predictions from individual trees
        tree_predictions = []
        for estimator in model.estimators_:
            tree_pred = estimator.predict(X_input)
            tree_predictions.append(tree_pred[0])
        
        tree_predictions = np.array(tree_predictions)
        
        # Calculate statistics
        mean_pred = np.mean(tree_predictions)
        std_pred = np.std(tree_predictions)
        
        # Calculate confidence interval (95%)
        confidence_interval = {
            'lower': mean_pred - 1.96 * std_pred,
            'upper': mean_pred + 1.96 * std_pred
        }
        
        # Calculate confidence percentage (inverse of coefficient of variation)
        if mean_pred != 0:
            cv = std_pred / abs(mean_pred)
            confidence_percentage = max(0, min(100, 100 * (1 - cv)))
        else:
            confidence_percentage = 50.0
        
        return confidence_interval, confidence_percentage
        
    except Exception as e:
        logger.error(f"Error calculating confidence: {str(e)}")
        return {'lower': 0, 'upper': 0}, 0.0

def create_error_response(message, status_code=400):
    """Create standardized error response"""
    return jsonify({
        'error': True,
        'message': message,
        'timestamp': datetime.now().isoformat()
    }), status_code

def create_success_response(data):
    """Create standardized success response"""
    return jsonify({
        'error': False,
        'data': data,
        'timestamp': datetime.now().isoformat()
    })

# ================================================================
# ROUTES
# ================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return create_success_response({
        'status': 'healthy',
        'models_loaded': bool(models and model_components and scaler),
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict_both_ratings():
    if 'overall' not in models or 'potential' not in models:
        return create_error_response("One or both models not loaded", 503)
    
    try:
        # Get JSON data
        if not request.is_json:
            return create_error_response("Request must be JSON")
        
        player_data = request.get_json()
        
        if not player_data:
            return create_error_response("No data provided")
        
        # Preprocess input
        processed_data = preprocess_input(player_data.copy())
        
        # Make predictions
        overall_prediction = models['overall'].predict(processed_data)[0]
        potential_prediction = models['potential'].predict(processed_data)[0]
        
        # Calculate confidence for both
        overall_confidence_interval, overall_confidence_percentage = calculate_confidence(
            models['overall'], processed_data
        )
        potential_confidence_interval, potential_confidence_percentage = calculate_confidence(
            models['potential'], processed_data
        )
        
        # Ensure predictions are within valid range
        overall_prediction = max(0, min(100, overall_prediction))
        potential_prediction = max(0, min(100, potential_prediction))
        
        response_data = {
            'input_features': len(player_data),
            'input_features_percent': f"{int(round((len(player_data)/22*100), 0))}%",
            'overall_rating_prediction': round(overall_prediction, 2),
            'potential_rating_prediction': round(potential_prediction, 2),
            'confidence': f"{round((overall_confidence_percentage + potential_confidence_percentage) / 2, 2)}%",
            "input": processed_data.to_dict(orient="records")[0]
        }
        
        return create_success_response(response_data)
        
    except Exception as e:
        logger.error(f"Error in both predictions: {str(e)}")
        logger.error(traceback.format_exc())
        return create_error_response(f"Prediction error: {str(e)}", 500)

# ================================================================
# ERROR HANDLERS
# ================================================================

@app.errorhandler(404)
def not_found(error):
    return create_error_response("Endpoint not found", 404)

@app.errorhandler(405)
def method_not_allowed(error):
    return create_error_response("Method not allowed", 405)

@app.errorhandler(500)
def internal_error(error):
    return create_error_response("Internal server error", 500)

# ================================================================
# MAIN FUNCTION
# ================================================================

if __name__ == '__main__':
    print("🚀 Starting Football Rating Prediction API...")
    print("=" * 50)
    
    # Load models on startup
    if not load_models():
        print("❌ Failed to load models. API will not function properly.")
        print("Make sure the following files exist in the current directory:")
        print("  - rf_overall_model.pkl")
        print("  - rf_potential_model.pkl")
        print("  - feature_scaler.pkl")
        print("  - model_components.pkl")
        exit(1)
    else:
        print("✅ All models loaded successfully!")
    
    print("\n🌐 API Endpoints:")
    print("  - GET  /              - Health check")
    print("  - POST /predict      - Predict both ratings")
    print("  - GET  /model/feature-importance - Feature importance")
    
    print("\n🔧 Starting server on http://localhost:5000")
    print("=" * 50)
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True
    )