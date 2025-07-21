import React, { useState } from 'react';
// tes
import { 
  Target, Send, Download, AlertCircle, CheckCircle, 
  Loader2, User, Calendar, MapPin, Activity,
  TrendingUp, Star, FileText, BarChart3
} from 'lucide-react';
import jsPDF from 'jspdf';

const Prediction = () => {
  const [playerData, setPlayerData] = useState({
    // Basic physical features
    age: '',
    height_cm: '',
    weight_kgs: '',
    
    // Rating features
    'international_reputation(1-5)': '',
    'weak_foot(1-5)': '',
    'skill_moves(1-5)': '',
    
    // Technical skills (individual features that remain)
    heading_accuracy: '',
    dribbling: '',
    curve: '',
    ball_control: '',
    reactions: '',
    aggression: '',
    positioning: '',
    composure: '',
    
    // Categorical features
    positions: '',
    preferred_foot: '',
    body_type: '',
    
    // Direct composite inputs
    pace_composite: '',
    shooting_composite: '',
    passing_composite: '',
    defending_composite: '',
    physical_composite: '',
    
    // Individual components for composite features
    pace_composite_acceleration: '',
    pace_composite_sprint_speed: '',
    
    shooting_composite_finishing: '',
    shooting_composite_shot_power: '',
    shooting_composite_long_shots: '',
    shooting_composite_volleys: '',
    shooting_composite_penalties: '',
    
    passing_composite_short_passing: '',
    passing_composite_long_passing: '',
    passing_composite_vision: '',
    passing_composite_crossing: '',
    passing_composite_freekick_accuracy: '',
    
    defending_composite_marking: '',
    defending_composite_standing_tackle: '',
    defending_composite_sliding_tackle: '',
    defending_composite_interceptions: '',
    
    physical_composite_strength: '',
    physical_composite_jumping: '',
    physical_composite_stamina: '',
    physical_composite_balance: '',
    physical_composite_agility: ''
  });

  // State untuk mengontrol mode input (direct atau detailed)
  const [compositeMode, setCompositeMode] = useState({
    pace: 'direct', // 'direct' atau 'detailed'
    shooting: 'direct',
    passing: 'direct',
    defending: 'direct',
    physical: 'direct'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompositeModeChange = (compositeType, mode) => {
    setCompositeMode(prev => ({
      ...prev,
      [compositeType]: mode
    }));
    
    // Clear related fields when switching modes
    const fieldsToReset = [];
    if (compositeType === 'pace') {
      fieldsToReset.push('pace_composite', 'pace_composite_acceleration', 'pace_composite_sprint_speed');
    } else if (compositeType === 'shooting') {
      fieldsToReset.push('shooting_composite', 'shooting_composite_finishing', 'shooting_composite_shot_power', 
                         'shooting_composite_long_shots', 'shooting_composite_volleys', 'shooting_composite_penalties');
    } else if (compositeType === 'passing') {
      fieldsToReset.push('passing_composite', 'passing_composite_short_passing', 'passing_composite_long_passing',
                         'passing_composite_vision', 'passing_composite_crossing', 'passing_composite_freekick_accuracy');
    } else if (compositeType === 'defending') {
      fieldsToReset.push('defending_composite', 'defending_composite_marking', 'defending_composite_standing_tackle',
                         'defending_composite_sliding_tackle', 'defending_composite_interceptions');
    } else if (compositeType === 'physical') {
      fieldsToReset.push('physical_composite', 'physical_composite_strength', 'physical_composite_jumping',
                         'physical_composite_stamina', 'physical_composite_balance', 'physical_composite_agility');
    }
    
    setPlayerData(prev => {
      const newData = { ...prev };
      fieldsToReset.forEach(field => {
        newData[field] = '';
      });
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Filter out empty values and convert to appropriate types
      const filteredData = {};
      
      // Calculate composite features from individual inputs
      const compositeFeatures = {
        pace_composite: 0,
        shooting_composite: 0,
        passing_composite: 0,
        defending_composite: 0,
        physical_composite: 0
      };
      
      // Process basic features
      Object.keys(playerData).forEach(key => {
        if (playerData[key] !== '') {
          const value = playerData[key];
          
          // Handle composite feature calculations only if in detailed mode
          if (key.startsWith('pace_composite_') && compositeMode.pace === 'detailed') {
            if (key === 'pace_composite_acceleration' && value) {
              compositeFeatures.pace_composite += parseFloat(value) * 0.4;
            } else if (key === 'pace_composite_sprint_speed' && value) {
              compositeFeatures.pace_composite += parseFloat(value) * 0.6;
            }
          } else if (key.startsWith('shooting_composite_') && compositeMode.shooting === 'detailed') {
            const skills = ['finishing', 'shot_power', 'long_shots', 'volleys', 'penalties'];
            const skillName = key.replace('shooting_composite_', '');
            if (skills.includes(skillName) && value) {
              compositeFeatures.shooting_composite += parseFloat(value);
            }
          } else if (key.startsWith('passing_composite_') && compositeMode.passing === 'detailed') {
            const skills = ['short_passing', 'long_passing', 'vision', 'crossing', 'freekick_accuracy'];
            const skillName = key.replace('passing_composite_', '');
            if (skills.includes(skillName) && value) {
              compositeFeatures.passing_composite += parseFloat(value);
            }
          } else if (key.startsWith('defending_composite_') && compositeMode.defending === 'detailed') {
            const skills = ['marking', 'standing_tackle', 'sliding_tackle', 'interceptions'];
            const skillName = key.replace('defending_composite_', '');
            if (skills.includes(skillName) && value) {
              compositeFeatures.defending_composite += parseFloat(value);
            }
          } else if (key.startsWith('physical_composite_') && compositeMode.physical === 'detailed') {
            const skills = ['strength', 'jumping', 'stamina', 'balance', 'agility'];
            const skillName = key.replace('physical_composite_', '');
            if (skills.includes(skillName) && value) {
              compositeFeatures.physical_composite += parseFloat(value);
            }
          } else if (['pace_composite', 'shooting_composite', 'passing_composite', 'defending_composite', 'physical_composite'].includes(key)) {
            // Direct composite input
            filteredData[key] = parseFloat(value) || 0;
          } else {
            // Regular features
            if (['age', 'height_cm', 'weight_kgs', 'international_reputation(1-5)', 
                 'weak_foot(1-5)', 'skill_moves(1-5)', 'heading_accuracy', 
                 'dribbling', 'curve', 'ball_control', 'reactions', 'aggression', 
                 'positioning', 'composure'].includes(key)) {
              filteredData[key] = parseFloat(value) || 0;
            } else if (!key.includes('composite_')) {
              filteredData[key] = value;
            }
          }
        }
      });
      
      // Calculate averages for composite features only in detailed mode
      if (compositeMode.shooting === 'detailed') {
        const shootingCount = Object.keys(playerData).filter(k => k.startsWith('shooting_composite_') && playerData[k]).length;
        if (shootingCount > 0) filteredData.shooting_composite = compositeFeatures.shooting_composite / shootingCount;
      }
      
      if (compositeMode.passing === 'detailed') {
        const passingCount = Object.keys(playerData).filter(k => k.startsWith('passing_composite_') && playerData[k]).length;
        if (passingCount > 0) filteredData.passing_composite = compositeFeatures.passing_composite / passingCount;
      }
      
      if (compositeMode.defending === 'detailed') {
        const defendingCount = Object.keys(playerData).filter(k => k.startsWith('defending_composite_') && playerData[k]).length;
        if (defendingCount > 0) filteredData.defending_composite = compositeFeatures.defending_composite / defendingCount;
      }
      
      if (compositeMode.physical === 'detailed') {
        const physicalCount = Object.keys(playerData).filter(k => k.startsWith('physical_composite_') && playerData[k]).length;
        if (physicalCount > 0) filteredData.physical_composite = compositeFeatures.physical_composite / physicalCount;
      }
      
      // Only add pace_composite if both acceleration and sprint_speed are provided in detailed mode
      if (compositeMode.pace === 'detailed') {
        const hasAcceleration = playerData.pace_composite_acceleration !== '';
        const hasSprint = playerData.pace_composite_sprint_speed !== '';
        if (hasAcceleration && hasSprint) {
          filteredData.pace_composite = compositeFeatures.pace_composite;
        }
      }

      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.message);
      }

      setPrediction({
        ...result.data,
        inputData: filteredData,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat melakukan prediksi');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate insights based on ratings
  const generateInsights = (overallRating, potentialRating) => {
    const insights = [];
    const growthPotential = potentialRating - overallRating;

    // Overall Rating Analysis
    if (overallRating >= 90) {
      insights.push({
        type: 'elite',
        icon: '🏆',
        title: 'Elite Player',
        description: 'Pemain kelas dunia dengan kemampuan luar biasa. Cocok untuk klub top dan tim nasional.'
      });
    } else if (overallRating >= 85) {
      insights.push({
        type: 'world_class',
        icon: '⭐',
        title: 'World Class Player',
        description: 'Pemain berkelas tinggi yang dapat bersaing di level kompetisi tertinggi.'
      });
    } else if (overallRating >= 80) {
      insights.push({
        type: 'quality',
        icon: '💪',
        title: 'Quality Player',
        description: 'Pemain berkualitas baik yang dapat berkontribusi signifikan untuk tim.'
      });
    } else if (overallRating >= 75) {
      insights.push({
        type: 'promising',
        icon: '📈',
        title: 'Promising Player',
        description: 'Pemain dengan potensi yang menjanjikan, cocok untuk pengembangan lebih lanjut.'
      });
    } else if (overallRating >= 70) {
      insights.push({
        type: 'decent',
        icon: '👍',
        title: 'Decent Player',
        description: 'Pemain dengan kemampuan yang cukup, cocok sebagai rotasi atau pemain muda.'
      });
    } else {
      insights.push({
        type: 'developing',
        icon: '🌱',
        title: 'Developing Player',
        description: 'Pemain dalam tahap pengembangan, membutuhkan latihan dan pengalaman lebih.'
      });
    }

    // Growth Potential Analysis
    if (growthPotential >= 10) {
      insights.push({
        type: 'high_potential',
        icon: '🚀',
        title: 'Potensi Sangat Tinggi',
        description: 'Dapat berkembang pesat dengan pelatihan yang tepat. Investasi jangka panjang yang sangat baik.'
      });
    } else if (growthPotential >= 7) {
      insights.push({
        type: 'good_potential',
        icon: '📊',
        title: 'Potensi Baik',
        description: 'Masih memiliki ruang untuk berkembang. Cocok untuk program pengembangan pemain.'
      });
    } else if (growthPotential >= 4) {
      insights.push({
        type: 'moderate_potential',
        icon: '📋',
        title: 'Potensi Sedang',
        description: 'Dapat berkembang dengan konsistensi latihan dan pengalaman bermain.'
      });
    } else if (growthPotential >= 1) {
      insights.push({
        type: 'limited_potential',
        icon: '📏',
        title: 'Potensi Terbatas',
        description: 'Sudah mendekati puncak kemampuan, fokus pada mempertahankan performa.'
      });
    } else {
      insights.push({
        type: 'peak_performance',
        icon: '🎯',
        title: 'Performa Puncak',
        description: 'Sudah mencapai potensi maksimal. Fokus pada konsistensi dan pengalaman.'
      });
    }

    // Age-based insights
    const age = parseInt(playerData.age);
    if (age && age <= 21 && overallRating >= 75) {
      insights.push({
        type: 'wonderkid',
        icon: '⚡',
        title: 'Wonderkid',
        description: 'Pemain muda dengan kemampuan luar biasa. Masa depan yang sangat cerah!'
      });
    } else if (age && age >= 32 && overallRating >= 85) {
      insights.push({
        type: 'veteran',
        icon: '🎖️',
        title: 'Veteran Elite',
        description: 'Pemain berpengalaman dengan kualitas tinggi. Dapat menjadi mentor tim.'
      });
    }

    // Position-specific insights
    const position = playerData.positions;
    if (position === 'GK' && overallRating >= 85) {
      insights.push({
        type: 'goalkeeper',
        icon: '🧤',
        title: 'Kiper Berkelas',
        description: 'Penjaga gawang dengan kemampuan luar biasa, dapat diandalkan dalam situasi krusial.'
      });
    } else if (['ST', 'CF'].includes(position) && overallRating >= 85) {
      insights.push({
        type: 'striker',
        icon: '⚽',
        title: 'Pencetak Gol',
        description: 'Striker dengan kemampuan mencetak gol yang sangat baik, ancaman nyata di kotak penalti.'
      });
    } else if (['CB', 'LB', 'RB'].includes(position) && overallRating >= 85) {
      insights.push({
        type: 'defender',
        icon: '🛡️',
        title: 'Benteng Pertahanan',
        description: 'Bek dengan kemampuan bertahan yang solid, dapat mengandalkan konsistensi defensif.'
      });
    } else if (['CAM', 'CM', 'CDM'].includes(position) && overallRating >= 85) {
      insights.push({
        type: 'midfielder',
        icon: '🎭',
        title: 'Maestro Lini Tengah',
        description: 'Gelandang dengan visi dan teknik luar biasa, dapat mengontrol tempo permainan.'
      });
    }

    return insights;
  };

  const downloadResults = () => {
    if (!prediction) return;

    const insights = generateInsights(prediction.overall_rating_prediction, prediction.potential_rating_prediction);
    
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = 20;
    let pageNumber = 1;
    
    // Color scheme
    const colors = {
      primary: [52, 73, 123],     // Dark blue
      secondary: [79, 172, 254],   // Light blue
      accent: [34, 197, 94],       // Green
      text: [55, 65, 81],          // Dark gray
      lightGray: [229, 231, 235],  // Light gray
      white: [255, 255, 255]
    };
    
    // Helper function to add colored rectangles
    const addColoredRect = (x, y, width, height, color, opacity = 1) => {
      // Calculate opacity by blending with white background
      let finalColor = [...color];
      if (opacity < 1) {
        finalColor = color.map(c => Math.round(c + (255 - c) * (1 - opacity)));
      }
      
      doc.setFillColor(...finalColor);
      doc.rect(x, y, width, height, 'F');
    };
    
    // Helper function to add text with automatic line wrapping
    const addText = (text, x, y, maxWidth = contentWidth, fontSize = 10, color = colors.text, align = 'left') => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      const splitText = doc.splitTextToSize(text, maxWidth);
      
      if (align === 'center') {
        doc.text(splitText, x + maxWidth/2, y, { align: 'center' });
      } else if (align === 'right') {
        doc.text(splitText, x + maxWidth, y, { align: 'right' });
      } else {
        doc.text(splitText, x, y);
      }
      
      return y + (splitText.length * fontSize * 0.4) + 2;
    };
    
    // Helper function to add section header with background
    const addSectionHeader = (title, icon = '') => {
      checkNewPage(25);
      
      // Background rectangle
      addColoredRect(margin, yPosition - 3, contentWidth, 18, colors.primary, 0.1);
      
      // Title text
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text(`${icon} ${title}`, margin + 5, yPosition + 8);
      
      yPosition += 22;
    };
    
    // Helper function to add page header and footer
    const addPageElements = () => {
      // Header line
      doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, 15, pageWidth - margin, 15);
      
      // // Footer
      // doc.setFontSize(8);
      // doc.setFont(undefined, 'italic');
      // doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      // doc.text('Generated by Football Rating Prediction System - Machine Learning Model v1.0.0', 
      //          pageWidth/2, pageHeight - 10, { align: 'center' });
      
      // Page number
      // doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      // doc.text(`Halaman ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };
    
    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = 30) => {
      if (yPosition + requiredSpace > pageHeight - 30) {
        addPageElements();
        doc.addPage();
        pageNumber++;
        yPosition = 25;
      }
    };
    
    // COVER PAGE
    // Main title with gradient background effect
    addColoredRect(margin, yPosition, contentWidth, 35, colors.primary, 0.15);
    
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('LAPORAN PREDIKSI RATING PEMAIN', pageWidth/2, yPosition + 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text('SEPAK BOLA', pageWidth/2, yPosition + 25, { align: 'center' });
    yPosition += 45;
    
    // System info box
    addColoredRect(margin + 30, yPosition, contentWidth - 60, 25, colors.accent, 0.1);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text('Football Rating Prediction System', pageWidth/2, yPosition + 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Powered by Random Forest Machine Learning', pageWidth/2, yPosition + 18, { align: 'center' });
    yPosition += 35;
    
    // Date and time box
    const now = new Date();
    addColoredRect(margin + 40, yPosition, contentWidth - 80, 20, colors.lightGray, 0.5);
    doc.setFontSize(10);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(`Tanggal: ${now.toLocaleDateString('id-ID')}`, pageWidth/2, yPosition + 8, { align: 'center' });
    doc.text(`Waktu: ${now.toLocaleTimeString('id-ID')}`, pageWidth/2, yPosition + 15, { align: 'center' });
    yPosition += 30;
    
    // Decorative line
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(2);
    doc.line(margin + 50, yPosition, pageWidth - margin - 50, yPosition);
    yPosition += 20;
    
    // HASIL PREDIKSI - Main Results Box
    addSectionHeader('HASIL PREDIKSI');
    
    // Results in structured boxes
    const resultBoxHeight = 25;
    const resultBoxSpacing = 30;
    
    // Overall Rating Box
    addColoredRect(margin, yPosition, contentWidth/2 - 5, resultBoxHeight, colors.accent, 0.1);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text('Overall Rating', margin + 5, yPosition + 8);
    doc.setFontSize(18);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(`${prediction.overall_rating_prediction}`, margin + 5, yPosition + 18);
    
    // Potential Rating Box
    addColoredRect(margin + contentWidth/2 + 5, yPosition, contentWidth/2 - 5, resultBoxHeight, colors.secondary, 0.1);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text('Potential Rating', margin + contentWidth/2 + 10, yPosition + 8);
    doc.setFontSize(18);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(`${prediction.potential_rating_prediction}`, margin + contentWidth/2 + 10, yPosition + 18);
    yPosition += resultBoxSpacing;
    
    // Confidence and Growth boxes
    addColoredRect(margin, yPosition, contentWidth/2 - 5, resultBoxHeight, colors.primary, 0.1);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text('Confidence', margin + 5, yPosition + 8);
    doc.setFontSize(16);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(`${prediction.confidence}`, margin + 5, yPosition + 18);
    
    const currentGrowthPotential = (prediction.potential_rating_prediction - prediction.overall_rating_prediction).toFixed(1);
    addColoredRect(margin + contentWidth/2 + 5, yPosition, contentWidth/2 - 5, resultBoxHeight, [255, 193, 7], 0.1);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text('Growth Potential', margin + contentWidth/2 + 10, yPosition + 8);
    doc.setFontSize(16);
    doc.setTextColor(255, 193, 7);
    doc.text(`+${currentGrowthPotential}`, margin + contentWidth/2 + 10, yPosition + 18);
    yPosition += 40;
    
    // MODEL INFORMATION
    // Mulai halaman baru untuk INFORMASI MODEL
    doc.addPage();
    pageNumber++;
    yPosition = 25;
    addSectionHeader('INFORMASI MODEL');
    
    // Model info in structured table format
    const modelInfoData = [
      ['Fitur yang Digunakan', `${prediction.input_features} dari 22 fitur total`],
      ['Kelengkapan Data', prediction.input_features_percent],
      ['Algoritma Model', 'Random Forest Regressor'],
      ['Versi Model', '1.0.0'],
      ['Akurasi Training', 'R² Score: 0.95+']
    ];
    
    // Table header
    addColoredRect(margin, yPosition, contentWidth, 15, colors.primary, 0.2);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text('Parameter', margin + 5, yPosition + 8);
    doc.text('Nilai', margin + contentWidth/2, yPosition + 8);
    yPosition += 17;
    
    // Table rows
    modelInfoData.forEach((row, index) => {
      const bgColor = index % 2 === 0 ? colors.lightGray : colors.white;
      addColoredRect(margin, yPosition, contentWidth, 12, bgColor, 0.3);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(row[0], margin + 5, yPosition + 7);
      doc.setFont(undefined, 'bold');
      doc.text(row[1], margin + contentWidth/2, yPosition + 7);
      yPosition += 14;
    });
    
    yPosition += 15;
    
    // DATA INPUT YANG DIISI
    addSectionHeader('DATA INPUT YANG DIISI');
    
    // Mapping untuk label yang lebih user-friendly
    const fieldLabels = {
      age: 'Usia',
      height_cm: 'Tinggi (cm)',
      weight_kgs: 'Berat (kg)',
      'international_reputation(1-5)': 'Reputasi Internasional',
      'weak_foot(1-5)': 'Kaki Lemah',
      'skill_moves(1-5)': 'Skill Moves',
      heading_accuracy: 'Heading Accuracy',
      dribbling: 'Dribbling',
      curve: 'Curve',
      ball_control: 'Ball Control',
      reactions: 'Reactions',
      aggression: 'Aggression',
      positioning: 'Positioning',
      composure: 'Composure',
      positions: 'Posisi',
      preferred_foot: 'Kaki Dominan',
      body_type: 'Tipe Tubuh',
      pace_composite: 'Pace Composite',
      shooting_composite: 'Shooting Composite',
      passing_composite: 'Passing Composite',
      defending_composite: 'Defending Composite',
      physical_composite: 'Physical Composite'
    };
    
    // Group input data by categories for better organization
    const inputDataEntries = Object.entries(prediction.inputData);
    const categorizedData = {
      'Informasi Dasar': [],
      'Rating & Skill': [],
      'Kemampuan Composite': []
    };
    
    inputDataEntries.forEach(([key, value]) => {
      const label = fieldLabels[key] || key;
      if (['age', 'height_cm', 'weight_kgs', 'positions', 'preferred_foot', 'body_type'].includes(key)) {
        categorizedData['Informasi Dasar'].push([label, value]);
      } else if (key.includes('composite')) {
        categorizedData['Kemampuan Composite'].push([label, value]);
      } else {
        categorizedData['Rating & Skill'].push([label, value]);
      }
    });
    
    // Display categorized data
    Object.entries(categorizedData).forEach(([category, data]) => {
      if (data.length > 0) {
        checkNewPage(20);
        
        // Category header
        addColoredRect(margin, yPosition, contentWidth, 12, colors.accent, 0.15);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(category, margin + 5, yPosition + 7);
        yPosition += 15;
        
        // Data in two-column format
        data.forEach((item, index) => {
          checkNewPage(10);
          
          const bgColor = index % 2 === 0 ? colors.lightGray : colors.white;
          addColoredRect(margin, yPosition, contentWidth, 10, bgColor, 0.2);
          
          doc.setFontSize(9);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          doc.text(`• ${item[0]}`, margin + 5, yPosition + 6);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.text(`${item[1]}`, margin + contentWidth * 0.6, yPosition + 6);
          yPosition += 12;
        });
        
        yPosition += 8;
      }
    });
    
    // DATA INPUT YANG TIDAK DIISI
    addSectionHeader('DATA INPUT YANG TIDAK DIISI');
    
    // Get all possible fields and find which ones are not filled
    const allPossibleFields = Object.keys(playerData);
    const filledFields = Object.keys(prediction.inputData);
    const unfilledFields = allPossibleFields.filter(field => {
      // Exclude individual composite components if their parent composite is filled
      if (field.includes('composite_')) {
        const parentComposite = field.split('_')[0] + '_composite';
        return !filledFields.includes(parentComposite);
      }
      return !filledFields.includes(field) && playerData[field] === '';
    });
    
    if (unfilledFields.length > 0) {
      // Display unfilled fields in organized columns
      const columnsPerRow = 2;
      let currentColumn = 0;
      
      unfilledFields.forEach((field, index) => {
        checkNewPage(15);
        
        if (currentColumn === 0) {
          // Start new row
          const bgColor = Math.floor(index / columnsPerRow) % 2 === 0 ? colors.lightGray : colors.white;
          addColoredRect(margin, yPosition, contentWidth, 12, bgColor, 0.1);
        }
        
        const label = fieldLabels[field] || field;
        const xPos = margin + 5 + (currentColumn * contentWidth / columnsPerRow);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(`• ${label}`, xPos, yPosition + 7);
        
        currentColumn++;
        if (currentColumn >= columnsPerRow) {
          currentColumn = 0;
          yPosition += 14;
        }
      });
      
      if (currentColumn > 0) {
        yPosition += 14; // Complete the last row
      }
      
      // Summary box
      addColoredRect(margin, yPosition, contentWidth, 15, [255, 235, 59], 0.2);
      doc.setFontSize(10);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(`Total ${unfilledFields.length} field tidak diisi dari ${allPossibleFields.length} field tersedia`, 
               margin + 5, yPosition + 9);
      yPosition += 20;
    } else {
      addColoredRect(margin, yPosition, contentWidth, 15, colors.accent, 0.1);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.text('✓ Semua field yang tersedia telah diisi lengkap!', margin + 5, yPosition + 9);
      yPosition += 20;
    }
    
    // ANALISIS & INSIGHT
    addSectionHeader('ANALISIS & INSIGHT PEMAIN');
    
    insights.forEach((insight, index) => {
      checkNewPage(25);
      
      // Insight card with colored left border
      const cardColor = insight.type.includes('elite') || insight.type.includes('world_class') ? colors.accent :
                       insight.type.includes('potential') ? colors.secondary :
                       insight.type.includes('wonderkid') ? [255, 193, 7] :
                       colors.primary;
      
      // Card background
      addColoredRect(margin, yPosition, contentWidth, 20, cardColor, 0.05);
      
      // Left colored border
      addColoredRect(margin, yPosition, 4, 20, cardColor, 0.8);
      
      // Insight number and title
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(cardColor[0], cardColor[1], cardColor[2]);
      doc.text(`${index + 1}.`, margin + 8, yPosition + 8);
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(insight.title, margin + 18, yPosition + 8);
      
      // Description
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      yPosition = addText(insight.description, margin + 8, yPosition + 14, contentWidth - 16, 9);
      yPosition += 8;
    });
    
    // REKOMENDASI
    addSectionHeader('REKOMENDASI');
    
    const overallRating = prediction.overall_rating_prediction;
    const growthPotential = prediction.potential_rating_prediction - overallRating;
    
    let recommendations = [];
    
    if (overallRating >= 85) {
      recommendations.push({
        category: 'Level Kompetisi',
        text: 'Siap untuk kompetisi level tertinggi (Liga Champions, World Cup)'
      });
      recommendations.push({
        category: 'Fokus Pengembangan',
        text: 'Konsistensi performa dan pengembangan leadership'
      });
    } else if (overallRating >= 75) {
      recommendations.push({
        category: 'Level Kompetisi',
        text: 'Cocok untuk liga utama, dengan fokus pengembangan skill spesifik'
      });
      recommendations.push({
        category: 'Program Latihan',
        text: 'Latihan intensif untuk meningkatkan rating keseluruhan'
      });
    } else {
      recommendations.push({
        category: 'Pengembangan',
        text: 'Membutuhkan pengembangan fundamental yang komprehensif'
      });
      recommendations.push({
        category: 'Level Kompetisi',
        text: 'Cocok untuk liga development atau tim muda'
      });
    }
    
    if (growthPotential >= 7) {
      recommendations.push({
        category: 'Investasi',
        text: 'Investasi jangka panjang yang sangat baik'
      });
      recommendations.push({
        category: 'Program',
        text: 'Program pengembangan youth academy direkomendasikan'
      });
    } else if (growthPotential >= 3) {
      recommendations.push({
        category: 'Pengembangan',
        text: 'Masih ada ruang berkembang dengan latihan yang tepat'
      });
    } else {
      recommendations.push({
        category: 'Strategi',
        text: 'Fokus pada mempertahankan performa saat ini'
      });
    }
    
    // Display recommendations in structured format
    recommendations.forEach((rec, index) => {
      checkNewPage(15);
      
      // Recommendation card
      addColoredRect(margin, yPosition, contentWidth, 12, colors.accent, 0.08);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.text(`${index + 1}. ${rec.category}:`, margin + 5, yPosition + 7);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      yPosition = addText(rec.text, margin + 5, yPosition + 10, contentWidth - 10, 9);
      yPosition += 5;
    });
    
    // Summary conclusion box
    checkNewPage(25);
    addColoredRect(margin, yPosition, contentWidth, 20, colors.primary, 0.1);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('KESIMPULAN', margin + 5, yPosition + 8);
    
    let conclusion = '';
    if (overallRating >= 85 && growthPotential >= 5) {
      conclusion = 'Pemain elit dengan potensi luar biasa - investasi terbaik untuk masa depan.';
    } else if (overallRating >= 80) {
      conclusion = 'Pemain berkualitas tinggi yang dapat memberikan kontribusi signifikan.';
    } else if (overallRating >= 70) {
      conclusion = 'Pemain potensial yang memerlukan pengembangan berkelanjutan.';
    } else {
      conclusion = 'Pemain muda yang memerlukan program pengembangan intensif.';
    }
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    yPosition = addText(conclusion, margin + 5, yPosition + 15, contentWidth - 10, 10);
    
    // Add final page elements
    addPageElements();
    
    // Save the PDF
    const fileName = `Laporan_Prediksi_Rating_Pemain_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const formSections = [
    {
      title: 'Informasi Fisik Dasar',
      icon: <User className="w-5 h-5" />,
      fields: [
        { name: 'age', label: 'Usia', type: 'number', placeholder: '17-50', min: 17, max: 50, required: true, description: 'Usia pemain dalam tahun. Faktor utama dalam menentukan potensi pengembangan.' },
        { name: 'height_cm', label: 'Tinggi (cm)', type: 'number', placeholder: '150-220', min: 150, max: 220, description: 'Tinggi badan pemain dalam centimeter. Berpengaruh pada kemampuan heading dan jangkauan.' },
        { name: 'weight_kgs', label: 'Berat (kg)', type: 'number', placeholder: '50-120', min: 50, max: 120, description: 'Berat badan pemain dalam kilogram. Mempengaruhi kekuatan fisik dan kelincahan.' },
        { name: 'preferred_foot', label: 'Kaki Dominan', type: 'select', options: ['Right', 'Left'], description: 'Kaki yang lebih sering digunakan untuk menendang bola dan kontrol.' }
      ]
    },
    {
      title: 'Rating & Reputasi',
      icon: <Star className="w-5 h-5" />,
      fields: [
        { name: 'international_reputation(1-5)', label: 'Reputasi Internasional (1-5)', type: 'number', placeholder: '1-5', min: 1, max: 5, description: 'Tingkat pengakuan pemain di level internasional. 1=tidak dikenal, 5=superstar dunia.' },
        { name: 'weak_foot(1-5)', label: 'Kaki Lemah (1-5)', type: 'number', placeholder: '1-5', min: 1, max: 5, description: 'Kemampuan menggunakan kaki non-dominan. 1=sangat lemah, 5=sangat pandai.' },
        { name: 'skill_moves(1-5)', label: 'Skill Moves (1-5)', type: 'number', placeholder: '1-5', min: 1, max: 5, description: 'Kemampuan melakukan gerakan skill dan trik. 1=basic, 5=sangat kreatif.' },
        { name: 'body_type', label: 'Tipe Tubuh', type: 'select', options: ['Normal', 'Lean', 'Stocky'], description: 'Bentuk fisik pemain. Normal=rata-rata, Lean=kurus/cepat, Stocky=kekar/kuat.' }
      ]
    },
    {
      title: 'Posisi Pemain',
      icon: <MapPin className="w-5 h-5" />,
      fields: [
        { name: 'positions', label: 'Posisi Utama', type: 'select', 
          options: ['ST', 'CF', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'LM', 'RM', 
                   'LB', 'RB', 'CB', 'LWB', 'RWB', 'GK'],
          description: 'Posisi utama pemain di lapangan. ST/CF=striker, CAM/CM/CDM=midfielder, CB/LB/RB=defender, GK=kiper.' }
      ]
    },
    {
      title: 'Keterampilan Teknis Individual',
      icon: <Activity className="w-5 h-5" />,
      fields: [
        { name: 'heading_accuracy', label: 'Heading Accuracy', type: 'number', placeholder: '0-100', min: 0, max: 100, description: 'Ketepatan menyundul bola. Penting untuk pemain tinggi dan situasi bola mati.' },
        { name: 'dribbling', label: 'Dribbling', type: 'number', placeholder: '0-100', min: 0, max: 100, required: true, description: 'Kemampuan menggiring bola melewati lawan. Faktor kunci untuk rating tinggi.' },
        { name: 'curve', label: 'Curve', type: 'number', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan memberikan efek lengkung pada tendangan. Berguna untuk freekick dan crossing.' },
        { name: 'ball_control', label: 'Ball Control', type: 'number', placeholder: '0-100', min: 0, max: 100, required: true, description: 'Kemampuan mengontrol bola dengan berbagai bagian tubuh. Fundamental untuk semua posisi.' },
        { name: 'reactions', label: 'Reactions', type: 'number', placeholder: '0-100', min: 0, max: 100, required: true, description: 'Kecepatan reaksi dalam situasi permainan. Faktor #1 yang paling berpengaruh pada rating.' },
        { name: 'aggression', label: 'Aggression', type: 'number', placeholder: '0-100', min: 0, max: 100, description: 'Tingkat agresivitas dalam duel dan pressing. Berguna untuk defender dan midfielder defensif.' },
        { name: 'positioning', label: 'Positioning', type: 'number', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan berada di posisi yang tepat saat menyerang. Krusial untuk striker dan attacking midfielder.' },
        { name: 'composure', label: 'Composure', type: 'number', placeholder: '0-100', min: 0, max: 100, required: true, description: 'Ketenangan dalam situasi tertekan. Faktor #2 paling penting untuk performa konsisten.' }
      ]
    },
    {
      title: 'Pace Composite',
      icon: <TrendingUp className="w-5 h-5" />,
      type: 'composite',
      compositeKey: 'pace',
      description: 'Gabungan kecepatan: Acceleration (40%) + Sprint Speed (60%). Menentukan seberapa cepat pemain dalam jarak pendek dan panjang.',
      directField: { name: 'pace_composite', label: 'Pace Composite Score', placeholder: '0-100', min: 0, max: 100, description: 'Nilai gabungan kecepatan pemain. 0-60=lambat, 60-80=sedang, 80+=sangat cepat.' },
      detailFields: [
        { name: 'pace_composite_acceleration', label: 'Acceleration', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan mencapai kecepatan maksimal dalam waktu singkat.' },
        { name: 'pace_composite_sprint_speed', label: 'Sprint Speed', placeholder: '0-100', min: 0, max: 100, description: 'Kecepatan maksimal dalam berlari jarak jauh.' }
      ]
    },
    {
      title: 'Shooting Composite',
      icon: <Target className="w-5 h-5" />,
      type: 'composite',
      compositeKey: 'shooting',
      description: 'Gabungan kemampuan shooting: rata-rata dari 5 skill shooting. Menentukan efektivitas dalam mencetak gol.',
      directField: { name: 'shooting_composite', label: 'Shooting Composite Score', placeholder: '0-100', min: 0, max: 100, description: 'Nilai gabungan kemampuan menembak. 0-60=lemah, 60-80=baik, 80+=tajam.' },
      detailFields: [
        { name: 'shooting_composite_finishing', label: 'Finishing', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan menyelesaikan peluang menjadi gol di kotak penalti.' },
        { name: 'shooting_composite_shot_power', label: 'Shot Power', placeholder: '0-100', min: 0, max: 100, description: 'Kekuatan tendangan bola. Berpengaruh pada kecepatan dan penetrasi shot.' },
        { name: 'shooting_composite_long_shots', label: 'Long Shots', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan mencetak gol dari jarak jauh (di luar kotak penalti).' },
        { name: 'shooting_composite_volleys', label: 'Volleys', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan menembak bola di udara tanpa menjatuhkan bola terlebih dahulu.' },
        { name: 'shooting_composite_penalties', label: 'Penalties', placeholder: '0-100', min: 0, max: 100, description: 'Keakuratan dan ketenangan dalam mengeksekusi tendangan penalti.' }
      ]
    },
    {
      title: 'Passing Composite',
      icon: <BarChart3 className="w-5 h-5" />,
      type: 'composite',
      compositeKey: 'passing',
      description: 'Gabungan kemampuan passing: rata-rata dari 5 skill passing. Menentukan kemampuan distribusi bola.',
      directField: { name: 'passing_composite', label: 'Passing Composite Score', placeholder: '0-100', min: 0, max: 100, description: 'Nilai gabungan kemampuan mengoper. 0-60=lemah, 60-80=baik, 80+=playmaker.' },
      detailFields: [
        { name: 'passing_composite_short_passing', label: 'Short Passing', placeholder: '0-100', min: 0, max: 100, description: 'Akurasi passing jarak pendek untuk membangun serangan dan mempertahankan posesi.' },
        { name: 'passing_composite_long_passing', label: 'Long Passing', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan memberikan umpan jarak jauh yang akurat untuk switching play.' },
        { name: 'passing_composite_vision', label: 'Vision', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan melihat dan menciptakan peluang dengan passing yang kreatif.' },
        { name: 'passing_composite_crossing', label: 'Crossing', placeholder: '0-100', min: 0, max: 100, description: 'Kualitas umpan silang dari sayap ke kotak penalti.' },
        { name: 'passing_composite_freekick_accuracy', label: 'Freekick Accuracy', placeholder: '0-100', min: 0, max: 100, description: 'Akurasi tendangan bebas untuk menciptakan peluang atau mencetak gol.' }
      ]
    },
    {
      title: 'Defending Composite',
      icon: <User className="w-5 h-5" />,
      type: 'composite',
      compositeKey: 'defending',
      description: 'Gabungan kemampuan defending: rata-rata dari 4 skill defending. Menentukan efektivitas dalam bertahan.',
      directField: { name: 'defending_composite', label: 'Defending Composite Score', placeholder: '0-100', min: 0, max: 100, required: true, description: 'Nilai gabungan kemampuan bertahan. Faktor penting untuk semua posisi. 0-60=lemah, 60-80=solid, 80+=wall.' },
      detailFields: [
        { name: 'defending_composite_marking', label: 'Marking', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan menjaga dan mengikuti pergerakan lawan tanpa bola.' },
        { name: 'defending_composite_standing_tackle', label: 'Standing Tackle', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan merebut bola dari lawan dalam posisi berdiri.' },
        { name: 'defending_composite_sliding_tackle', label: 'Sliding Tackle', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan dan akurasi tackle sliding untuk memotong serangan.' },
        { name: 'defending_composite_interceptions', label: 'Interceptions', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan mengantisipasi dan memotong passing lawan.' }
      ]
    },
    {
      title: 'Physical Composite',
      icon: <Activity className="w-5 h-5" />,
      type: 'composite',
      compositeKey: 'physical',
      description: 'Gabungan kemampuan fisik: rata-rata dari 5 aspek fisik. Menentukan daya tahan dan kekuatan fisik pemain.',
      directField: { name: 'physical_composite', label: 'Physical Composite Score', placeholder: '0-100', min: 0, max: 100, description: 'Nilai gabungan kemampuan fisik. 0-60=lemah, 60-80=kuat, 80+=beast.' },
      detailFields: [
        { name: 'physical_composite_strength', label: 'Strength', placeholder: '0-100', min: 0, max: 100, description: 'Kekuatan fisik dalam duel body-to-body.' },
        { name: 'physical_composite_jumping', label: 'Jumping', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan melompat tinggi untuk memenangkan bola di udara.' },
        { name: 'physical_composite_stamina', label: 'Stamina', placeholder: '0-100', min: 0, max: 100, description: 'Daya tahan untuk mempertahankan performa sepanjang 90 menit.' },
        { name: 'physical_composite_balance', label: 'Balance', placeholder: '0-100', min: 0, max: 100, description: 'Kemampuan mempertahankan keseimbangan saat berlari atau ditekan lawan.' },
        { name: 'physical_composite_agility', label: 'Agility', placeholder: '0-100', min: 0, max: 100, description: 'Kelincahan dalam mengubah arah dan gerakan cepat.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Target className="w-10 h-10 mr-3 text-indigo-600" />
            Prediksi Rating Pemain
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Masukkan data pemain untuk mendapatkan prediksi Overall Rating dan Potential Rating 
            menggunakan model Random Forest yang telah dilatih
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="text-indigo-600 mr-2">{section.icon}</div>
                    {section.title}
                  </h3>
                  
                  {section.type === 'composite' ? (
                    // Composite Section dengan Toggle
                    <div>
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`${section.compositeKey}_mode`}
                              checked={compositeMode[section.compositeKey] === 'direct'}
                              onChange={() => handleCompositeModeChange(section.compositeKey, 'direct')}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Input Langsung</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`${section.compositeKey}_mode`}
                              checked={compositeMode[section.compositeKey] === 'detailed'}
                              onChange={() => handleCompositeModeChange(section.compositeKey, 'detailed')}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Input Detail</span>
                          </label>
                        </div>
                      </div>
                      
                      {compositeMode[section.compositeKey] === 'direct' ? (
                        // Direct Input Mode
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {section.directField.label}
                            {section.directField.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <input
                            type="number"
                            name={section.directField.name}
                            value={playerData[section.directField.name]}
                            onChange={handleInputChange}
                            placeholder={section.directField.placeholder}
                            min={section.directField.min}
                            max={section.directField.max}
                            required={section.directField.required}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          {section.directField.description && (
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                              {section.directField.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        // Detailed Input Mode
                        <div className="grid md:grid-cols-2 gap-4">
                          {section.detailFields.map((field, fieldIndex) => (
                            <div key={fieldIndex}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              <input
                                type="number"
                                name={field.name}
                                value={playerData[field.name]}
                                onChange={handleInputChange}
                                placeholder={field.placeholder}
                                min={field.min}
                                max={field.max}
                                required={field.required}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                              {field.description && (
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                  {field.description}
                                </p>
                              )}
                            </div>
                          ))}
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 mt-2">
                              {section.compositeKey === 'pace' 
                                ? 'Composite akan dihitung: Acceleration × 0.4 + Sprint Speed × 0.6'
                                : 'Composite akan dihitung sebagai rata-rata dari skill yang diisi'
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular Section
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={playerData[field.name]}
                              onChange={handleInputChange}
                              required={field.required}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="">Pilih {field.label}</option>
                              {field.options.map((option, optIndex) => (
                                <option key={optIndex} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={playerData[field.name]}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              required={field.required}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          )}
                          {field.description && (
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                              {field.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memprediksi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Prediksi Rating
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Petunjuk Penggunaan
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong className="text-red-600">Field mandatory (*)</strong>: Age, Reactions, Composure, Ball Control, Dribbling, Defending Composite</li>
                  <li>• Field mandatory adalah faktor kunci model dengan importance tinggi</li>
                  <li>• <strong>Composite features:</strong> Pilih "Input Langsung" untuk nilai total atau "Input Detail" untuk komponen individual</li>
                  <li>• Mode "Input Detail" akan menghitung composite otomatis sesuai formula model</li>
                  <li>• Semakin banyak field yang diisi, semakin akurat prediksi</li>
                  <li>• Model menggunakan 22 fitur yang telah dioptimasi dengan Random Forest</li>
                </ul>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-semibold text-red-900">Error</h4>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Prediction Results */}
              {prediction && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Hasil Prediksi
                  </h3>

                  {/* Main Results */}
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Overall Rating</span>
                        <span className="text-2xl font-bold text-green-700">
                          {prediction.overall_rating_prediction}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Potential Rating</span>
                        <span className="text-2xl font-bold text-blue-700">
                          {prediction.potential_rating_prediction}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Confidence</span>
                        <span className="text-lg font-bold text-purple-700">
                          {prediction.confidence}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Player Insights */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      Analisis & Insight Pemain
                    </h4>
                    <div className="space-y-3">
                      {generateInsights(prediction.overall_rating_prediction, prediction.potential_rating_prediction).map((insight, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          insight.type === 'elite' ? 'bg-yellow-50 border-yellow-400' :
                          insight.type === 'world_class' ? 'bg-indigo-50 border-indigo-400' :
                          insight.type === 'quality' ? 'bg-green-50 border-green-400' :
                          insight.type === 'promising' ? 'bg-blue-50 border-blue-400' :
                          insight.type === 'decent' ? 'bg-gray-50 border-gray-400' :
                          insight.type === 'developing' ? 'bg-orange-50 border-orange-400' :
                          insight.type === 'high_potential' ? 'bg-emerald-50 border-emerald-400' :
                          insight.type === 'good_potential' ? 'bg-teal-50 border-teal-400' :
                          insight.type === 'moderate_potential' ? 'bg-cyan-50 border-cyan-400' :
                          insight.type === 'limited_potential' ? 'bg-amber-50 border-amber-400' :
                          insight.type === 'peak_performance' ? 'bg-purple-50 border-purple-400' :
                          insight.type === 'wonderkid' ? 'bg-pink-50 border-pink-400' :
                          insight.type === 'veteran' ? 'bg-red-50 border-red-400' :
                          insight.type === 'goalkeeper' ? 'bg-slate-50 border-slate-400' :
                          insight.type === 'striker' ? 'bg-rose-50 border-rose-400' :
                          insight.type === 'defender' ? 'bg-stone-50 border-stone-400' :
                          insight.type === 'midfielder' ? 'bg-violet-50 border-violet-400' :
                          'bg-gray-50 border-gray-400'
                        }`}>
                          <div className="flex items-start">
                            <span className="text-lg mr-3">{insight.icon}</span>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 text-sm">{insight.title}</h5>
                              <p className="text-gray-700 text-sm mt-1">{insight.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="text-sm text-gray-600 mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Features Used:</span>
                      <span className="font-medium">{prediction.input_features}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Completeness:</span>
                      <span className="font-medium">{prediction.input_features_percent}</span>
                    </div>
                  </div>

                  {/* Growth Indicator */}
                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Growth Potential</span>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="font-bold text-green-600">
                          +{(prediction.potential_rating_prediction - prediction.overall_rating_prediction).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={downloadResults}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Unduh Laporan PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
