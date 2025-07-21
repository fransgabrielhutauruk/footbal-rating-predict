import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { 
  BarChart3, 
  Activity, 
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  Eye,
  Layers
} from 'lucide-react';

const EDAVisualization = () => {
  const [activeChart, setActiveChart] = useState('eda-descriptive');
  const [scatterData, setScatterData] = useState(null);
  const [descriptiveStats, setDescriptiveStats] = useState(null);

  // Sample FIFA players data untuk visualisasi - berdasarkan data asli dari fix.ipynb
  const rawPlayersData = [
    { name: "L. Messi", age: 36, overall: 93, potential: 93, pace: 81, shooting: 92, passing: 94, dribbling: 95, defending: 38, physical: 65, position: "RW", nationality: "Argentina", value: 45000000, wage: 1000000 },
    { name: "E. Haaland", age: 23, overall: 91, potential: 94, pace: 87, shooting: 94, passing: 71, dribbling: 80, defending: 45, physical: 92, position: "ST", nationality: "Norway", value: 180000000, wage: 350000 },
    { name: "K. Mbappé", age: 24, overall: 92, potential: 95, pace: 97, shooting: 89, passing: 82, dribbling: 92, defending: 39, physical: 78, position: "ST", nationality: "France", value: 180000000, wage: 1000000 },
    { name: "V. Junior", age: 23, overall: 89, potential: 94, pace: 95, shooting: 83, passing: 85, dribbling: 94, defending: 30, physical: 69, position: "LW", nationality: "Brazil", value: 120000000, wage: 200000 },
    { name: "J. Bellingham", age: 20, overall: 87, potential: 94, pace: 74, shooting: 80, passing: 86, dribbling: 87, defending: 78, physical: 86, position: "CM", nationality: "England", value: 120000000, wage: 250000 },
    { name: "Pedri", age: 21, overall: 85, potential: 93, pace: 69, shooting: 71, passing: 91, dribbling: 91, defending: 59, physical: 68, position: "CM", nationality: "Spain", value: 90000000, wage: 120000 },
    { name: "Gavi", age: 19, overall: 82, potential: 91, pace: 73, shooting: 63, passing: 86, dribbling: 89, defending: 67, physical: 73, position: "CM", nationality: "Spain", value: 70000000, wage: 50000 },
    { name: "R. Lewandowski", age: 35, overall: 91, potential: 91, pace: 75, shooting: 92, passing: 79, dribbling: 86, defending: 44, physical: 82, position: "ST", nationality: "Poland", value: 15000000, wage: 400000 },
    { name: "K. De Bruyne", age: 32, overall: 91, potential: 91, pace: 76, shooting: 88, passing: 93, dribbling: 88, defending: 64, physical: 78, position: "CM", nationality: "Belgium", value: 45000000, wage: 350000 },
    { name: "N. Kante", age: 33, overall: 87, potential: 87, pace: 77, shooting: 66, passing: 81, dribbling: 82, defending: 88, physical: 82, position: "CDM", nationality: "France", value: 15000000, wage: 290000 },
    { name: "Casemiro", age: 31, overall: 88, potential: 88, pace: 62, shooting: 67, passing: 75, dribbling: 72, defending: 88, physical: 90, position: "CDM", nationality: "Brazil", value: 25000000, wage: 350000 },
    { name: "V. van Dijk", age: 32, overall: 89, potential: 89, pace: 77, shooting: 60, passing: 71, dribbling: 72, defending: 91, physical: 86, position: "CB", nationality: "Netherlands", value: 35000000, wage: 290000 },
    { name: "K. Walker", age: 33, overall: 84, potential: 84, pace: 93, shooting: 59, passing: 68, dribbling: 73, defending: 83, physical: 78, position: "RB", nationality: "England", value: 10000000, wage: 170000 },
    { name: "T. Courtois", age: 31, overall: 89, potential: 89, pace: 48, shooting: 17, passing: 35, dribbling: 29, defending: 15, physical: 78, position: "GK", nationality: "Belgium", value: 60000000, wage: 220000 },
    { name: "A. Ter Stegen", age: 31, overall: 87, potential: 87, pace: 43, shooting: 15, passing: 38, dribbling: 31, defending: 12, physical: 76, position: "GK", nationality: "Germany", value: 50000000, wage: 220000 },
    // Menambah data yang lebih beragam untuk visualisasi yang lebih kaya
    { name: "Talent Muda 1", age: 17, overall: 65, potential: 85, pace: 85, shooting: 70, passing: 75, dribbling: 80, defending: 45, physical: 60, position: "RW", nationality: "England", value: 5000000, wage: 15000 },
    { name: "Talent Muda 2", age: 18, overall: 68, potential: 88, pace: 90, shooting: 75, passing: 70, dribbling: 85, defending: 40, physical: 65, position: "ST", nationality: "Brazil", value: 8000000, wage: 25000 },
    { name: "Pemain Veteran", age: 38, overall: 75, potential: 75, pace: 55, shooting: 80, passing: 85, dribbling: 70, defending: 60, physical: 65, position: "CM", nationality: "Italy", value: 2000000, wage: 80000 },
    { name: "Pemain Rata-rata 1", age: 26, overall: 72, potential: 76, pace: 70, shooting: 72, passing: 75, dribbling: 73, defending: 65, physical: 74, position: "CM", nationality: "Germany", value: 12000000, wage: 85000 },
    { name: "Pemain Rata-rata 2", age: 28, overall: 76, potential: 78, pace: 75, shooting: 76, passing: 78, dribbling: 75, defending: 70, physical: 78, position: "CB", nationality: "Spain", value: 18000000, wage: 120000 },
    // Data tambahan untuk distribusi yang lebih baik
    { name: "Bek Muda", age: 19, overall: 70, potential: 83, pace: 78, shooting: 45, passing: 68, dribbling: 65, defending: 80, physical: 82, position: "CB", nationality: "France", value: 15000000, wage: 35000 },
    { name: "Gelandang Senior", age: 34, overall: 83, potential: 83, pace: 65, shooting: 75, passing: 88, dribbling: 82, defending: 72, physical: 68, position: "CM", nationality: "Argentina", value: 8000000, wage: 180000 },
    { name: "Striker Muda", age: 20, overall: 74, potential: 87, pace: 88, shooting: 82, passing: 68, dribbling: 85, defending: 35, physical: 75, position: "ST", nationality: "Portugal", value: 35000000, wage: 75000 },
    { name: "Kiper Veteran", age: 36, overall: 85, potential: 85, pace: 45, shooting: 12, passing: 42, dribbling: 28, defending: 18, physical: 72, position: "GK", nationality: "Italy", value: 8000000, wage: 150000 }
  ];

  // Load data from JSON files
  useEffect(() => {
    // Load scatter plot data
    fetch('/scatter_plots.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Scatter plot data loaded successfully:', data);
        setScatterData(data);
      })
      .catch(error => {
        console.error('Error loading scatter plot data:', error);
        setScatterData(null);
      });

    // Load descriptive statistics data
    fetch('/descriptive_stats.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Descriptive statistics loaded successfully:', data);
        setDescriptiveStats(data);
      })
      .catch(error => {
        console.error('Error loading descriptive statistics:', error);
        setDescriptiveStats(null);
      });
  }, []);

  // Scatter Plot: Overall vs Potential - menggunakan data dari scatter_plots.json
  const scatterPlotOption = scatterData ? {
    title: {
      text: scatterData.overallVsPotential.title,
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.data;
        return `
          <strong>${data.name}</strong><br/>
          Usia: ${data.age} tahun<br/>
          Rating Keseluruhan: ${data.overall}<br/>
          Potensial: ${data.potential}<br/>
          Posisi: ${data.position}<br/>
          Kebangsaan: ${data.nationality}
        `;
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: ['Penyerang', 'Gelandang', 'Bek', 'Penjaga Gawang'],
      bottom: 0
    },
    xAxis: {
      type: 'value',
      name: scatterData.overallVsPotential.xAxis,
      nameLocation: 'middle',
      nameGap: 30,
      min: 50,
      max: 100
    },
    yAxis: {
      type: 'value',
      name: scatterData.overallVsPotential.yAxis,
      nameLocation: 'middle',
      nameGap: 40,
      min: 50,
      max: 100
    },
    series: [
      {
        name: 'Penyerang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#10B981' },
        data: [
          ...(scatterData.overallVsPotential.data.forwards || []),
          ...((scatterData.overallVsPotential.data.prospects || []).filter(p => ['ST', 'LW', 'RW'].includes(p.position)))
        ]
      },
      {
        name: 'Gelandang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#3B82F6' },
        data: [
          ...(scatterData.overallVsPotential.data.midfielders || []),
          ...((scatterData.overallVsPotential.data.prospects || []).filter(p => ['CM', 'CDM', 'CAM'].includes(p.position)))
        ]
      },
      {
        name: 'Bek',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#EF4444' },
        data: scatterData.overallVsPotential.data.defenders || []
      },
      {
        name: 'Penjaga Gawang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#F59E0B' },
        data: scatterData.overallVsPotential.data.goalkeepers || []
      }
    ]
  } : {
    title: {
      text: 'Rating Keseluruhan vs Rating Potensial',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.data;
        return `
          <strong>${data.name}</strong><br/>
          Usia: ${data.age} tahun<br/>
          Rating Keseluruhan: ${data.overall}<br/>
          Potensial: ${data.potential}<br/>
          Posisi: ${data.position}<br/>
          Kebangsaan: ${data.nationality}
        `;
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: ['Penyerang', 'Gelandang', 'Bek', 'Penjaga Gawang'],
      bottom: 0
    },
    xAxis: {
      type: 'value',
      name: 'Rating Keseluruhan',
      nameLocation: 'middle',
      nameGap: 30,
      min: 50,
      max: 100
    },
    yAxis: {
      type: 'value',
      name: 'Rating Potensial',
      nameLocation: 'middle',
      nameGap: 40,
      min: 50,
      max: 100
    },
    series: [
      {
        name: 'Penyerang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#10B981' },
        data: rawPlayersData.filter(p => ['ST', 'LW', 'RW'].includes(p.position)).map(p => ({
          value: [p.overall, p.potential],
          name: p.name,
          age: p.age,
          overall: p.overall,
          potential: p.potential,
          position: p.position,
          nationality: p.nationality
        }))
      },
      {
        name: 'Gelandang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#3B82F6' },
        data: rawPlayersData.filter(p => ['CM', 'CDM', 'CAM'].includes(p.position)).map(p => ({
          value: [p.overall, p.potential],
          name: p.name,
          age: p.age,
          overall: p.overall,
          potential: p.potential,
          position: p.position,
          nationality: p.nationality
        }))
      },
      {
        name: 'Bek',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#EF4444' },
        data: rawPlayersData.filter(p => ['CB', 'LB', 'RB'].includes(p.position)).map(p => ({
          value: [p.overall, p.potential],
          name: p.name,
          age: p.age,
          overall: p.overall,
          potential: p.potential,
          position: p.position,
          nationality: p.nationality
        }))
      },
      {
        name: 'Penjaga Gawang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#F59E0B' },
        data: rawPlayersData.filter(p => p.position === 'GK').map(p => ({
          value: [p.overall, p.potential],
          name: p.name,
          age: p.age,
          overall: p.overall,
          potential: p.potential,
          position: p.position,
          nationality: p.nationality
        }))
      }
    ]
  };

  // Age vs Potential Scatter Plot - menggunakan data dari scatter_plots.json
  const scatterAgeVsPotentialOption = scatterData ? {
    title: {
      text: scatterData.ageVsPotential.title,
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.data;
        return `
          <strong>${data.name}</strong><br/>
          Usia: ${data.age} tahun<br/>
          Potensial: ${data.potential}<br/>
          Rating Keseluruhan: ${data.overall}<br/>
          Posisi: ${data.position}<br/>
          Kebangsaan: ${data.nationality}
        `;
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: ['Penyerang', 'Gelandang', 'Bek', 'Penjaga Gawang'],
      bottom: 0
    },
    xAxis: {
      type: 'value',
      name: scatterData.ageVsPotential.xAxis,
      nameLocation: 'middle',
      nameGap: 30,
      min: 15,
      max: 40
    },
    yAxis: {
      type: 'value',
      name: scatterData.ageVsPotential.yAxis,
      nameLocation: 'middle',
      nameGap: 40,
      min: 60,
      max: 100
    },
    series: [
      {
        name: 'Penyerang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#10B981' },
        data: (scatterData.ageVsPotential.data || []).filter(p => ['ST', 'LW', 'RW'].includes(p.position))
      },
      {
        name: 'Gelandang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#3B82F6' },
        data: (scatterData.ageVsPotential.data || []).filter(p => ['CM', 'CDM', 'CAM'].includes(p.position))
      },
      {
        name: 'Bek',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#EF4444' },
        data: (scatterData.ageVsPotential.data || []).filter(p => ['CB', 'LB', 'RB'].includes(p.position))
      },
      {
        name: 'Penjaga Gawang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#F59E0B' },
        data: (scatterData.ageVsPotential.data || []).filter(p => p.position === 'GK')
      }
    ]
  } : {
    title: {
      text: 'Usia vs Potensial',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.data;
        return `
          <strong>${data.name}</strong><br/>
          Usia: ${data.age} tahun<br/>
          Potensial: ${data.potential}<br/>
          Rating Keseluruhan: ${data.overall}<br/>
          Posisi: ${data.position}<br/>
          Kebangsaan: ${data.nationality}
        `;
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: ['Penyerang', 'Gelandang', 'Bek', 'Penjaga Gawang'],
      bottom: 0
    },
    xAxis: {
      type: 'value',
      name: 'Usia (Tahun)',
      nameLocation: 'middle',
      nameGap: 30,
      min: 15,
      max: 40
    },
    yAxis: {
      type: 'value',
      name: 'Potensial',
      nameLocation: 'middle',
      nameGap: 40,
      min: 60,
      max: 100
    },
    series: [
      {
        name: 'Penyerang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#10B981' },
        data: rawPlayersData
          .filter(p => ['ST', 'LW', 'RW'].includes(p.position))
          .map(p => ({ 
            name: p.name, 
            value: [p.age, p.potential], 
            age: p.age, 
            potential: p.potential, 
            overall: p.overall,
            position: p.position,
            nationality: p.nationality 
          }))
      },
      {
        name: 'Gelandang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#3B82F6' },
        data: rawPlayersData
          .filter(p => ['CM', 'CDM', 'CAM'].includes(p.position))
          .map(p => ({ 
            name: p.name, 
            value: [p.age, p.potential], 
            age: p.age, 
            potential: p.potential, 
            overall: p.overall,
            position: p.position,
            nationality: p.nationality 
          }))
      },
      {
        name: 'Bek',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#EF4444' },
        data: rawPlayersData
          .filter(p => ['CB', 'LB', 'RB'].includes(p.position))
          .map(p => ({ 
            name: p.name, 
            value: [p.age, p.potential], 
            age: p.age, 
            potential: p.potential, 
            overall: p.overall,
            position: p.position,
            nationality: p.nationality 
          }))
      },
      {
        name: 'Penjaga Gawang',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#F59E0B' },
        data: rawPlayersData
          .filter(p => p.position === 'GK')
          .map(p => ({ 
            name: p.name, 
            value: [p.age, p.potential], 
            age: p.age, 
            potential: p.potential, 
            overall: p.overall,
            position: p.position,
            nationality: p.nationality 
          }))
      }
    ]
  };

  // Age vs Overall Rating Scatter - berdasarkan fix.ipynb
  const ageRatingOption = {
    title: {
      text: 'Hubungan Usia dengan Rating Keseluruhan',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.data;
        return `
          <strong>${data.name}</strong><br/>
          Usia: ${data.age} tahun<br/>
          Rating Keseluruhan: ${data.overall}<br/>
          Posisi: ${data.position}<br/>
          Kategori: ${data.age <= 21 ? 'Muda' : data.age <= 28 ? 'Prima' : data.age <= 33 ? 'Berpengalaman' : 'Veteran'}
        `;
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'value',
      name: 'Usia (tahun)',
      nameLocation: 'middle',
      nameGap: 30,
      min: 15,
      max: 42
    },
    yAxis: {
      type: 'value',
      name: 'Rating Keseluruhan',
      nameLocation: 'middle',
      nameGap: 40,
      min: 50,
      max: 100
    },
    series: [{
      type: 'scatter',
      symbolSize: (data) => Math.sqrt(data[2]) * 2, // Ukuran berdasarkan potensial
      itemStyle: {
        color: (params) => {
          const age = params.data[0];
          if (age <= 21) return '#10B981'; // Muda - Hijau
          if (age <= 28) return '#3B82F6'; // Prima - Biru  
          if (age <= 33) return '#F59E0B'; // Berpengalaman - Orange
          return '#EF4444'; // Veteran - Merah
        }
      },
      data: rawPlayersData.map(p => [p.age, p.overall, p.potential, p.name, p.position])
    }]
  };

  // Correlation Heatmap - berdasarkan hasil analisis sesungguhnya dari fix.ipynb (Data JSON Akurat)
  const correlationAttributes = ['age', 'height_cm', 'weight_kgs', 'overall_rating', 'potential', 'value_euro', 'wage_euro', 'international_reputation(1-5)', 'weak_foot(1-5)', 'skill_moves(1-5)', 'release_clause_euro', 'national_rating', 'national_jersey_number', 'crossing', 'finishing', 'heading_accuracy', 'short_passing', 'volleys', 'dribbling', 'curve', 'freekick_accuracy', 'long_passing', 'ball_control', 'acceleration', 'sprint_speed', 'agility', 'reactions', 'balance', 'shot_power', 'jumping', 'stamina', 'strength', 'long_shots', 'aggression', 'interceptions', 'positioning', 'vision', 'penalties', 'composure', 'marking', 'standing_tackle', 'sliding_tackle'];

  // Import correlation data from external JSON file
  const [correlationJson, setCorrelationJson] = useState(null);

  useEffect(() => {
    // Load correlation data from JSON file
    fetch('/korelasi-information.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Correlation data loaded successfully:', Object.keys(data).length, 'attributes');
        setCorrelationJson(data);
      })
      .catch(error => {
        console.error('Error loading correlation data:', error);
        // Fallback to empty object if file cannot be loaded
        setCorrelationJson({});
      });
  }, []);

  const correlationData = correlationAttributes.map((rowAttr, i) => 
    correlationAttributes.map((colAttr, j) => {
      const value = correlationJson?.[rowAttr]?.[colAttr] || 0;
      return [i, j, value];
    })
  ).flat();

  // Don't render correlation chart if data is not loaded yet or is empty
  if (!correlationJson || Object.keys(correlationJson).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {!correlationJson ? 'Loading correlation data...' : 'No correlation data available. Please check the data file.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const heatmapOption = {
    title: {
      text: 'Matriks Korelasi Atribut Pemain',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      position: 'top',
      formatter: (params) => {
        const row = correlationAttributes[params.data[1]] || '';
        const col = correlationAttributes[params.data[0]] || '';
        return `${col} vs ${row}<br/>Korelasi: ${params.data[2].toFixed(3)}`;
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      },
      right: 20,
      top: 20
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        yAxisIndex: [0],
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        xAxisIndex: [0],
        start: 0,
        end: 100,
        bottom: 10
      },
      {
        type: 'slider',
        yAxisIndex: [0],
        start: 0,
        end: 100,
        right: 8,
        width: 18
      }
    ],
    grid: {
      height: '72%',
      top: '10%',
      left: '9%',
      right: '3%',
      bottom: '25%'
    },
    xAxis: {
      type: 'category',
      data: correlationAttributes.map(attr => attr.replace(/_/g, ' ')),
      splitArea: {
        show: true
      },
      axisLabel: {
        rotate: 45,
        fontSize: 8
      }
    },
    yAxis: {
      type: 'category',
      data: correlationAttributes.map(attr => attr.replace(/_/g, ' ')),
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 8
      }
    },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      text: ['Korelasi Tinggi', 'Korelasi Rendah'],
      textStyle: {
        fontSize: 10
      },
      inRange: {
        color: ['#1e3a8a', '#3b82f6', '#93c5fd', '#dbeafe', '#ffffff', '#fef3c7', '#fbbf24', '#f59e0b', '#d97706', '#92400e']
      }
    },
    series: [{
      name: 'Korelasi',
      type: 'heatmap',
      data: correlationData,
      label: {
        show: true,
        formatter: (params) => {
          const value = params.data[2];
          // if (Math.abs(value) < 0.1) return '';
          return value.toFixed(2);
        },
        fontSize: 7
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };



  const positions = ['Semua', 'ST', 'LW', 'RW', 'CM', 'CDM', 'CAM', 'CB', 'LB', 'RB', 'GK'];
  const nationalities = ['Semua', 'Argentina', 'Norway', 'France', 'Brazil', 'England', 'Spain', 'Belgium', 'Poland', 'Netherlands', 'Germany', 'Italy', 'Portugal'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
              EDA & Visualisasi Data
            </h1>
            <p className="text-gray-600 mt-2">
              Eksplorasi Data Analitik (EDA) dan visualisasi mendalam dari data pemain FIFA untuk memahami pola, tren, dan karakteristik dataset
            </p>
          </div>
        </div>

        {/* Chart Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveChart('eda-descriptive')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
              activeChart === 'eda-descriptive' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="text-xs">EDA Deskriptif</span>
          </button>
          <button
            onClick={() => setActiveChart('scatter-overall')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
              activeChart === 'scatter-overall' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-xs">Overall vs Potential</span>
          </button>
          <button
            onClick={() => setActiveChart('scatter-age')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
              activeChart === 'scatter-age' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-xs">Age vs Potential</span>
          </button>
          <button
            onClick={() => setActiveChart('correlation')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
              activeChart === 'correlation' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-xs">Matriks Korelasi</span>
          </button>

        </div>
      </div>

      {/* Visualizations */}
      {activeChart === 'eda-descriptive' && (
        <div className="space-y-6">
          {/* Key Statistics */}
          {descriptiveStats && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                Statistik Deskriptif Semua Kolom Numerik
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  📊 Menampilkan statistik deskriptif untuk <strong>{Object.keys(descriptiveStats.all_numeric_statistics).length} atribut numerik</strong> dari total {descriptiveStats.overview.numeric_attributes} kolom numerik dalam dataset.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {Object.entries(descriptiveStats.all_numeric_statistics).map(([attr, stats]) => (
                  <div key={attr} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 capitalize">
                      {attr.replace(/_/g, ' ').replace(/euro/g, '(EUR)').replace(/cm/g, '(cm)').replace(/kgs/g, '(kg)')}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mean:</span>
                          <span className="font-medium">{stats.mean.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Median:</span>
                          <span className="font-medium">{stats.median.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Std:</span>
                          <span className="font-medium">{stats.std.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Count:</span>
                          <span className="font-medium">{stats.count.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min:</span>
                          <span className="font-medium">{stats.min.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Q1:</span>
                          <span className="font-medium">{stats.q1.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Q3:</span>
                          <span className="font-medium">{stats.q3.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max:</span>
                          <span className="font-medium">{stats.max.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mini range indicator */}
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">
                        Range: {(stats.max - stats.min).toFixed(1)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            attr.includes('age') ? 'bg-blue-500' :
                            attr.includes('rating') || attr.includes('potential') ? 'bg-green-500' :
                            attr.includes('value') || attr.includes('wage') ? 'bg-yellow-500' :
                            attr.includes('height') || attr.includes('weight') ? 'bg-orange-500' :
                            'bg-purple-500'
                          }`}
                          style={{
                            width: `${Math.min(100, ((stats.q3 - stats.q1) / (stats.max - stats.min)) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  💡 <strong>Tips:</strong> Scroll pada area di atas untuk melihat semua {Object.keys(descriptiveStats.all_numeric_statistics).length} atribut numerik. 
                  Warna bar menunjukkan kategori: 
                  <span className="mx-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">Age</span>
                  <span className="mx-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Rating</span>
                  <span className="mx-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Financial</span>
                  <span className="mx-1 px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">Physical</span>
                  <span className="mx-1 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">Skills</span>
                </p>
              </div>
            </div>
          )}

          {/* Categorical Data Summary */}
          {descriptiveStats && descriptiveStats.categorical_summary && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 text-indigo-600 mr-3" />
                Ringkasan Data Kategorikal
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nationalities */}
                {descriptiveStats.categorical_summary.nationalities && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">🌍 Kebangsaan</h4>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-blue-700">
                        <strong>Total Negara:</strong> {descriptiveStats.categorical_summary.nationalities.unique_countries}
                      </p>
                      <p className="text-sm text-blue-700">
                        <strong>Terbanyak:</strong> {descriptiveStats.categorical_summary.nationalities.most_common_nationality}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-800">Top 5 Negara:</p>
                      {Object.entries(descriptiveStats.categorical_summary.nationalities.top_10_countries).slice(0, 5).map(([country, count]) => (
                        <div key={country} className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">{country}</span>
                          <div className="flex items-center">
                            <div className="w-20 bg-blue-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(100, (count / Object.values(descriptiveStats.categorical_summary.nationalities.top_10_countries)[0]) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-blue-800">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Foot */}
                {descriptiveStats.categorical_summary.preferred_foot && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h4 className="text-lg font-semibold text-green-900 mb-4">🦵 Kaki Dominan</h4>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-green-700">
                        <strong>Total Variasi:</strong> {descriptiveStats.categorical_summary.preferred_foot.unique_values}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Terbanyak:</strong> {descriptiveStats.categorical_summary.preferred_foot.most_common}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-green-800">Distribusi:</p>
                      {Object.entries(descriptiveStats.categorical_summary.preferred_foot.distribution).map(([foot, count]) => (
                        <div key={foot} className="flex justify-between items-center">
                          <span className="text-sm text-green-700">{foot === 'Right' ? '🦵 Kanan' : '🦵 Kiri'}</span>
                          <div className="flex items-center">
                            <div className="w-20 bg-green-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(100, (count / Object.values(descriptiveStats.categorical_summary.preferred_foot.distribution)[0]) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-green-800">{count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Positions */}
                {descriptiveStats.categorical_summary.positions && (
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
                    <h4 className="text-lg font-semibold text-red-900 mb-4">⚽ Posisi Pemain</h4>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-red-700">
                        <strong>Total Posisi:</strong> {descriptiveStats.categorical_summary.positions.unique_positions}
                      </p>
                      <p className="text-sm text-red-700">
                        <strong>Terbanyak:</strong> {descriptiveStats.categorical_summary.positions.most_common_position}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-800">Top 5 Posisi:</p>
                      {Object.entries(descriptiveStats.categorical_summary.positions.distribution).slice(0, 5).map(([position, count]) => (
                        <div key={position} className="flex justify-between items-center">
                          <span className="text-sm text-red-700">
                            {position === 'GK' ? '🥅 Kiper' : 
                             position === 'CB' ? '🛡️ Bek Tengah' : 
                             position === 'ST' ? '⚽ Striker' :
                             position === 'CM' ? '🏃 Gelandang Tengah' :
                             position === 'CDM' ? '🛡️ Defensive Midfielder' :
                             position === 'LM' ? '⬅️ Left Midfielder' :
                             `⭐ ${position}`}
                          </span>
                          <div className="flex items-center">
                            <div className="w-20 bg-red-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(100, (count / Object.values(descriptiveStats.categorical_summary.positions.distribution)[0]) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-red-800">{count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body Type */}
                {descriptiveStats.categorical_summary.body_type && (
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="text-lg font-semibold text-orange-900 mb-4">💪 Tipe Tubuh</h4>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-orange-700">
                        <strong>Total Variasi:</strong> {descriptiveStats.categorical_summary.body_type.unique_values}
                      </p>
                      <p className="text-sm text-orange-700">
                        <strong>Terbanyak:</strong> {descriptiveStats.categorical_summary.body_type.most_common}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-orange-800">Top 5 Tipe:</p>
                      {Object.entries(descriptiveStats.categorical_summary.body_type.distribution).slice(0, 5).map(([bodyType, count]) => (
                        <div key={bodyType} className="flex justify-between items-center">
                          <span className="text-sm text-orange-700 capitalize">
                            {bodyType === 'Normal' ? '📏 Normal' : 
                             bodyType === 'Lean' ? '🏃 Kurus' : 
                             bodyType === 'Stocky' ? '🏋️ Kekar' : 
                             `⭐ ${bodyType}`}
                          </span>
                          <div className="flex items-center">
                            <div className="w-20 bg-orange-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(100, (count / Object.values(descriptiveStats.categorical_summary.body_type.distribution)[0]) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-orange-800">{count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Rate (if available) */}
                {descriptiveStats.categorical_summary.work_rate && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">⚡ Work Rate</h4>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-purple-700">
                        <strong>Total Variasi:</strong> {descriptiveStats.categorical_summary.work_rate.unique_values}
                      </p>
                      <p className="text-sm text-purple-700">
                        <strong>Terbanyak:</strong> {descriptiveStats.categorical_summary.work_rate.most_common}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-purple-800">Distribusi:</p>
                      {Object.entries(descriptiveStats.categorical_summary.work_rate.distribution).slice(0, 5).map(([workRate, count]) => (
                        <div key={workRate} className="flex justify-between items-center">
                          <span className="text-sm text-purple-700">{workRate}</span>
                          <div className="flex items-center">
                            <div className="w-20 bg-purple-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(100, (count / Object.values(descriptiveStats.categorical_summary.work_rate.distribution)[0]) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-purple-800">{count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Info */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">📊 Ringkasan Data Kategorikal:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-700">
                  {descriptiveStats.categorical_summary.nationalities && (
                    <div className="text-center">
                      <p className="font-medium text-blue-800">{descriptiveStats.categorical_summary.nationalities.unique_countries}</p>
                      <p>Negara</p>
                    </div>
                  )}
                  {descriptiveStats.categorical_summary.preferred_foot && (
                    <div className="text-center">
                      <p className="font-medium text-green-800">{descriptiveStats.categorical_summary.preferred_foot.unique_values}</p>
                      <p>Kaki Dominan</p>
                    </div>
                  )}
                  {descriptiveStats.categorical_summary.body_type && (
                    <div className="text-center">
                      <p className="font-medium text-orange-800">{descriptiveStats.categorical_summary.body_type.unique_values}</p>
                      <p>Tipe Tubuh</p>
                    </div>
                  )}
                  {descriptiveStats.categorical_summary.work_rate && (
                    <div className="text-center">
                      <p className="font-medium text-purple-800">{descriptiveStats.categorical_summary.work_rate.unique_values}</p>
                      <p>Work Rate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Missing Data Analysis */}
          {descriptiveStats && Object.keys(descriptiveStats.missing_values).length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 text-red-600 mr-3" />
                Analisis Data Hilang
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(descriptiveStats.missing_values).slice(0, 12).map(([attr, missing]) => (
                  <div key={attr} className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="text-sm font-semibold text-red-900 mb-2 capitalize">
                      {attr.replace(/_/g, ' ')}
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-red-700">Hilang:</span>
                      <span className="font-medium text-red-900">{missing.count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-red-700">Persentase:</span>
                      <span className="font-medium text-red-900">{missing.percentage.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, missing.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {Object.keys(descriptiveStats.missing_values).length > 12 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Dan {Object.keys(descriptiveStats.missing_values).length - 12} atribut lainnya dengan data hilang...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeChart === 'scatter-overall' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <ReactECharts 
            option={scatterPlotOption} 
            style={{ height: '520px' }}
            opts={{ renderer: 'svg' }}
          />
          <div className="mt-4 text-sm text-gray-600 text-center">
            <strong>Scatter Plot Interaktif:</strong> Hubungan antara rating keseluruhan dan potensial pemain.
            Warna menunjukkan posisi berbeda - hover untuk detail lengkap.
          </div>
        </div>
      )}

      {activeChart === 'scatter-age' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <ReactECharts 
            option={scatterAgeVsPotentialOption} 
            style={{ height: '520px' }}
            opts={{ renderer: 'svg' }}
          />
          <div className="mt-4 text-sm text-gray-600 text-center">
            <strong>Scatter Plot Usia vs Potensial:</strong> Menunjukkan hubungan antara usia pemain dan potensi maksimalnya.
            Pemain muda umumnya memiliki gap potensial yang lebih besar.
          </div>
        </div>
      )}

      {activeChart === 'correlation' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <ReactECharts 
            option={heatmapOption} 
            style={{ height: '800px' }}
            opts={{ renderer: 'svg' }}
          />
          <div className="mt-4 space-y-4">
            <div className="text-sm text-gray-600 text-center">
              <strong>Matriks Korelasi Atribut Pemain:</strong> Menunjukkan hubungan statistik antara berbagai kemampuan pemain.
              Warna yang lebih gelap menunjukkan korelasi yang lebih kuat.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div className="bg-blue-50 p-3 rounded-lg">
                <strong className="text-blue-800">Korelasi Kuat Positif:</strong>
                <ul className="list-disc list-inside mt-1 text-blue-700">
                  <li>Standing ↔ Sliding Tackle (0.975)</li>
                  <li>Dribbling ↔ Ball Control (0.942)</li>
                  <li>Acceleration ↔ Sprint Speed (0.926)</li>
                  <li>Short Passing ↔ Ball Control (0.915)</li>
                  <li>Long Shots ↔ Shot Power (0.892)</li>
                  <li>Marking ↔ Interceptions (0.896)</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <strong className="text-green-800">Hubungan dengan Overall Rating:</strong>
                <ul className="list-disc list-inside mt-1 text-green-700">
                  <li>Reactions (0.856) - Atribut paling kuat!</li>
                  <li>National Rating (0.733) - Performa internasional</li>
                  <li>Composure (0.729) - Mental strength</li>
                  <li>Value Euro (0.631) - Nilai pasar</li>
                  <li>Wage Euro (0.577) - Gaji pemain</li>
                  <li>Vision (0.507) - Kemampuan playmaking</li>
                </ul>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <strong className="text-red-800">Korelasi Negatif Signifikan:</strong>
                <ul className="list-disc list-inside mt-1 text-red-700">
                  <li>Balance vs Weight (-0.663) - Berat tubuh vs keseimbangan</li>
                  <li>Agility vs Weight (-0.533) - Berat vs kelincahan</li>
                  <li>Balance vs Height (-0.532) - Tinggi vs keseimbangan</li>
                  <li>Acceleration vs Weight (-0.482) - Berat vs akselerasi</li>
                  <li>Age vs Potential (-0.260) - Usia vs potensi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Data Insights Panel */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Temuan Kunci dari Analisis EDA
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 text-blue-500 mr-2" />
                Statistik Deskriptif Dataset
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Dataset mencakup 17,954 pemain dengan 51 atribut total</li>
                <li>• 42 atribut numerik tersedia untuk analisis statistik</li>
                <li>• Rata-rata usia pemain adalah 25.6 tahun (17-46 tahun)</li>
                <li>• Rating keseluruhan berkisar 47-94 dengan rata-rata 66.2</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Users className="w-4 h-4 text-blue-500 mr-2" />
                Distribusi Kebangsaan & Posisi
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• England, Germany, dan Spain mendominasi jumlah pemain</li>
                <li>• Distribusi posisi relatif seimbang di seluruh posisi</li>
                <li>• Gelandang (CM/CDM) memiliki representasi tertinggi</li>
                <li>• Keragaman kebangsaan tinggi dengan 100+ negara terwakili</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                Korelasi Atribut Kemampuan
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Kemampuan teknis (passing, dribbling) saling berkorelasi</li>
                <li>• Atribut fisik mendukung kemampuan defensive</li>
                <li>• Pace berkorelasi kuat dengan efektivitas menyerang</li>
                <li>• Spesialisasi posisi terlihat jelas dalam pola skill</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Zap className="w-4 h-4 text-orange-500 mr-2" />
                Insight Berdasarkan Posisi
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Penyerang unggul dalam pace, shooting, dan dribbling</li>
                <li>• Gelandang menunjukkan distribusi skill yang seimbang</li>
                <li>• Bek memprioritaskan atribut fisik dan defensive</li>
                <li>• Penjaga gawang memerlukan evaluasi skill yang terspesialisasi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDAVisualization;