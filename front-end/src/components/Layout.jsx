import React, { useState } from 'react';
import { 
  Home, 
  Database, 
  BarChart3, 
  Settings, 
  Brain, 
  Target, 
  Lightbulb, 
  Users,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children, currentPage = 'home', onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'data-overview', icon: Database, label: 'Data Overview' },
    { id: 'eda', icon: BarChart3, label: 'EDA & Visualisasi' },
    { id: 'data-cleaning', icon: Settings, label: 'Data Cleaning' },
    { id: 'modeling', icon: Brain, label: 'Modeling' },
    { id: 'results', icon: Target, label: 'Hasil Visualisasi' },
    { id: 'insights', icon: Lightbulb, label: 'Insight & Rekomendasi' },
    { id: 'about', icon: Users, label: 'Tentang Tim' }
  ];

  const isActive = (pageId) => currentPage === pageId;

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Football Rating</h1>
              <p className="text-sm text-gray-500">Predict Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive(item.id)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Football Rating Predict</p>
            <p>Data Science Dashboard</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;