import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  PauseCircle,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Zap,
  Eye,
  ChevronRight,
  ChevronLeft,
  Activity,
  Star,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  Camera,
  Play
} from 'lucide-react';

const Results = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Story data berdasarkan hasil analisis dari fix.ipynb
  const stories = [
    {
      id: 'overview',
      title: 'Project Overview',
      subtitle: 'Prediksi Rating Pemain FIFA dengan AI',
      content: {
        headline: 'Membangun AI Predictor untuk Rating Pemain Sepak Bola',
        description: 'Proyek ini menggunakan machine learning untuk memprediksi Overall Rating dan Potential Rating pemain sepak bola berdasarkan 22 fitur utama dari dataset FIFA Players.',
        keyPoints: [
          'Dataset: 17,947 pemain FIFA dengan 51 atribut',
          'Model: Random Forest Regressor dengan hyperparameter tuning',
          'Target: Overall Rating (R² = 0.938) & Potential Rating (R² = 0.819)',
          'Features: 22 fitur optimized termasuk composite features'
        ],
        visual: 'project-stats'
      }
    },
    {
      id: 'data-journey',
      title: 'Data Journey',
      subtitle: 'Dari Raw Data menjadi Intelligence',
      content: {
        headline: 'Perjalanan Transformasi Data FIFA Players',
        description: 'Mengikuti perjalanan data dari 17,954 raw records hingga menjadi 17,947 clean samples yang siap untuk machine learning.',
        keyPoints: [
          'Data Cleaning: Menghapus noise dan outliers dari body_type',
          'Feature Engineering: Membuat 5 composite features',
          'Encoding: Label encoding untuk 3 variabel kategorikal',
          'Quality: 100% data quality tanpa missing values pada fitur model'
        ],
        visual: 'data-pipeline'
      }
    },
    {
      id: 'model-power',
      title: 'Model Performance',
      subtitle: 'Kekuatan Random Forest dalam Aksi',
      content: {
        headline: 'Random Forest: Algoritma Terpilih dengan Performa Excellent',
        description: 'Model Random Forest menunjukkan performa luar biasa dengan hyperparameter tuning dan cross-validation yang comprehensive.',
        keyPoints: [
          'Overall Rating: R² Score 0.938 (Excellent Performance)',
          'Potential Rating: R² Score 0.819 (Good Performance)', 
          'Akurasi ±2 poin: 91.3% untuk Overall, 84.2% untuk Potential',
          'Cross-Validation: Konsisten dengan std deviation rendah'
        ],
        visual: 'model-metrics'
      }
    },
    {
      id: 'feature-insights',
      title: 'Feature Intelligence',
      subtitle: 'Apa yang Membuat Pemain Hebat?',
      content: {
        headline: 'DNA Pemain Sepak Bola: Fitur yang Menentukan Kebesaran',
        description: 'Analisis mendalam mengungkap fitur-fitur kunci yang paling berpengaruh dalam menentukan rating pemain.',
        keyPoints: [
          'Overall Rating: Reactions (12.5%), Composure (11.6%), Ball Control (10.9%)',
          'Potential Rating: Age (21.5%) - faktor dominan untuk potential',
          'Technical Skills: Mendominasi importance untuk overall rating',
          'Youth Factor: Usia muda sangat berkorelasi dengan potential tinggi'
        ],
        visual: 'feature-importance'
      }
    },
    {
      id: 'predictions',
      title: 'Real Predictions',
      subtitle: 'Model dalam Aksi Nyata',
      content: {
        headline: 'Prediksi Real-Time: Dari Data ke Insight',
        description: 'Melihat bagaimana model memprediksi rating pemain pada berbagai skenario dan tingkat akurasi.',
        keyPoints: [
          'Elite Players (90-100): Akurasi tinggi dengan error minimal',
          'Average Players (60-70): Prediksi stabil dan konsisten',
          'Young Talents: Model berhasil capture potential tinggi',
          'Edge Cases: Handling outliers dengan baik'
        ],
        visual: 'prediction-examples'
      }
    },
    {
      id: 'impact',
      title: 'Business Impact',
      subtitle: 'Value untuk Dunia Sepak Bola',
      content: {
        headline: 'Dampak Nyata: Revolusi Scouting dan Transfer',
        description: 'Model ini dapat mengubah cara klub mengevaluasi pemain dan membuat keputusan transfer yang lebih cerdas.',
        keyPoints: [
          'Scouting Intelligence: Identifikasi talent tersembunyi',
          'Transfer Analysis: Evaluasi objektif nilai pemain',
          'Youth Development: Prediksi potential pemain muda',
          'Strategic Planning: Data-driven team building'
        ],
        visual: 'business-impact'
      }
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (autoPlay && isPlaying) {
      interval = setInterval(() => {
        setCurrentScene(prev => {
          if (prev < stories[activeStory].content.keyPoints.length - 1) {
            return prev + 1;
          } else {
            if (activeStory < stories.length - 1) {
              setActiveStory(activeStory + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setAutoPlay(false);
              return prev;
            }
          }
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isPlaying, activeStory, currentScene, stories]);

  const currentStory = stories[activeStory];

  const modelMetrics = {
    overall: { r2: 0.938, rmse: 1.73, mae: 1.23, accuracy: 91.3 },
    potential: { r2: 0.819, rmse: 2.57, mae: 1.91, accuracy: 84.2 }
  };

  const featureData = {
    overall: [
      { name: 'reactions', importance: 12.5, description: 'Reaksi cepat dalam situasi permainan' },
      { name: 'composure', importance: 11.6, description: 'Ketenangan di bawah tekanan' },
      { name: 'ball_control', importance: 10.9, description: 'Kontrol bola yang superior' },
      { name: 'short_passing', importance: 9.9, description: 'Akurasi passing jarak pendek' },
      { name: 'age', importance: 8.8, description: 'Faktor pengalaman dan kedewasaan' }
    ],
    potential: [
      { name: 'age', importance: 21.5, description: 'Usia muda = potential tinggi' },
      { name: 'reactions', importance: 10.9, description: 'Fondasi kemampuan dasar' },
      { name: 'ball_control', importance: 9.5, description: 'Technical foundation' },
      { name: 'composure', importance: 8.8, description: 'Mental strength untuk berkembang' },
      { name: 'positioning', importance: 7.9, description: 'Pemahaman taktis yang berkembang' }
    ]
  };

  const predictionExamples = [
    {
      type: 'Elite Player',
      actual: 94.0,
      predicted: 93.8,
      error: 0.2,
      description: 'Prediksi sangat akurat untuk pemain top-tier'
    },
    {
      type: 'Young Talent',
      actual: 72.0,
      predicted: 71.5,
      error: 0.5,
      description: 'Model berhasil capture potential pemain muda'
    },
    {
      type: 'Average Player',
      actual: 68.0,
      predicted: 68.9,
      error: 0.9,
      description: 'Konsistensi baik pada pemain rata-rata'
    }
  ];

  const renderVisualization = (visual) => {
    switch (visual) {
      case 'project-stats':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">17,947</div>
              <div className="text-blue-800">Clean Data Points</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">22</div>
              <div className="text-green-800">Optimized Features</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">93.8%</div>
              <div className="text-purple-800">Overall R² Score</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="text-4xl font-bold text-orange-600 mb-2">81.9%</div>
              <div className="text-orange-800">Potential R² Score</div>
            </div>
          </div>
        );

      case 'data-pipeline':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span>Raw Data</span>
              </div>
              <span className="font-bold">17,954 rows</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span>Data Cleaning</span>
              </div>
              <span className="font-bold">Remove noise & duplicates</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span>Feature Engineering</span>
              </div>
              <span className="font-bold">5 composite features</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span>Clean Dataset</span>
              </div>
              <span className="font-bold">17,947 rows</span>
            </div>
          </div>
        );

      case 'model-metrics':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-blue-200 rounded-xl">
              <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Overall Rating Model
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>R² Score</span>
                  <span className="font-bold text-blue-600">{modelMetrics.overall.r2}</span>
                </div>
                <div className="flex justify-between">
                  <span>RMSE</span>
                  <span className="font-bold">{modelMetrics.overall.rmse}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy ±2pts</span>
                  <span className="font-bold text-green-600">{modelMetrics.overall.accuracy}%</span>
                </div>
              </div>
            </div>

            <div className="p-6 border border-green-200 rounded-xl">
              <h4 className="font-bold text-green-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Potential Rating Model
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>R² Score</span>
                  <span className="font-bold text-green-600">{modelMetrics.potential.r2}</span>
                </div>
                <div className="flex justify-between">
                  <span>RMSE</span>
                  <span className="font-bold">{modelMetrics.potential.rmse}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy ±2pts</span>
                  <span className="font-bold text-green-600">{modelMetrics.potential.accuracy}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'feature-importance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-4 text-blue-900">Overall Rating - Top Features</h4>
              <div className="space-y-3">
                {featureData.overall.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{feature.name}</span>
                      <span className="text-blue-600 font-bold">{feature.importance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${feature.importance * 8}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{feature.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-green-900">Potential Rating - Top Features</h4>
              <div className="space-y-3">
                {featureData.potential.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{feature.name}</span>
                      <span className="text-green-600 font-bold">{feature.importance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${feature.importance * 4.5}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{feature.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'prediction-examples':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictionExamples.map((example, index) => (
              <div key={index} className="p-4 border rounded-xl bg-gray-50">
                <h5 className="font-bold mb-3 text-center">{example.type}</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Actual:</span>
                    <span className="font-bold text-blue-600">{example.actual}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Predicted:</span>
                    <span className="font-bold text-green-600">{example.predicted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error:</span>
                    <span className="font-bold text-red-600">±{example.error}</span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                  {example.description}
                </div>
              </div>
            ))}
          </div>
        );

      case 'business-impact':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-blue-900 mb-2">Scouting Revolution</h4>
              <p className="text-blue-800 text-sm">
                Identifikasi talent tersembunyi dengan akurasi 91.3% untuk mengurangi risiko transfer
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Trophy className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-bold text-green-900 mb-2">Youth Development</h4>
              <p className="text-green-800 text-sm">
                Prediksi potential dengan akurasi 84.2% untuk investasi akademi yang tepat sasaran
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-bold text-purple-900 mb-2">Transfer Analysis</h4>
              <p className="text-purple-800 text-sm">
                Evaluasi objektif nilai pemain berdasarkan 22 fitur kunci untuk keputusan cerdas
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <Zap className="w-8 h-8 text-orange-600 mb-3" />
              <h4 className="font-bold text-orange-900 mb-2">Strategic Planning</h4>
              <p className="text-orange-800 text-sm">
                Data-driven team building dengan insight mendalam tentang karakteristik pemain
              </p>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Visualization placeholder</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Results & Storytelling
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Menjelajahi hasil analisis dengan narrative yang menarik dan visualisasi yang insight-driven
          </p>
        </div>

        {/* Story Navigation */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Camera className="w-6 h-6 mr-3 text-indigo-600" />
              Story Navigation
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  autoPlay 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Auto Play</span>
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!autoPlay}
                className={`p-2 rounded-lg transition-colors ${
                  autoPlay 
                    ? (isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200')
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isPlaying ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {stories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => {
                  setActiveStory(index);
                  setCurrentScene(0);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeStory === index
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}. {story.title}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${((activeStory * stories.length + currentScene + 1) / (stories.length * 4)) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Main Story Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Story Content */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center text-indigo-600 text-sm font-medium mb-2">
                <span className="bg-indigo-100 px-2 py-1 rounded">{activeStory + 1} / {stories.length}</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span>{currentStory.subtitle}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentStory.title}</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentStory.content.headline}</h3>
              <p className="text-gray-600 leading-relaxed">{currentStory.content.description}</p>
            </div>

            {/* Key Points with Animation */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Key Insights:
              </h4>
              {currentStory.content.keyPoints.map((point, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-500 ${
                    index <= currentScene || !autoPlay
                      ? 'bg-green-50 border-l-4 border-green-500 opacity-100 transform translate-x-0'
                      : 'bg-gray-50 opacity-50 transform translate-x-4'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 mt-0.5 ${
                    index <= currentScene || !autoPlay ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <span className="text-gray-800">{point}</span>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  if (activeStory > 0) setActiveStory(activeStory - 1);
                  setCurrentScene(0);
                }}
                disabled={activeStory === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {currentStory.content.keyPoints.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScene(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentScene ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  if (activeStory < stories.length - 1) setActiveStory(activeStory + 1);
                  setCurrentScene(0);
                }}
                disabled={activeStory === stories.length - 1}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-purple-600" />
                Live Visualization
              </h3>
              <div className="text-sm text-gray-500">
                {currentStory.content.visual}
              </div>
            </div>

            <div className="h-96 flex items-center justify-center">
              {renderVisualization(currentStory.content.visual)}
            </div>
          </div>

        </div>

        {/* Interactive Summary */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-8 text-white">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Project Impact Summary</h3>
              <p className="text-indigo-100">Transformasi data menjadi intelligence yang actionable</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">93.8%</div>
              <div className="text-indigo-100">Overall Accuracy</div>
              <div className="text-sm text-indigo-200">Model Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">22</div>
              <div className="text-indigo-100">Smart Features</div>
              <div className="text-sm text-indigo-200">Optimized Input</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">17K+</div>
              <div className="text-indigo-100">Player Profiles</div>
              <div className="text-sm text-indigo-200">Rich Dataset</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">∞</div>
              <div className="text-indigo-100">Possibilities</div>
              <div className="text-sm text-indigo-200">Future Applications</div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/10 rounded-xl">
            <div className="flex items-start space-x-4">
              <Star className="w-6 h-6 text-yellow-300 mt-1" />
              <div>
                <h4 className="font-bold mb-2">Key Achievement</h4>
                <p className="text-indigo-100 leading-relaxed">
                  Berhasil menciptakan AI predictor yang dapat membantu klub sepak bola dalam membuat 
                  keputusan transfer yang lebih cerdas dan objektif. Model ini tidak hanya akurat, 
                  tetapi juga memberikan insight mendalam tentang faktor-faktor yang menentukan 
                  kebesaran seorang pemain sepak bola.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Story */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Camera className="w-6 h-6 mr-3 text-red-600" />
              Story Video
            </h3>
            <div className="text-sm text-gray-500">Watch the video</div>
          </div>
          
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/aJapeexPY84"
              title="Story Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;
