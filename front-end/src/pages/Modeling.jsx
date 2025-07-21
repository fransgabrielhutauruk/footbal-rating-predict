import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp,
  BarChart3,
  Settings,
  Cpu,
  Award,
  CheckCircle,
  AlertCircle,
  Zap,
  Activity,
  FileText,
  PieChart,
  LineChart,
  Gauge
} from 'lucide-react';

const Modeling = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Data dari hasil modeling berdasarkan fix.ipynb
  const modelSpecs = {
    algorithm: "Random Forest Regressor",
    targets: ["Overall Rating", "Potential Rating"],
    features: 22,
    trainSize: 14357,
    testSize: 3590,
    trainPercentage: 80.0,
    randomState: 42
  };

  const hyperparameterGrid = {
    n_estimators: [100, 200],
    max_depth: [10, 20],
    min_samples_split: [2, 5],
    min_samples_leaf: [1, 2],
    max_features: ['sqrt']
  };

  const bestParams = {
    overall: {
      n_estimators: 200,
      max_depth: 20,
      min_samples_split: 2,
      min_samples_leaf: 1,
      max_features: 'sqrt'
    },
    potential: {
      n_estimators: 200,
      max_depth: 20,
      min_samples_split: 2,
      min_samples_leaf: 1,
      max_features: 'sqrt'
    }
  };

  const modelPerformance = {
    overall: {
      train: {
        mse: 0.4585,
        rmse: 0.6771,
        mae: 0.4746,
        r2: 0.9905,
        mape: 0.7343
      },
      test: {
        mse: 3.0022,
        rmse: 1.7327,
        mae: 1.2315,
        r2: 0.9383,
        mape: 1.9218
      },
      cvScore: 0.9359,
      cvStd: 0.0032
    },
    potential: {
      train: {
        mse: 1.4156,
        rmse: 1.1898,
        mae: 0.8657,
        r2: 0.9692,
        mape: 1.1102
      },
      test: {
        mse: 6.5844,
        rmse: 2.5654,
        mae: 1.9123,
        r2: 0.8185,
        mape: 2.4156
      },
      cvScore: 0.8185,
      cvStd: 0.0037
    }
  };

  const featureImportance = {
    overall: [
      { feature: 'reactions', importance: 0.1245 },
      { feature: 'composure', importance: 0.1156 },
      { feature: 'ball_control', importance: 0.1089 },
      { feature: 'short_passing', importance: 0.0987 },
      { feature: 'age', importance: 0.0876 },
      { feature: 'positioning', importance: 0.0754 },
      { feature: 'long_passing', importance: 0.0698 },
      { feature: 'shooting_composite', importance: 0.0645 },
      { feature: 'passing_composite', importance: 0.0589 },
      { feature: 'dribbling', importance: 0.0523 }
    ],
    potential: [
      { feature: 'age', importance: 0.2145 },
      { feature: 'reactions', importance: 0.1087 },
      { feature: 'ball_control', importance: 0.0945 },
      { feature: 'composure', importance: 0.0876 },
      { feature: 'positioning', importance: 0.0789 },
      { feature: 'short_passing', importance: 0.0734 },
      { feature: 'shooting_composite', importance: 0.0678 },
      { feature: 'dribbling', importance: 0.0634 },
      { feature: 'passing_composite', importance: 0.0589 },
      { feature: 'long_passing', importance: 0.0523 }
    ]
  };

  const accuracyWithinTolerance = {
    overall: {
      tolerance1: { train: 85.2, test: 78.9 },
      tolerance2: { train: 95.7, test: 91.3 },
      tolerance3: { train: 98.4, test: 96.8 },
      tolerance5: { train: 99.8, test: 99.1 }
    },
    potential: {
      tolerance1: { train: 78.3, test: 71.5 },
      tolerance2: { train: 89.6, test: 84.2 },
      tolerance3: { train: 95.1, test: 91.7 },
      tolerance5: { train: 98.9, test: 97.3 }
    }
  };

  const getPerformanceLevel = (r2Score) => {
    if (r2Score >= 0.9) return { level: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (r2Score >= 0.8) return { level: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (r2Score >= 0.7) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { level: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Machine Learning Modeling
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Implementasi dan evaluasi model Random Forest untuk prediksi Overall Rating dan 
            Potential Rating pemain sepak bola FIFA
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl shadow-lg">
          {[
            { id: 'overview', label: 'Model Overview', icon: Brain },
            { id: 'hyperparameters', label: 'Hyperparameters', icon: Settings },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'features', label: 'Feature Importance', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Model Architecture */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Model Architecture</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Algorithm</span>
                  <span className="font-bold text-purple-600">{modelSpecs.algorithm}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Target Variables</span>
                  <span className="font-bold text-blue-600">{modelSpecs.targets.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Input Features</span>
                  <span className="font-bold text-green-600">{modelSpecs.features}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Training Samples</span>
                  <span className="font-bold text-indigo-600">{modelSpecs.trainSize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Test Samples</span>
                  <span className="font-bold text-orange-600">{modelSpecs.testSize.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Cpu className="w-4 h-4 inline mr-2" />
                  Split ratio: {modelSpecs.trainPercentage}% training, {100 - modelSpecs.trainPercentage}% testing
                </p>
              </div>
            </div>

            {/* Model Targets */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Target Variables</h3>
              </div>
              
              <div className="space-y-6">
                {modelSpecs.targets.map((target, index) => {
                  const isOverall = target === "Overall Rating";
                  const perf = isOverall ? modelPerformance.overall : modelPerformance.potential;
                  const perfLevel = getPerformanceLevel(perf.test.r2);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{target}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${perfLevel.bg} ${perfLevel.color}`}>
                          {perfLevel.level}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{perf.test.r2.toFixed(3)}</div>
                          <div className="text-xs text-gray-600">R² Score</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-green-600">{perf.test.rmse.toFixed(2)}</div>
                          <div className="text-xs text-gray-600">RMSE</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Hyperparameters Tab */}
        {activeTab === 'hyperparameters' && (
          <div className="space-y-6">
            
            {/* Hyperparameter Tuning */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Hyperparameter Tuning</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Search Grid */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Parameter Search Grid</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-gray-900">Parameter</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-900">Values</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(hyperparameterGrid).map(([param, values], index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 px-3 font-mono text-sm bg-gray-100 rounded">{param}</td>
                            <td className="py-2 px-3 text-gray-700">{JSON.stringify(values)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      Total kombinasi yang diuji: {
                        hyperparameterGrid.n_estimators.length *
                        hyperparameterGrid.max_depth.length *
                        hyperparameterGrid.min_samples_split.length *
                        hyperparameterGrid.min_samples_leaf.length *
                        hyperparameterGrid.max_features.length
                      } parameter sets
                    </p>
                  </div>
                </div>

                {/* GridSearchCV Config */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">GridSearchCV Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Cross-Validation</span>
                      <span className="font-bold text-blue-600">3-Fold CV</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Scoring Metric</span>
                      <span className="font-bold text-green-600">R² Score</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Parallel Jobs</span>
                      <span className="font-bold text-purple-600">All CPU Cores</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Random State</span>
                      <span className="font-bold text-orange-600">42</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Best Parameters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Overall Rating Best Params */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Best Parameters - Overall Rating</h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(bestParams.overall).map(([param, value], index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 font-mono text-sm">{param}</span>
                      <span className="font-bold text-blue-600">{value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    CV Score: {modelPerformance.overall.cvScore.toFixed(4)} (±{modelPerformance.overall.cvStd.toFixed(4)})
                  </p>
                </div>
              </div>

              {/* Potential Rating Best Params */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Best Parameters - Potential Rating</h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(bestParams.potential).map(([param, value], index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 font-mono text-sm">{param}</span>
                      <span className="font-bold text-green-600">{value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    CV Score: {modelPerformance.potential.cvScore.toFixed(4)} (±{modelPerformance.potential.cvStd.toFixed(4)})
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            
            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Model Performance Metrics</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Overall Rating Performance */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-blue-600" />
                    Overall Rating Model
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600">Training Set</h5>
                      <div className="space-y-2">
                        {Object.entries(modelPerformance.overall.train).map(([metric, value], index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="text-xs text-gray-700">{metric.toUpperCase()}</span>
                            <span className="text-sm font-bold text-blue-600">
                              {typeof value === 'number' ? value.toFixed(4) : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600">Test Set</h5>
                      <div className="space-y-2">
                        {Object.entries(modelPerformance.overall.test).map(([metric, value], index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="text-xs text-gray-700">{metric.toUpperCase()}</span>
                            <span className="text-sm font-bold text-blue-600">
                              {typeof value === 'number' ? value.toFixed(4) : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Potential Rating Performance */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-green-600" />
                    Potential Rating Model
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600">Training Set</h5>
                      <div className="space-y-2">
                        {Object.entries(modelPerformance.potential.train).map(([metric, value], index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="text-xs text-gray-700">{metric.toUpperCase()}</span>
                            <span className="text-sm font-bold text-green-600">
                              {typeof value === 'number' ? value.toFixed(4) : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600">Test Set</h5>
                      <div className="space-y-2">
                        {Object.entries(modelPerformance.potential.test).map(([metric, value], index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="text-xs text-gray-700">{metric.toUpperCase()}</span>
                            <span className="text-sm font-bold text-green-600">
                              {typeof value === 'number' ? value.toFixed(4) : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Accuracy Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Target className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Accuracy Within Tolerance</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Overall Rating Accuracy */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Overall Rating Accuracy</h4>
                  <div className="space-y-3">
                    {[1, 2, 3, 5].map((tolerance) => {
                      const trainAcc = accuracyWithinTolerance.overall[`tolerance${tolerance}`].train;
                      const testAcc = accuracyWithinTolerance.overall[`tolerance${tolerance}`].test;
                      
                      return (
                        <div key={tolerance} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">±{tolerance} points</span>
                            <span className="text-sm text-blue-600">Test: {testAcc}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${testAcc}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Potential Rating Accuracy */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Potential Rating Accuracy</h4>
                  <div className="space-y-3">
                    {[1, 2, 3, 5].map((tolerance) => {
                      const trainAcc = accuracyWithinTolerance.potential[`tolerance${tolerance}`].train;
                      const testAcc = accuracyWithinTolerance.potential[`tolerance${tolerance}`].test;
                      
                      return (
                        <div key={tolerance} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">±{tolerance} points</span>
                            <span className="text-sm text-green-600">Test: {testAcc}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${testAcc}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Cross-Validation Results */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <LineChart className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cross-Validation Results</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Overall Rating Model</h4>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      {modelPerformance.overall.cvScore.toFixed(4)}
                    </div>
                    <div className="text-sm text-blue-700">Mean CV Score</div>
                    <div className="text-xs text-blue-600">
                      ±{modelPerformance.overall.cvStd.toFixed(4)} std deviation
                    </div>
                  </div>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">Potential Rating Model</h4>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">
                      {modelPerformance.potential.cvScore.toFixed(4)}
                    </div>
                    <div className="text-sm text-green-700">Mean CV Score</div>
                    <div className="text-xs text-green-600">
                      ±{modelPerformance.potential.cvStd.toFixed(4)} std deviation
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Feature Importance Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Overall Rating Feature Importance */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Top Features - Overall Rating</h3>
                </div>
                
                <div className="space-y-3">
                  {featureImportance.overall.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {index + 1}. {item.feature}
                        </span>
                        <span className="text-sm text-blue-600">{(item.importance * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.importance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Potential Rating Feature Importance */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Top Features - Potential Rating</h3>
                </div>
                
                <div className="space-y-3">
                  {featureImportance.potential.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {index + 1}. {item.feature}
                        </span>
                        <span className="text-sm text-green-600">{(item.importance * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.importance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Feature Analysis Insights */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Feature Analysis Insights</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Overall Rating Key Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Reactions</strong> adalah fitur paling penting (12.5%)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Composure</strong> dan <strong>Ball Control</strong> sangat berpengaruh</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Composite features seperti <strong>shooting_composite</strong> efektif</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Technical skills mendominasi importance</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Potential Rating Key Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Age</strong> adalah faktor dominan (21.5%) untuk potential</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Pemain muda memiliki potential rating lebih tinggi</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Technical skills tetap penting untuk potential</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Model berhasil capture hubungan age-potential</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Model Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{modelPerformance.overall.test.r2.toFixed(3)}</div>
              <div className="text-purple-100">Overall R² Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{modelPerformance.potential.test.r2.toFixed(3)}</div>
              <div className="text-purple-100">Potential R² Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{modelSpecs.features}</div>
              <div className="text-purple-100">Input Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">2</div>
              <div className="text-purple-100">Target Variables</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              Model Random Forest berhasil mencapai performa excellent untuk Overall Rating (R² = 0.938) 
              dan good untuk Potential Rating (R² = 0.819) dengan menggunakan 22 fitur yang telah 
              dioptimalkan melalui hyperparameter tuning dan cross-validation.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Modeling;
