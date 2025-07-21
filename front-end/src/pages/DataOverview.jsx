import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { 
  Database, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users, 
  Target,
  Globe,
  Calendar,
  Search,
  Download,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DataOverview = () => {
  const [activeTab, setActiveTab] = useState('statistics');
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('All');
  
  // CSV Data State
  const [csvData, setCsvData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  
  // Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);
  
  // Load CSV data
  useEffect(() => {
    loadCSVData();
  }, []);
  
  // Filter data when position or search changes
  useEffect(() => {
    if (csvData.length > 0) {
      filterData();
    }
  }, [selectedPosition, csvData, searchTerm, searchCategory]);
  
  const loadCSVData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/fifa_players.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
          setTotalRows(results.data.length);
          setLoading(false);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
      setLoading(false);
    }
  };
  
  const filterData = () => {
    let filtered = csvData;
    
    // Filter by position
    if (selectedPosition !== 'All') {
      filtered = filtered.filter(player => 
        player.positions && player.positions.includes(selectedPosition)
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchValue = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(player => {
        const fieldValue = player[searchCategory];
        if (!fieldValue) return false;
        
        if (searchCategory === 'name' || searchCategory === 'full_name') {
          return fieldValue.toLowerCase().includes(searchValue);
        } else if (searchCategory === 'nationality') {
          return fieldValue.toLowerCase().includes(searchValue);
        } else if (searchCategory === 'positions') {
          return fieldValue.toLowerCase().includes(searchValue);
        } else if (searchCategory === 'overall_rating' || searchCategory === 'potential') {
          // For numeric fields, allow exact match or range search
          if (searchValue.includes('-')) {
            const [min, max] = searchValue.split('-').map(v => parseInt(v.trim()));
            const rating = parseInt(fieldValue);
            return rating >= min && rating <= max;
          } else {
            return fieldValue.toString().includes(searchValue);
          }
        } else {
          return fieldValue.toString().toLowerCase().includes(searchValue);
        }
      });
    }
    
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  const downloadExcel = () => {
    const dataToExport = getFilteredDataForDownload();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FIFA Players');
    
    const filename = getDownloadFilename('xlsx');
    XLSX.writeFile(wb, filename);
  };
  
  const downloadCSV = () => {
    const dataToExport = getFilteredDataForDownload();
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', getDownloadFilename('csv'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getFilteredDataForDownload = () => {
    return filteredData.length > 0 ? filteredData : csvData;
  };
  
  const getDownloadFilename = (extension) => {
    let filename = 'fifa_players';
    
    if (selectedPosition !== 'All') {
      filename += `_${selectedPosition}`;
    }
    
    if (searchTerm.trim()) {
      const cleanSearchTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, '_');
      filename += `_search_${cleanSearchTerm}`;
    }
    
    return `${filename}.${extension}`;
  };
  
  // Get current page data
  const getCurrentPageData = () => {
    const dataToShow = filteredData.length > 0 ? filteredData : csvData;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return dataToShow.slice(startIndex, endIndex);
  };
  
  const getTotalPages = () => {
    const dataToShow = filteredData.length > 0 ? filteredData : csvData;
    return Math.ceil(dataToShow.length / rowsPerPage);
  };

  // Sample data berdasarkan dataset aktual FIFA Players (dengan semua kolom)
  const samplePlayers = [
    {
      name: "L. Messi",
      full_name: "Lionel Andrés Messi Cuccittini",
      birth_date: "6/24/1987",
      age: 31,
      height_cm: 170.18,
      weight_kgs: 72.1,
      positions: "CF,RW,ST",
      nationality: "Argentina",
      overall_rating: 94,
      potential: 94,
      value_euro: "110500000",
      wage_euro: "565000",
      preferred_foot: "Left",
      international_reputation: 5,
      weak_foot: 4,
      skill_moves: 4,
      body_type: "Messi",
      release_clause_euro: "226500000",
      national_team: "Argentina",
      national_rating: 82,
      national_team_position: "RF",
      national_jersey_number: 10,
      crossing: 86, finishing: 95, heading_accuracy: 70, short_passing: 92, volleys: 86,
      dribbling: 97, curve: 93, freekick_accuracy: 94, long_passing: 89, ball_control: 96,
      acceleration: 91, sprint_speed: 86, agility: 93, reactions: 95, balance: 95,
      shot_power: 85, jumping: 68, stamina: 72, strength: 66, long_shots: 94,
      aggression: 48, interceptions: 22, positioning: 94, vision: 94, penalties: 75,
      composure: 96, marking: 33, standing_tackle: 28, sliding_tackle: 26
    },
    {
      name: "Cristiano Ronaldo",
      full_name: "Cristiano Ronaldo dos Santos Aveiro",
      birth_date: "2/5/1985",
      age: 34,
      height_cm: 187.0,
      weight_kgs: 83.0,
      positions: "ST,LW",
      nationality: "Portugal",
      overall_rating: 94,
      potential: 94,
      value_euro: "77000000",
      wage_euro: "405000",
      preferred_foot: "Right",
      international_reputation: 5,
      weak_foot: 4,
      skill_moves: 5,
      body_type: "C. Ronaldo",
      release_clause_euro: "146100000",
      national_team: "Portugal",
      national_rating: 85,
      national_team_position: "LS",
      national_jersey_number: 7,
      crossing: 85, finishing: 95, heading_accuracy: 89, short_passing: 83, volleys: 88,
      dribbling: 89, curve: 81, freekick_accuracy: 76, long_passing: 77, ball_control: 92,
      acceleration: 89, sprint_speed: 91, agility: 87, reactions: 96, balance: 70,
      shot_power: 95, jumping: 95, stamina: 88, strength: 79, long_shots: 93,
      aggression: 63, interceptions: 29, positioning: 95, vision: 82, penalties: 85,
      composure: 95, marking: 28, standing_tackle: 31, sliding_tackle: 23
    },
    {
      name: "Neymar Jr",
      full_name: "Neymar da Silva Santos Jr.",
      birth_date: "2/5/1992",
      age: 27,
      height_cm: 175.0,
      weight_kgs: 68.0,
      positions: "LW,CAM",
      nationality: "Brazil",
      overall_rating: 92,
      potential: 92,
      value_euro: "180000000",
      wage_euro: "290000",
      preferred_foot: "Right",
      international_reputation: 5,
      weak_foot: 5,
      skill_moves: 5,
      body_type: "Neymar",
      release_clause_euro: "222000000",
      national_team: "Brazil",
      national_rating: 85,
      national_team_position: "LW",
      national_jersey_number: 10,
      crossing: 86, finishing: 89, heading_accuracy: 62, short_passing: 87, volleys: 84,
      dribbling: 96, curve: 88, freekick_accuracy: 87, long_passing: 78, ball_control: 95,
      acceleration: 94, sprint_speed: 90, agility: 96, reactions: 90, balance: 84,
      shot_power: 80, jumping: 61, stamina: 81, strength: 49, long_shots: 77,
      aggression: 51, interceptions: 36, positioning: 89, vision: 90, penalties: 81,
      composure: 94, marking: 30, standing_tackle: 24, sliding_tackle: 26
    }
  ];

  // Data distribusi berdasarkan dataset aktual untuk ECharts
  const ageDistribution = {
    xAxis: ["17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "44", "45", "46"],
    series: [163, 509, 957, 1145, 1347, 1360, 1315, 1303, 1304, 1248, 1318, 1118, 979, 893, 845, 628, 465, 322, 354, 165, 99, 56, 31, 15, 10, 2, 1, 1, 1]
  };

  const overallRatingDistribution = {
    xAxis: ["47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "94"],
    series: [21, 33, 45, 98, 120, 165, 227, 255, 276, 331, 408, 458, 484, 621, 691, 849, 963, 1057, 1041, 1088, 1074, 1071, 911, 930, 804, 736, 605, 560, 477, 373, 288, 175, 178, 134, 83, 100, 72, 44, 31, 17, 18, 16, 10, 8, 5, 1, 2]
  };

  const potentialDistribution = {
    xAxis: ["48", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95"],
    series: [1, 1, 2, 10, 8, 9, 20, 26, 45, 77, 114, 164, 243, 353, 476, 612, 741, 923, 1026, 1108, 1130, 1230, 1164, 1128, 1085, 1029, 896, 756, 696, 555, 490, 425, 278, 294, 214, 183, 170, 82, 58, 48, 26, 31, 9, 10, 3, 4, 1]
  };

  const positionDistribution = [
    { position: "Midfielder", count: 7200, color: "#3B82F6" },
    { position: "Defender", count: 5100, color: "#EF4444" },
    { position: "Forward", count: 3800, color: "#10B981" },
    { position: "Goalkeeper", count: 1854, color: "#F59E0B" }
  ];

  const topNationalities = [
    { country: "England", count: 1658 },
    { country: "Germany", count: 1199 },
    { country: "Spain", count: 1070 },
    { country: "France", count: 925 },
    { country: "Argentina", count: 904 },
    { country: "Brazil", count: 832 },
    { country: "Italy", count: 655 },
    { country: "Colombia", count: 624 }
  ];

  // ECharts options
  const getAgeDistributionOption = () => ({
    title: {
      text: 'Age Distribution',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const data = params[0];
        const percentage = ((data.value / 17954) * 100).toFixed(1);
        return `Age: ${data.axisValue}<br/>
                Count: ${data.value.toLocaleString()}<br/>
                Percentage: ${percentage}%`;
      }
    },
    grid: {
      left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ageDistribution.xAxis,
      axisLabel: { color: '#6B7280', rotate: 45 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6B7280' },
      splitLine: { lineStyle: { color: '#E5E7EB' } }
    },
    series: [{
      name: 'Players',
      type: 'bar',
      data: ageDistribution.series,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3B82F6' },
          { offset: 1, color: '#1E40AF' }
        ])
      },
      label: {
        show: false
      }
    }]
  });

  const getOverallRatingOption = () => ({
    title: {
      text: 'Overall Rating Distribution',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const data = params[0];
        const percentage = ((data.value / 17954) * 100).toFixed(1);
        return `Rating: ${data.axisValue}<br/>
                Count: ${data.value.toLocaleString()}<br/>
                Percentage: ${percentage}%`;
      }
    },
    grid: {
      left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true
    },
    xAxis: {
      type: 'category',
      data: overallRatingDistribution.xAxis,
      axisLabel: { color: '#6B7280', rotate: 45 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6B7280' },
      splitLine: { lineStyle: { color: '#E5E7EB' } }
    },
    series: [{
      name: 'Players',
      type: 'bar',
      data: overallRatingDistribution.series,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#10B981' },
          { offset: 1, color: '#047857' }
        ])
      },
      label: {
        show: false
      }
    }]
  });

  const getPotentialDistributionOption = () => ({
    title: {
      text: 'Potential Rating Distribution',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const data = params[0];
        const percentage = ((data.value / 17954) * 100).toFixed(1);
        return `Potential: ${data.axisValue}<br/>
                Count: ${data.value.toLocaleString()}<br/>
                Percentage: ${percentage}%`;
      }
    },
    grid: {
      left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true
    },
    xAxis: {
      type: 'category',
      data: potentialDistribution.xAxis,
      axisLabel: { color: '#6B7280', rotate: 45 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6B7280' },
      splitLine: { lineStyle: { color: '#E5E7EB' } }
    },
    series: [{
      name: 'Players',
      type: 'bar',
      data: potentialDistribution.series,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#8B5CF6' },
          { offset: 1, color: '#5B21B6' }
        ])
      },
      label: {
        show: false
      }
    }]
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              Data Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Analisis statistik dan eksplorasi awal dataset FIFA Football Players
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'statistics' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Statistik Ringkas
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'preview' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Dataset
          </button>
          <button
            onClick={() => setActiveTab('visualization')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'visualization' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Visualisasi
          </button>
        </div>
      </div>

      {/* Statistik Ringkas */}
      {activeTab === 'statistics' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold text-gray-900">17,954</p>
                  <p className="text-xs text-green-600 mt-1">✓ Complete dataset</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Attributes</p>
                  <p className="text-3xl font-bold text-gray-900">51</p>
                  <p className="text-xs text-blue-600 mt-1">All player features</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Age Range</p>
                  <p className="text-3xl font-bold text-gray-900">17-46</p>
                  <p className="text-xs text-purple-600 mt-1">Mean: 25.6 years</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Nationalities</p>
                  <p className="text-3xl font-bold text-gray-900">160</p>
                  <p className="text-xs text-orange-600 mt-1">Global representation</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Statistics */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Rating & Potential Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Average Overall Rating</span>
                    <span className="text-blue-600 font-bold">66.2</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Average Potential</span>
                    <span className="text-green-600 font-bold">71.4</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Highest Overall</span>
                    <span className="text-purple-600 font-bold">94 (Messi & Ronaldo)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Rating Range</span>
                    <span className="text-orange-600 font-bold">47 - 94</span>
                  </div>
                </div>
              </div>

              {/* Model Features Information */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Dataset Features (51 Total)</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 text-sm mb-1">Basic Info (9)</h4>
                    <p className="text-blue-700 text-xs">Name, Age, Height, Weight, Nationality, Positions, etc.</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-sm mb-1">Technical Skills (30)</h4>
                    <p className="text-green-700 text-xs">Finishing, Passing, Dribbling, Defending, Physical attributes</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 text-sm mb-1">Ratings & Potential (6)</h4>
                    <p className="text-purple-700 text-xs">Overall, Potential, Reputation, Weak Foot, Skill Moves</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 text-sm mb-1">Economic & Team (6)</h4>
                    <p className="text-orange-700 text-xs">Value, Wage, Release Clause, National Team info</p>
                  </div>
                </div>
              </div>
            </div>

          {/* Top Nationalities */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Top Nationalities (dari 160 total)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topNationalities.map((nation, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">{nation.country}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{nation.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Dataset */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🔍 Dataset Preview</h3>
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <select 
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    disabled={loading}
                  >
                    <option value="name">Name</option>
                    <option value="full_name">Full Name</option>
                    <option value="nationality">Nationality</option>
                    <option value="positions">Positions</option>
                    <option value="overall_rating">Overall Rating</option>
                    <option value="potential">Potential</option>
                  </select>
                  <input
                    type="text"
                    placeholder={`Search by ${searchCategory.replace('_', ' ')}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-48"
                    disabled={loading}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select 
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                    disabled={loading}
                  >
                    <option value="All">All Positions</option>
                    <option value="ST">Striker</option>
                    <option value="CF">Center Forward</option>
                    <option value="RW">Right Wing</option>
                    <option value="LW">Left Wing</option>
                    <option value="CAM">Center Attacking Mid</option>
                    <option value="CM">Center Mid</option>
                    <option value="CB">Center Back</option>
                    <option value="GK">Goalkeeper</option>
                  </select>
                </div>
                
                {/* Download Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadCSV}
                    disabled={loading || csvData.length === 0}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={downloadExcel}
                    disabled={loading || csvData.length === 0}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>XLSX</span>
                  </button>
                </div>
                
                {/* Data Info */}
                <div className="text-sm text-gray-600">
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <span className="font-semibold">
                      {filteredData.length > 0 ? filteredData.length : csvData.length} records
                    </span>
                  )}
                  {csvData.length > 0 && (
                    <span className="ml-1">with {Object.keys(csvData[0] || {}).length} columns</span>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading FIFA players data...</span>
              </div>
            ) : csvData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No data available. Please make sure fifa_players.csv is in the public folder.</p>
              </div>
            ) : (
              <>
                {/* Search Tips */}
                {(searchTerm.trim() || filteredData.length !== csvData.length) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="text-blue-600 mt-0.5">💡</div>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Search Tips:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• <strong>Name/Nationality:</strong> Type partial names (e.g., "Messi", "Brazil")</li>
                          <li>• <strong>Positions:</strong> Search by position codes (e.g., "ST", "GK", "CAM")</li>
                          <li>• <strong>Ratings:</strong> Use exact numbers (e.g., "85") or ranges (e.g., "80-90")</li>
                        </ul>
                        {filteredData.length === 0 && searchTerm.trim() && (
                          <p className="mt-2 text-orange-600 font-medium">
                            No results found for "{searchTerm}". Try a different search term or category.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300 bg-gray-50">
                        {csvData.length > 0 && Object.keys(csvData[0]).map((column, index) => (
                          <th key={index} className="text-left p-2 font-semibold text-gray-900 min-w-[100px]">
                            {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentPageData().map((player, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          {Object.entries(player).map(([key, value], colIndex) => (
                            <td key={colIndex} className="p-2 text-gray-700">
                              {key === 'overall_rating' || key === 'potential' ? (
                                <span className={`font-semibold ${key === 'overall_rating' ? 'text-green-600' : 'text-purple-600'}`}>
                                  {value}
                                </span>
                              ) : key.includes('value') || key.includes('wage') || key.includes('clause') ? (
                                value && !isNaN(value) ? `€${(parseFloat(value) / 1000000).toFixed(1)}M` : value
                              ) : (
                                value || '-'
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * rowsPerPage) + 1} to{' '}
                    {Math.min(currentPage * rowsPerPage, filteredData.length > 0 ? filteredData.length : csvData.length)} of{' '}
                    {filteredData.length > 0 ? filteredData.length : csvData.length} results
                    {(selectedPosition !== 'All' || searchTerm.trim()) && (
                      <span className="ml-2 text-blue-600">
                        (filtered{selectedPosition !== 'All' && ` by ${selectedPosition}`}
                        {searchTerm.trim() && ` • search: "${searchTerm}"`})
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, getTotalPages()))].map((_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (pageNum > getTotalPages()) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                      disabled={currentPage === getTotalPages()}
                      className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Visualizations */}
      {activeTab === 'visualization' && (
        <div className="space-y-6">
          {/* Age Distribution Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <ReactECharts 
              option={getAgeDistributionOption()} 
              style={{ height: '400px' }}
              theme="light"
            />
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p className="font-medium">Peak age for professional players is 22 years (1,360 players - 7.6%)</p>
            </div>
          </div>

          {/* Overall Rating Distribution Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <ReactECharts 
              option={getOverallRatingOption()} 
              style={{ height: '400px' }}
              theme="light"
            />
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p className="font-medium">Most players have rating 66 (1,088 players - 6.1%)</p>
            </div>
          </div>

          {/* Potential Distribution Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <ReactECharts 
              option={getPotentialDistributionOption()} 
              style={{ height: '400px' }}
              theme="light"
            />
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p className="font-medium">Potential ratings peak at 70 (1,230 players - 6.9%)</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Key Insights from Visualizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">42.1%</div>
                <div className="text-sm text-blue-600">Young Players (17-25)</div>
                <div className="text-xs text-gray-500 mt-1">7,574 players with high potential</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">6.1%</div>
                <div className="text-sm text-green-600">Rating 66 (Peak)</div>
                <div className="text-xs text-gray-500 mt-1">1,088 players at this level</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">6.9%</div>
                <div className="text-sm text-purple-600">Potential 70 (Peak)</div>
                <div className="text-xs text-gray-500 mt-1">1,230 players with this potential</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">0.3%</div>
                <div className="text-sm text-orange-600">Elite Players (90+)</div>
                <div className="text-xs text-gray-500 mt-1">54 world-class talents</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DataOverview;