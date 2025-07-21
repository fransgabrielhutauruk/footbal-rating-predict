import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  BarChart3,
  Filter,
  Database,
  Settings,
  TrendingUp,
  FileText,
  Zap,
  Target
} from 'lucide-react';

const DataCleaning = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const cleaningStats = {
    originalRows: 17954,
    finalRows: 17947,
    duplicatesRemoved: 0,
    targetFiltered: 0,
    originalColumns: 51,
    finalFeatures: 22,
    missingDataHandled: "Median imputation untuk nilai yang hilang"
  };

  const missingDataAnalysis = [
    { feature: 'national_team', missing: 17097, percentage: 95.23 },
    { feature: 'national_team_position', missing: 17097, percentage: 95.23 },
    { feature: 'national_rating', missing: 17097, percentage: 95.23 },
    { feature: 'national_jersey_number', missing: 17097, percentage: 95.23 },
    { feature: 'release_clause_euro', missing: 1837, percentage: 10.23 },
    { feature: 'value_euro', missing: 255, percentage: 1.42 },
    { feature: 'wage_euro', missing: 246, percentage: 1.37 }
  ];

  const featureEngineering = [
    {
      name: 'pace_composite',
      description: 'Kombinasi acceleration (40%) + sprint_speed (60%)',
      purpose: 'Mengukur kecepatan keseluruhan pemain'
    },
    {
      name: 'shooting_composite',
      description: 'Rata-rata dari finishing, shot_power, long_shots, volleys, penalties',
      purpose: 'Mengukur kemampuan shooting keseluruhan'
    },
    {
      name: 'passing_composite',
      description: 'Rata-rata dari short_passing, long_passing, vision, crossing, freekick_accuracy',
      purpose: 'Mengukur kemampuan passing keseluruhan'
    },
    {
      name: 'defending_composite',
      description: 'Rata-rata dari marking, standing_tackle, sliding_tackle, interceptions',
      purpose: 'Mengukur kemampuan defending keseluruhan'
    },
    {
      name: 'physical_composite',
      description: 'Rata-rata dari strength, jumping, stamina, balance, agility',
      purpose: 'Mengukur kemampuan fisik keseluruhan'
    }
  ];

  const categoricalEncoding = [
    { feature: 'positions', uniqueValues: 889, method: 'Label Encoding' },
    { feature: 'preferred_foot', uniqueValues: 2, method: 'Label Encoding' },
    { feature: 'body_type', uniqueValues: 3, method: 'Label Encoding (setelah cleaning)' }
  ];

  const cleaningSteps = [
    {
      step: 1,
      title: 'Penghapusan Duplikasi',
      description: 'Menghapus baris duplikat dari dataset',
      result: 'Tidak ditemukan data duplikat',
      icon: <Database className="w-5 h-5" />
    },
    {
      step: 2,
      title: 'Pembersihan Data Kategorikal',
      description: 'Membersihkan nilai noise pada kolom body_type',
      result: 'Menghapus nilai seperti "Messi", "C. Ronaldo", "Neymar" dari body_type',
      icon: <Filter className="w-5 h-5" />
    },
    {
      step: 3,
      title: 'Filter Target Variables',
      description: 'Menyaring baris dengan target variables yang hilang',
      result: 'Mempertahankan 17,947 baris dengan overall_rating dan potential yang lengkap',
      icon: <Target className="w-5 h-5" />
    },
    {
      step: 4,
      title: 'Feature Engineering',
      description: 'Membuat fitur komposit dari skill individual',
      result: 'Mengurangi 35 fitur numerik menjadi 19 fitur komposit yang lebih efektif',
      icon: <Settings className="w-5 h-5" />
    },
    {
      step: 5,
      title: 'Encoding Kategorikal',
      description: 'Mengkonversi variabel kategorikal menjadi numerik',
      result: 'Label encoding untuk positions, preferred_foot, dan body_type',
      icon: <RefreshCw className="w-5 h-5" />
    },
    {
      step: 6,
      title: 'Handling Missing Values',
      description: 'Menangani nilai yang hilang pada fitur model',
      result: 'Tidak ditemukan missing values pada fitur final',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Data Cleaning & Transformation
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Proses pembersihan dan transformasi data untuk mempersiapkan dataset FIFA Players 
            dalam prediksi rating pemain sepak bola
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'cleaning', label: 'Cleaning Process', icon: RefreshCw },
            { id: 'features', label: 'Feature Engineering', icon: Zap },
            { id: 'encoding', label: 'Encoding', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50'
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
            
            {/* Dataset Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Statistik Dataset</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Jumlah Baris Awal</span>
                  <span className="font-bold text-blue-600">{cleaningStats.originalRows.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Jumlah Baris Final</span>
                  <span className="font-bold text-green-600">{cleaningStats.finalRows.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Data yang Dibuang</span>
                  <span className="font-bold text-orange-600">{cleaningStats.originalRows - cleaningStats.finalRows}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Kolom Awal</span>
                  <span className="font-bold text-blue-600">{cleaningStats.originalColumns}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Fitur Final</span>
                  <span className="font-bold text-green-600">{cleaningStats.finalFeatures}</span>
                </div>
              </div>
            </div>

            {/* Missing Data Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Analisis Missing Data</h3>
              </div>
              
              <div className="space-y-3">
                {missingDataAnalysis.slice(0, 5).map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.feature}</span>
                      <span className="text-sm text-orange-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Fitur dengan missing data tinggi
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Cleaning Process Tab */}
        {activeTab === 'cleaning' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Langkah-langkah Data Cleaning</h3>
              
              <div className="space-y-6">
                {cleaningSteps.map((step, index) => (
                  <div key={index} className="relative">
                    {index < cleaningSteps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-200 to-green-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {step.icon}
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        
                        <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <p className="text-green-800 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            {step.result}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feature Engineering Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Composite Features</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureEngineering.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <p className="text-xs text-indigo-800 font-medium">{feature.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Alasan Feature Engineering</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Menggabungkan skill individual menjadi composite features mengurangi dimensionalitas 
                      dari 35 fitur menjadi 19 fitur dan meningkatkan 
                      interpretabilitas model.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Encoding Tab */}
        {activeTab === 'encoding' && (
          <div className="space-y-6">
            
            {/* Categorical Encoding */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Categorical Encoding</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Fitur</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Unique Values</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoricalEncoding.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm bg-gray-100 rounded">{item.feature}</td>
                        <td className="py-3 px-4 text-blue-600 font-semibold">{item.uniqueValues}</td>
                        <td className="py-3 px-4 text-gray-700">{item.method}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Berhasil
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feature Scaling Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Feature Scaling</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">StandardScaler</h4>
                  <p className="text-gray-600">
                    Menggunakan StandardScaler untuk menormalkan fitur numerik dengan mean = 0 dan std = 1
                  </p>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <code className="text-sm text-blue-800">
                      X_scaled = (X - mean) / std
                    </code>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Missing Value Imputation</h4>
                  <p className="text-gray-600">
                    Menggunakan median imputation untuk menangani missing values pada fitur model
                  </p>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Tidak ditemukan missing values pada fitur final
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Ringkasan Transformasi</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{cleaningStats.finalRows.toLocaleString()}</div>
              <div className="text-blue-100">Data Points Final</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{cleaningStats.finalFeatures}</div>
              <div className="text-blue-100">Fitur Model</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">100%</div>
              <div className="text-blue-100">Data Quality</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              Dataset telah berhasil dibersihkan dan ditransformasi dengan menghapus data noise, 
              membuat composite features yang bermakna, dan mengaplikasikan encoding yang tepat 
              untuk mempersiapkan data dalam machine learning model.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DataCleaning;
