import React, { useState } from 'react';
import Layout from './components/Layout';

import HomePage from './views/HomePage';
// import DataOverview from './views/DataOverview';
// import EDA from './views/EDA';
// import DataCleaning from './views/DataCleaning';
// import Modeling from './views/Modeling';
// import Results from './views/Results';
// import Insights from './views/Insights';
// import About from './views/About';

// Temporary placeholder component
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-lg text-gray-600">Halaman ini sedang dalam pengembangan...</p>
    </div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'data-overview':
        return <PlaceholderPage title="Data Overview" />;
      case 'eda':
        return <PlaceholderPage title="EDA & Visualisasi" />;
      case 'data-cleaning':
        return <PlaceholderPage title="Data Cleaning & Transformation" />;
      case 'modeling':
        return <PlaceholderPage title="Modeling" />;
      case 'results':
        return <PlaceholderPage title="Hasil Visualisasi" />;
      case 'insights':
        return <PlaceholderPage title="Insight & Rekomendasi" />;
      case 'about':
        return <PlaceholderPage title="Tentang Tim" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;