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

def validate_input(data):
    """Validate input data"""
    errors = []
    
    # Validate numeric ranges
    numeric_validations = {
        'age': (15, 45),
        'height_cm': (150, 220),
        'weight_kgs': (50, 120),
        'international_reputation': (1, 5),
        'weak_foot': (1, 5),
        'skill_moves': (1, 5)
    }
    
    # Validate technical skills (0-100)
    technical_skills = [
        'crossing', 'finishing', 'heading_accuracy', 'short_passing', 'volleys',
        'dribbling', 'curve', 'freekick_accuracy', 'long_passing', 'ball_control',
        'acceleration', 'sprint_speed', 'agility', 'reactions', 'balance',
        'shot_power', 'jumping', 'stamina', 'strength', 'long_shots',
        'aggression', 'interceptions', 'positioning', 'vision', 'penalties',
        'composure', 'marking', 'standing_tackle', 'sliding_tackle'
    ]
    
    for skill in technical_skills:
        if skill in data and data[skill] is not None:
            numeric_validations[skill] = (0, 100)
    
    # Check numeric ranges
    for field, (min_val, max_val) in numeric_validations.items():
        if field in data and data[field] is not None:
            try:
                value = float(data[field])
                if value < min_val or value > max_val:
                    errors.append(f"{field} must be between {min_val} and {max_val}")
            except (ValueError, TypeError):
                errors.append(f"{field} must be a valid number")
    
    return errors

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
    
    # Pace composite
    if 'acceleration' in player_data and 'sprint_speed' in player_data:
        if player_data['acceleration'] is not None and player_data['sprint_speed'] is not None:
            df_temp['pace_composite'] = (player_data['acceleration'] * 0.4 + 
                                       player_data['sprint_speed'] * 0.6)
            # Remove individual components
            if 'acceleration' in df_temp.columns:
                df_temp = df_temp.drop('acceleration', axis=1)
            if 'sprint_speed' in df_temp.columns:
                df_temp = df_temp.drop('sprint_speed', axis=1)
    
    # Shooting composite
    shooting_skills = ['finishing', 'shot_power', 'long_shots', 'volleys', 'penalties']
    available_shooting = [s for s in shooting_skills if s in player_data and player_data[s] is not None]
    
    if len(available_shooting) >= 3:
        df_temp['shooting_composite'] = df_temp[available_shooting].mean(axis=1)
        # Remove individual components
        for skill in shooting_skills:
            if skill in df_temp.columns:
                df_temp = df_temp.drop(skill, axis=1)
    
    # Passing composite
    passing_skills = ['short_passing', 'long_passing', 'vision', 'crossing', 'freekick_accuracy']
    available_passing = [s for s in passing_skills if s in player_data and player_data[s] is not None]
    
    if len(available_passing) >= 3:
        df_temp['passing_composite'] = df_temp[available_passing].mean(axis=1)
        # Remove individual components
        for skill in passing_skills:
            if skill in df_temp.columns:
                df_temp = df_temp.drop(skill, axis=1)
    
    # Defending composite
    defending_skills = ['marking', 'standing_tackle', 'sliding_tackle', 'interceptions']
    available_defending = [s for s in defending_skills if s in player_data and player_data[s] is not None]
    
    if len(available_defending) >= 3:
        df_temp['defending_composite'] = df_temp[available_defending].mean(axis=1)
        # Remove individual components
        for skill in defending_skills:
            if skill in df_temp.columns:
                df_temp = df_temp.drop(skill, axis=1)
    
    # Physical composite
    physical_skills = ['strength', 'jumping', 'stamina', 'balance', 'agility']
    available_physical = [s for s in physical_skills if s in player_data and player_data[s] is not None]
    
    if len(available_physical) >= 3:
        df_temp['physical_composite'] = df_temp[available_physical].mean(axis=1)
        # Remove individual components
        for skill in physical_skills:
            if skill in df_temp.columns:
                df_temp = df_temp.drop(skill, axis=1)
    
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
    
    # Handle missing values with median imputation
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

@app.route('/', methods=['GET'])
def root():
    """Root endpoint - health check"""
    return create_success_response({
        'message': 'Football Player Rating Prediction API',
        'version': '1.0.0',
        'status': 'healthy',
        'models_loaded': bool(models and model_components and scaler),
        'endpoints': {
            'predict_overall': '/predict/overall',
            'predict_potential': '/predict/potential',
            'predict_both': '/predict/both',
            'health': '/health',
            'model_info': '/model/info',
            'feature_importance': '/model/feature-importance'
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return create_success_response({
        'status': 'healthy',
        'models_loaded': bool(models and model_components and scaler),
        'version': '1.0.0'
    })

@app.route('/predict/overall', methods=['POST'])
def predict_overall_rating():
    """Predict overall rating for a player"""
    
    if 'overall' not in models:
        return create_error_response("Overall rating model not loaded", 503)
    
    try:
        # Get JSON data
        if not request.is_json:
            return create_error_response("Request must be JSON")
        
        player_data = request.get_json()
        
        if not player_data:
            return create_error_response("No data provided")
        
        # Validate input
        validation_errors = validate_input(player_data)
        if validation_errors:
            return create_error_response(f"Validation errors: {', '.join(validation_errors)}")
        
        # Preprocess input
        processed_data = preprocess_input(player_data.copy())
        
        # Make prediction
        prediction = models['overall'].predict(processed_data)[0]
        
        # Calculate confidence
        confidence_interval, confidence_percentage = calculate_confidence(
            models['overall'], processed_data
        )
        
        # Ensure prediction is within valid range
        prediction = max(0, min(100, prediction))
        
        response_data = {
            'prediction': round(prediction, 2),
            'confidence_interval': {
                'lower': round(confidence_interval['lower'], 2),
                'upper': round(confidence_interval['upper'], 2)
            },
            'confidence_percentage': round(confidence_percentage, 2),
            'model_info': {
                'model_type': 'RandomForestRegressor',
                'target': 'overall_rating',
                'n_estimators': models['overall'].n_estimators,
                'max_depth': models['overall'].max_depth
            },
            'input_features_length': len(player_data),
            'input_features': player_data
        }
        
        return create_success_response(response_data)
        
    except Exception as e:
        logger.error(f"Error in overall prediction: {str(e)}")
        logger.error(traceback.format_exc())
        return create_error_response(f"Prediction error: {str(e)}", 500)

@app.route('/predict/potential', methods=['POST'])
def predict_potential_rating():
    """Predict potential rating for a player"""
    
    if 'potential' not in models:
        return create_error_response("Potential rating model not loaded", 503)
    
    try:
        # Get JSON data
        if not request.is_json:
            return create_error_response("Request must be JSON")
        
        player_data = request.get_json()
        
        if not player_data:
            return create_error_response("No data provided")
        
        # Validate input
        validation_errors = validate_input(player_data)
        if validation_errors:
            return create_error_response(f"Validation errors: {', '.join(validation_errors)}")
        
        # Preprocess input
        processed_data = preprocess_input(player_data.copy())
        
        # Make prediction
        prediction = models['potential'].predict(processed_data)[0]
        
        # Calculate confidence
        confidence_interval, confidence_percentage = calculate_confidence(
            models['potential'], processed_data
        )
        
        # Ensure prediction is within valid range
        prediction = max(0, min(100, prediction))
        
        response_data = {
            'prediction': round(prediction, 2),
            'confidence_interval': {
                'lower': round(confidence_interval['lower'], 2),
                'upper': round(confidence_interval['upper'], 2)
            },
            'confidence_percentage': round(confidence_percentage, 2),
            'model_info': {
                'model_type': 'RandomForestRegressor',
                'target': 'potential_rating',
                'n_estimators': models['potential'].n_estimators,
                'max_depth': models['potential'].max_depth
            },
            'input_features': len(processed_data.columns)
        }
        
        return create_success_response(response_data)
        
    except Exception as e:
        logger.error(f"Error in potential prediction: {str(e)}")
        logger.error(traceback.format_exc())
        return create_error_response(f"Prediction error: {str(e)}", 500)

@app.route('/predict/both', methods=['POST'])
def predict_both_ratings():
    """Predict both overall and potential ratings for a player"""
    
    if 'overall' not in models or 'potential' not in models:
        return create_error_response("One or both models not loaded", 503)
    
    try:
        # Get JSON data
        if not request.is_json:
            return create_error_response("Request must be JSON")
        
        player_data = request.get_json()
        
        if not player_data:
            return create_error_response("No data provided")
        
        # Validate input
        validation_errors = validate_input(player_data)
        if validation_errors:
            return create_error_response(f"Validation errors: {', '.join(validation_errors)}")
        
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
            'overall_rating': {
                'prediction': round(overall_prediction, 2),
                'confidence_interval': {
                    'lower': round(overall_confidence_interval['lower'], 2),
                    'upper': round(overall_confidence_interval['upper'], 2)
                },
                'confidence_percentage': round(overall_confidence_percentage, 2),
                'model_info': {
                    'model_type': 'RandomForestRegressor',
                    'target': 'overall_rating',
                    'n_estimators': models['overall'].n_estimators,
                    'max_depth': models['overall'].max_depth
                }
            },
            'potential_rating': {
                'prediction': round(potential_prediction, 2),
                'confidence_interval': {
                    'lower': round(potential_confidence_interval['lower'], 2),
                    'upper': round(potential_confidence_interval['upper'], 2)
                },
                'confidence_percentage': round(potential_confidence_percentage, 2),
                'model_info': {
                    'model_type': 'RandomForestRegressor',
                    'target': 'potential_rating',
                    'n_estimators': models['potential'].n_estimators,
                    'max_depth': models['potential'].max_depth
                }
            },
            'input_features': len(processed_data.columns)
        }
        
        return create_success_response(response_data)
        
    except Exception as e:
        logger.error(f"Error in both predictions: {str(e)}")
        logger.error(traceback.format_exc())
        return create_error_response(f"Prediction error: {str(e)}", 500)

@app.route('/model/info', methods=['GET'])
def get_model_info():
    """Get information about loaded models"""
    
    if not models or not model_components:
        return create_error_response("Models not loaded", 503)
    
    try:
        info = {
            'overall_model': {
                'type': 'RandomForestRegressor',
                'n_estimators': models['overall'].n_estimators,
                'max_depth': models['overall'].max_depth,
                'min_samples_split': models['overall'].min_samples_split,
                'min_samples_leaf': models['overall'].min_samples_leaf,
                'max_features': models['overall'].max_features
            },
            'potential_model': {
                'type': 'RandomForestRegressor',
                'n_estimators': models['potential'].n_estimators,
                'max_depth': models['potential'].max_depth,
                'min_samples_split': models['potential'].min_samples_split,
                'min_samples_leaf': models['potential'].min_samples_leaf,
                'max_features': models['potential'].max_features
            },
            'features': {
                'total_features': len(model_components.get('feature_names', [])),
                'feature_names': model_components.get('feature_names', [])
            },
            'categorical_encoders': list(model_components.get('categorical_encoders', {}).keys())
        }
        
        return create_success_response(info)
        
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return create_error_response(f"Error retrieving model info: {str(e)}", 500)

@app.route('/model/feature-importance', methods=['GET'])
def get_feature_importance():
    """Get feature importance for both models"""
    
    if not model_components:
        return create_error_response("Model components not loaded", 503)
    
    try:
        overall_importance = model_components.get('feature_importance_overall', pd.DataFrame())
        potential_importance = model_components.get('feature_importance_potential', pd.DataFrame())
        
        response_data = {
            'overall_rating': {
                'top_10': overall_importance.head(10).to_dict('records') if not overall_importance.empty else [],
                'total_features': len(overall_importance)
            },
            'potential_rating': {
                'top_10': potential_importance.head(10).to_dict('records') if not potential_importance.empty else [],
                'total_features': len(potential_importance)
            }
        }
        
        return create_success_response(response_data)
        
    except Exception as e:
        logger.error(f"Error getting feature importance: {str(e)}")
        return create_error_response(f"Error retrieving feature importance: {str(e)}", 500)

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
    print("  - POST /predict/overall   - Predict overall rating")
    print("  - POST /predict/potential - Predict potential rating")
    print("  - POST /predict/both      - Predict both ratings")
    print("  - GET  /model/info        - Model information")
    print("  - GET  /model/feature-importance - Feature importance")
    
    print("\n🔧 Starting server on http://localhost:5000")
    print("=" * 50)
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )