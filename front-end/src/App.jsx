import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout component
import Layout from './components/Layout';

// Import page components
import HomePage from './pages/HomePage';
import DataOverview from './pages/DataOverview';
import EDAVisualization from './pages/EDAVisualization';
import DataCleaning from './pages/DataCleaning';
import Modeling from './pages/Modeling';
import Results from './pages/Results';
import Insights from './pages/Insights';
import Prediction from './pages/Prediction';
import Team from './pages/Team';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/data-overview" element={<DataOverview />} />
          <Route path="/eda" element={<EDAVisualization />} />
          <Route path="/data-cleaning" element={<DataCleaning />} />
          <Route path="/modeling" element={<Modeling />} />
          <Route path="/results" element={<Results />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;