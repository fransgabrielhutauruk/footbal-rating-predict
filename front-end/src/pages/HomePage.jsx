import React from 'react';
import { 
  Users, 
  Target, 
  BarChart3, 
  Brain, 
  ChevronRight,
  Database,
  Zap
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4">⚽</span>
            <div>
              <h1 className="text-4xl font-bold">FIFA Player Analytics Dashboard</h1>
              <p className="text-lg opacity-90">Data Science Project - Player Rating & Potential Prediction</p>
            </div>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Dashboard analisis untuk prediksi rating dan potensi pemain FIFA<br />
            menggunakan pendekatan dynamic input features dan dual-model architecture.
          </p>
        </div>
      </div>

      {/* Ringkasan Proyek dan Tujuan Analisis */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-3">🎯</span>
          Ringkasan Proyek dan Tujuan Analisis
        </h2>
        
        <div className="space-y-8">
          {/* Latar Belakang */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Latar Belakang Masalah</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Industri sepak bola modern telah berkembang menjadi ekosistem kompleks yang sangat bergantung pada 
                data dan analitik untuk pengambilan keputusan strategis. Klub-klub sepak bola, scout, agen pemain, 
                dan analis olahraga menghadapi tantangan besar dalam mengevaluasi dan memprediksi kemampuan pemain dengan akurat.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Dalam konteks rekrutmen dan pengembangan talenta, kemampuan untuk memprediksi rating pemain saat ini 
                dan potensi masa depan menjadi krusial untuk membuat keputusan investasi yang tepat. Scouts sering kali 
                harus membuat penilaian cepat berdasarkan informasi terbatas, sementara klub membutuhkan prediksi yang 
                akurat untuk perencanaan jangka panjang.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">🚨 Tantangan Utama</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Evaluasi pemain dengan data terbatas</li>
                    <li>• Kebutuhan sistem yang fleksibel dengan input minimal</li>
                    <li>• Model tradisional memerlukan data lengkap untuk akurasi</li>
                    <li>• Interpretasi hasil prediksi untuk pengambilan keputusan</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Solusi yang Dibutuhkan</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Sistem fleksibel dengan dynamic input features</li>
                    <li>• Model terpisah untuk rating dan potensi</li>
                    <li>• Adaptasi dengan berbagai tingkat kelengkapan data</li>
                    <li>• Confidence scoring untuk reliability assessment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Tujuan Analisis */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Tujuan Analisis</h3>
            
            {/* Tujuan Utama */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-3">🏆 Tujuan Utama</h4>
              <p className="text-green-700 leading-relaxed">
                Mengembangkan sistem prediksi multi-target yang dapat secara simultan memprediksi 
                <strong> overall rating </strong> dan <strong> potential rating </strong> pemain FIFA dengan tingkat akurasi tinggi, 
                sambil memberikan fleksibilitas dalam jumlah dan jenis input features yang digunakan.
              </p>
            </div>

            {/* Tujuan Spesifik */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Tujuan Spesifik</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-800">Dual-Model Architecture</h5>
                      <p className="text-gray-600 text-sm">
                        Membangun dua model terpisah yang dioptimalkan secara khusus untuk prediksi rating dan potensi, 
                        dengan recognition bahwa kedua target memiliki pola dan faktor penentu yang berbeda.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-800">Dynamic Input System</h5>
                      <p className="text-gray-600 text-sm">
                        Merancang sistem yang dapat menerima input bervariasi mulai dari minimal 6 features 
                        hingga komprehensif (20+ features) tanpa banyak mengorbankan kemampuan prediksi.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-800">Optimalisasi Akurasi</h5>
                      <p className="text-gray-600 text-sm">
                        Mencapai tingkat akurasi prediksi yang tinggi dengan target minimal 90% untuk input lengkap 
                        dan 80% untuk input minimal.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ChevronRight className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-800">Confidence Scoring</h5>
                      <p className="text-gray-600 text-sm">
                        Mengimplementasikan sistem scoring yang dapat memberikan tingkat kepercayaan prediksi 
                        berdasarkan kelengkapan input dan historical accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deskripsi Dataset */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-3">📊</span>
          Deskripsi Dataset
        </h2>
        
        {/* Dataset Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📈 FIFA Football Players Dataset</h3>
          <p className="text-blue-700 leading-relaxed mb-4">
            Dataset yang digunakan dalam analisis ini adalah <strong>FIFA Football Players Dataset</strong> yang didapat dari <strong>Kaggle</strong> yang bersumber dari 
            <strong> sofifa.com</strong>, sebuah platform terpercaya yang menyediakan statistik komprehensif pemain sepak bola 
            berdasarkan game FIFA.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">17,954</p>
                <p className="text-sm text-blue-600">Professional Players (Row)</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">51</p>
                <p className="text-sm text-green-600">Attributes per Player (Column)</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700">Global</p>
                <p className="text-sm text-purple-600">Coverage</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center">
                <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-700">Current</p>
                <p className="text-sm text-orange-600">Updated 2 Years Ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kategori Variabel */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">📋 Kategori Variabel Utama</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  1. Informasi Dasar Pemain
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Name & Full Name:</strong> Nama pendek dan lengkap</li>
                  <li>• <strong>Birth Date & Age:</strong> Tanggal lahir dan usia</li>
                  <li>• <strong>Nationality:</strong> Kebangsaan pemain</li>
                  <li>• <strong>Physical:</strong> Height (cm), Weight (kgs)</li>
                  <li>• <strong>Body Type:</strong> Tipe tubuh pemain</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
                  2. Rating dan Kemampuan
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Overall Rating:</strong> Rating keseluruhan (0-100)</li>
                  <li>• <strong>Potential:</strong> Potensi maksimal pemain</li>
                  <li>• <strong>Positions:</strong> Posisi yang dapat dimainkan</li>
                  <li>• <strong>Preferred Foot:</strong> Kaki dominan (left/right)</li>
                  <li>• <strong>Skills:</strong> Weak Foot (1-5), Skill Moves (1-5)</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Target className="w-5 h-5 text-purple-500 mr-2" />
                  3. Informasi Ekonomi & Tim
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Value Euro:</strong> Nilai pasar dalam Euro</li>
                  <li>• <strong>Wage Euro:</strong> Gaji pemain per minggu</li>
                  <li>• <strong>Release Clause Euro:</strong> Klausul pelepasan</li>
                  <li>• <strong>International Reputation:</strong> Reputasi (1-5)</li>
                  <li>• <strong>National Team:</strong> Tim nasional & rating</li>
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Zap className="w-5 h-5 text-orange-500 mr-2" />
                  4. Tim Nasional
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>National Team:</strong> Tim nasional yang diwakili</li>
                  <li>• <strong>National Rating:</strong> Rating di tim nasional</li>
                  <li>• <strong>National Position:</strong> Posisi di tim nasional</li>
                  <li>• <strong>Jersey Number:</strong> Nomor punggung nasional</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">⚽ 5. Atribut Teknis Detil (30 Attributes)</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <p className="font-medium text-red-600 mb-1">🥅 Attacking (5):</p>
                    <p>Crossing, Finishing, Heading Accuracy, Short Passing, Volleys</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600 mb-1">🏃 Movement (5):</p>
                    <p>Acceleration, Sprint Speed, Agility, Reactions, Balance</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600 mb-1">💪 Power (5):</p>
                    <p>Shot Power, Jumping, Stamina, Strength, Long Shots</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600 mb-1">🛡️ Defending (4):</p>
                    <p>Interceptions, Marking, Standing Tackle, Sliding Tackle</p>
                  </div>
                  <div>
                    <p className="font-medium text-orange-600 mb-1">🎯 Skill (6):</p>
                    <p>Dribbling, Curve, FK Accuracy, Long Passing, Ball Control</p>
                  </div>
                  <div>
                    <p className="font-medium text-indigo-600 mb-1">🧠 Mental (5):</p>
                    <p>Aggression, Positioning, Vision, Penalties, Composure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kualitas Dataset */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✅ Ringkasan Dataset</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-green-800">17,954 Pemain</p>
              </div>
              <p className="text-xs text-gray-600">Professional players</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-blue-800">51 Atribut</p>
              </div>
              <p className="text-xs text-gray-600">Komprehensif per pemain</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-purple-800">30 Teknis</p>
              </div>
              <p className="text-xs text-gray-600">Skill attributes detail</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-orange-800">Global Coverage</p>
              </div>
              <p className="text-xs text-gray-600">Berbagai negara & liga</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-yellow-800">FIFA Based</p>
              </div>
              <p className="text-xs text-gray-600">Akurat & terpercaya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;