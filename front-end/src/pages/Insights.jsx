import React, { useState, useEffect } from 'react';
import { 
  Lightbulb,
  TrendingUp,
  Target,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Star,
  Eye,
  Brain,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Trophy,
  Clock,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Info,
  Bookmark,
  Search,
  Download,
  Share2
} from 'lucide-react';

const Insights = () => {
  const [activeCategory, setActiveCategory] = useState('overall');
  const [selectedInsight, setSelectedInsight] = useState(null);

  // Data insights berdasarkan hasil analisis fix.ipynb
  const insights = {
    overall: [
      {
        id: 'model-performance',
        title: 'Model Prediksi Akurat',
        type: 'success',
        priority: 'high',
        category: 'Kualitas Model',
        summary: 'Model berhasil memprediksi rating pemain dengan tingkat akurasi 93.8% - artinya hampir selalu benar!',
        details: [
          'Dari 100 prediksi, 94 prediksi benar (93.8% akurat)',
          'Rata-rata kesalahan hanya 1.73 poin (sangat kecil untuk skala 0-100)',
          'Jika prediksi 80, rating sebenarnya biasanya antara 78-82',
          'Konsisten akurat di berbagai jenis data dan kondisi'
        ],
        recommendation: '✅ Model sudah siap digunakan untuk menilai pemain dalam proses transfer dan scouting',
        impact: 'Tinggi - Tim dapat percaya pada prediksi ini untuk keputusan penting',
        metrics: { accuracy: 93.8, reliability: 95, confidence: 92 }
      },
      {
        id: 'feature-dominance',
        title: '3 Skill Utama Penentu Rating Tinggi',
        type: 'info',
        priority: 'high',
        category: 'Analisis Kemampuan',
        summary: 'Reactions (reaksi cepat), Composure (tenang), dan Ball Control (kontrol bola) adalah kunci pemain berkualitas',
        details: [
          'Reactions (12.5%) - Kemampuan bereaksi cepat saat situasi berubah',
          'Composure (11.6%) - Tetap tenang dan fokus di bawah tekanan lawan',
          'Ball Control (10.9%) - Mengontrol bola dengan sempurna dalam berbagai situasi',
          'Short Passing (9.9%) - Akurasi operan pendek yang konsisten'
        ],
        recommendation: '🎯 Fokus latihan pada 3 skill ini untuk meningkatkan rating pemain secara efektif',
        impact: 'Sedang - Panduan konkret untuk program latihan tim dan akademi',
        metrics: { importance: 44.9, coverage: 4, reliability: 88 }
      },
      {
        id: 'age-factor',
        title: 'Faktor Usia: Pengalaman vs Potensi',
        type: 'warning',
        priority: 'medium',
        category: 'Analisis Usia',
        summary: 'Usia mempengaruhi rating saat ini dan potensi masa depan dengan cara yang berbeda',
        details: [
          'Untuk rating saat ini: Usia lebih tua = lebih berpengalaman (pengaruh 8.8%)',
          'Untuk potensi: Usia muda = potensi tinggi untuk berkembang (pengaruh 21.5%)',
          'Usia ideal 22-26 tahun: keseimbangan antara kemampuan sekarang dan potensi',
          'Pemain di atas 30 tahun: potensi berkembang mulai menurun signifikan'
        ],
        recommendation: '⚖️ Buat strategi berbeda: rekrut pemain berpengalaman untuk kebutuhan sekarang, pemain muda untuk masa depan',
        impact: 'Tinggi - Menentukan strategi transfer jangka pendek vs jangka panjang',
        metrics: { correlation: 65, significance: 21.5, impact: 85 }
      },
      {
        id: 'composite-features',
        title: 'Pengelompokan Skill Lebih Efisien',
        type: 'success',
        priority: 'medium',
        category: 'Optimasi Sistem',
        summary: 'Berhasil menyederhanakan 51 skill menjadi kelompok-kelompok utama tanpa mengurangi akurasi',
        details: [
          'Kecepatan: menggabungkan akselerasi dan sprint speed menjadi satu nilai',
          'Kemampuan Mencetak Gol: 5 skill shooting dijadikan 1 nilai komprehensif',
          'Kemampuan Passing: 5 jenis passing disatukan menjadi 1 nilai passing',
          'Bertahan & Fisik: kemampuan defending dan physical dalam 1 kelompok'
        ],
        recommendation: '📊 Gunakan sistem pengelompokan ini untuk evaluasi pemain yang lebih simpel dan cepat',
        impact: 'Sedang - Membuat analisis pemain lebih mudah dipahami dan efisien',
        metrics: { efficiency: 78, reduction: 68, performance: 92 }
      }
    ],
    potential: [
      {
        id: 'youth-potential',
        title: 'Pemain Muda = Investasi Emas',
        type: 'success',
        priority: 'high',
        category: 'Pengembangan Pemain Muda',
        summary: 'Semakin muda pemain, semakin tinggi potensi berkembangnya - usia adalah faktor terpenting (21.5%)',
        details: [
          'Pemain usia 16-20 tahun punya potensi berkembang paling tinggi',
          'Setiap tahun bertambah tua = potensi berkembang menurun 65%',
          'Model bisa menemukan "berlian tersembunyi" di usia muda dengan akurasi 84.2%',
          'Investasi pada pemain muda memberikan keuntungan terbesar dalam jangka panjang'
        ],
        recommendation: '💎 Prioritaskan scouting dan rekrutmen pemain berusia 16-22 tahun untuk investasi masa depan terbaik',
        impact: 'Sangat Tinggi - Kunci sukses jangka panjang klub',
        metrics: { correlation: 21.5, accuracy: 84.2, roi: 95 }
      },
      {
        id: 'potential-gap',
        title: 'Cari Pemain dengan "Gap Potensi" Besar',
        type: 'info',
        priority: 'high',
        category: 'Strategi Transfer',
        summary: 'Ada pemain yang rating sekarang rendah tapi punya potensi sangat tinggi - ini peluang emas!',
        details: [
          'Rata-rata selisih potensi-rating sekarang adalah 8.3 poin',
          'Pemain dengan selisih >15 poin berpotensi "meledak" performanya',
          '23% pemain punya potensi 10+ poin di atas rating sekarang',
          'Selisih terbesar biasanya di pemain usia 18-21 tahun'
        ],
        recommendation: '🎯 Target pemain muda dengan gap potensi tinggi sebelum harga mereka naik drastis',
        impact: 'Tinggi - Peluang mendapatkan pemain bagus dengan harga murah',
        metrics: { avgGap: 8.3, highGap: 23, opportunity: 87 }
      },
      {
        id: 'development-factors',
        title: 'Resep Mengembangkan Potensi Pemain',
        type: 'info',
        priority: 'medium',
        category: 'Program Latihan',
        summary: 'Ada 4 aspek utama yang harus dilatih agar potensi pemain bisa terwujud maksimal',
        details: [
          'Teknik Dasar (Ball Control, Reactions) - fondasi yang harus kuat dari awal',
          'Mental (Composure) - kemampuan tetap fokus di situasi sulit, butuh waktu',
          'Fisik - lebih mudah dilatih di usia muda, harus dimulai sejak dini',
          'Taktik (Positioning) - berkembang seiring pengalaman bermain'
        ],
        recommendation: '🏋️ Buat program latihan menyeluruh: teknik dasar + mental + fisik + taktik untuk hasil optimal',
        impact: 'Sedang - Panduan praktis untuk akademi dan pengembangan pemain',
        metrics: { technical: 85, mental: 78, physical: 82, tactical: 75 }
      }
    ],
    business: [
      {
        id: 'transfer-intelligence',
        title: 'Transfer Cerdas Berdasarkan Data',
        type: 'success',
        priority: 'high',
        category: 'Strategi Transfer',
        summary: 'Dengan prediksi akurat ini, klub bisa menghindari transfer yang merugikan dan menemukan pemain berkualitas',
        details: [
          'Hindari membayar terlalu mahal - tahu nilai sebenarnya pemain',
          'Temukan pemain berkualitas yang masih "murah" sebelum orang lain sadar',
          'Evaluasi risiko: lebih aman rekrut pemain senior atau muda?',
          'Negosiasi lebih kuat dengan data pendukung yang objektif'
        ],
        recommendation: '💰 Gunakan prediksi ini dalam setiap keputusan transfer untuk menghemat uang dan meningkatkan peluang sukses',
        impact: 'Sangat Tinggi - Menghemat biaya transfer hingga 30% dan meningkatkan kesuksesan',
        metrics: { accuracy: 91.3, savings: 30, success: 85 }
      },
      {
        id: 'scouting-revolution',
        title: 'Scouting Modern dengan AI',
        type: 'info',
        priority: 'high',
        category: 'Sistem Scouting',
        summary: 'Ganti cara lama mencari pemain (subjektif) dengan sistem AI yang objektif dan lebih luas jangkauannya',
        details: [
          'Penilaian standar: semua pemain dinilai dengan 22 kriteria yang sama',
          'Hilangkan bias pribadi: tidak terpengaruh selera atau preferensi scout',
          'Jangkauan lebih luas: bisa "scout" ribuan pemain sekaligus',
          'Temukan bakat lebih dulu: deteksi dini sebelum klub lain mengetahuinya'
        ],
        recommendation: '🔍 Implementasikan sistem scouting berbasis AI untuk keunggulan kompetitif di pasar transfer',
        impact: 'Tinggi - Modernisasi sistem pencarian bakat dan akuisisi pemain',
        metrics: { efficiency: 85, coverage: 200, accuracy: 88 }
      },
      {
        id: 'academy-optimization',
        title: 'Optimasi Program Akademi',
        type: 'warning',
        priority: 'medium',
        category: 'Akademi Muda',
        summary: 'Ubah kurikulum akademi berdasarkan temuan: fokus pada skill yang benar-benar penting',
        details: [
          'Prioritas latihan: Reactions, Ball Control, dan Composure (skill paling berpengaruh)',
          'Program berbeda per usia: sesuaikan dengan pola perkembangan potensi',
          'Monitor objektif: pakai metrik terukur untuk pantau kemajuan',
          'Strategi retensi: pertahankan pemain dengan potensi tertinggi'
        ],
        recommendation: '🎓 Revisi kurikulum akademi untuk fokus pada skill yang terbukti paling penting bagi kesuksesan',
        impact: 'Sedang - Meningkatkan kualitas lulusan akademi dan efektivitas program',
        metrics: { efficiency: 75, retention: 82, development: 78 }
      },
      {
        id: 'financial-planning',
        title: 'Perencanaan Keuangan yang Lebih Baik',
        type: 'info',
        priority: 'medium',
        category: 'Manajemen Keuangan',
        summary: 'Gunakan prediksi ini untuk mengatur budget transfer dan pengembangan pemain dengan lebih efektif',
        details: [
          'Prediksi ROI: perkirakan keuntungan dari berbagai skenario investasi',
          'Prioritas budget: alokasikan uang ke area yang memberikan dampak terbesar',
          'Penilaian risiko: hitung nilai pemain dengan mempertimbangkan risiko',
          'Perencanaan jangka panjang: strategi keuangan berdasarkan prediksi masa depan'
        ],
        recommendation: '💼 Integrasikan prediksi ini dalam perencanaan keuangan strategis untuk penggunaan budget yang optimal',
        impact: 'Sedang - Penggunaan sumber daya lebih efisien dan sustainabilitas finansial',
        metrics: { roi: 78, optimization: 85, planning: 80 }
      }
    ],
    technical: [
      {
        id: 'model-reliability',
        title: 'Sistem Prediksi Sangat Stabil',
        type: 'success',
        priority: 'high',
        category: 'Kualitas Sistem',
        summary: 'Sistem telah diuji berkali-kali dengan berbagai data dan hasilnya selalu konsisten dan dapat diandalkan',
        details: [
          'Diuji 5 kali dengan data berbeda, hasilnya selalu stabil',
          'Performa konsisten di berbagai jenis data pemain',
          'Tidak ada tanda-tanda "overfitting" (terlalu focus pada data latihan)',
          'Bisa memprediksi dengan baik untuk pemain yang belum pernah dilihat sebelumnya'
        ],
        recommendation: '✅ Sistem siap digunakan dalam operasional sehari-hari dengan tingkat kepercayaan tinggi',
        impact: 'Sangat Tinggi - Fondasi yang solid untuk semua aplikasi bisnis',
        metrics: { stability: 95, consistency: 92, generalization: 89 }
      },
      {
        id: 'prediction-accuracy',
        title: 'Akurasi Prediksi di Semua Level',
        type: 'info',
        priority: 'high',
        category: 'Kinerja Sistem',
        summary: 'Sistem bekerja dengan baik untuk semua jenis pemain, dari pemain biasa hingga bintang kelas dunia',
        details: [
          'Pemain elite (90-100): Prediksi sangat akurat dengan error minimal',
          'Pemain bagus (70-80): Performa stabil dan konsisten',
          'Pemain rata-rata (60-70): Prediksi reliable untuk mayoritas pemain',
          'Pemain level bawah: Akurasi masih dapat diterima untuk penggunaan praktis'
        ],
        recommendation: '🔧 Lakukan monitoring rutin dan update sistem untuk menjaga akurasi tetap optimal',
        impact: 'Tinggi - Memastikan akurasi berkelanjutan untuk semua aplikasi bisnis',
        metrics: { overall: 91.3, elite: 95, average: 88, consistency: 90 }
      },
      {
        id: 'feature-optimization',
        title: 'Sistem yang Efisien dan Mudah Dipahami',
        type: 'success',
        priority: 'medium',
        category: 'Optimasi Sistem',
        summary: 'Berhasil menyederhanakan sistem: dari 51 data rumit menjadi 22 data penting tanpa kehilangan akurasi',
        details: [
          'Pengurangan 57% kompleksitas tanpa mengurangi kualitas informasi',
          'Pengelompokan skill yang logis dan mudah dipahami',
          'Encoding kategori yang efisien tapi tetap akurat',
          'Data 100% bersih tanpa ada nilai yang hilang'
        ],
        recommendation: '⚙️ Pertahankan pipeline data yang sudah optimal ini untuk konsistensi kualitas data',
        impact: 'Sedang - Sistem yang efisien dengan interpretasi yang mudah dipahami',
        metrics: { reduction: 57, quality: 100, efficiency: 85, interpretability: 82 }
      },
    ]
  };

  // Summary statistics
  const summaryStats = {
    totalInsights: Object.values(insights).flat().length,
    highPriority: Object.values(insights).flat().filter(i => i.priority === 'high').length,
    successRate: 91.3,
    potentialSavings: '30%',
    roiImprovement: '85%',
    accuracyBenchmark: '93.8%'
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  const categories = [
    { id: 'overall', label: 'Performa Keseluruhan', icon: Target, color: 'blue' },
    { id: 'potential', label: 'Analisis Potensi', icon: TrendingUp, color: 'green' },
    { id: 'business', label: 'Dampak Bisnis', icon: BarChart3, color: 'purple' },
    { id: 'technical', label: 'Aspek Teknis', icon: Brain, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Insights & Rekomendasi
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Temuan penting dan saran praktis dari analisis machine learning untuk membantu keputusan transfer dan pengembangan pemain FIFA
          </p>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Kategori Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = insights[category.id].length;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? `border-${category.color}-500 bg-${category.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-6 h-6 ${
                      isActive ? `text-${category.color}-600` : 'text-gray-500'
                    }`} />
                    <span className={`font-semibold ${
                      isActive ? `text-${category.color}-900` : 'text-gray-700'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${
                    isActive ? `text-${category.color}-600` : 'text-gray-600'
                  }`}>
                    {count}
                  </div>
                  <div className="text-sm text-gray-500">Insights Available</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Insights Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Insights List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {categories.find(c => c.id === activeCategory)?.label} Insights
              </h3>
              <div className="text-sm text-gray-500">
                {insights[activeCategory].length} insights found
              </div>
            </div>

            {insights[activeCategory].map((insight) => (
              <div
                key={insight.id}
                className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all hover:shadow-xl ${
                  selectedInsight?.id === insight.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(insight.type)}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{insight.title}</h4>
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">{insight.category}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>

                <p className="text-gray-700 mb-4">{insight.summary}</p>
              </div>
            ))}
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 sticky top-6">
              {selectedInsight ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      {getTypeIcon(selectedInsight.type)}
                      <h4 className="text-lg font-bold text-gray-900">{selectedInsight.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xs text-gray-500">{selectedInsight.category}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Detail Analysis
                    </h5>
                    <ul className="space-y-2">
                      {selectedInsight.details.map((detail, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                      Rekomendasi
                    </h5>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {selectedInsight.recommendation}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-500" />
                      Business Impact
                    </h5>
                    <p className="text-sm text-gray-700">
                      {selectedInsight.impact}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Select an Insight</h4>
                  <p className="text-gray-600">
                    Klik pada insight di sebelah kiri untuk melihat detail analysis dan rekomendasi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
