import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Database, 
  BarChart3, 
  Settings, 
  Brain, 
  TrendingUp, 
  Target, 
  Users,
  Menu,
  X,
  ChevronRight,
  ChevronUp
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const location = useLocation();
  const mainContentRef = React.useRef(null);

  // Monitor scroll position for scroll to top button
  React.useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const handleScroll = () => {
      setShowScrollTop(mainContent.scrollTop > 400);
    };

    mainContent.addEventListener('scroll', handleScroll);
    return () => mainContent.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { 
      id: '/', 
      label: 'Beranda', 
      icon: Home, 
      description: 'Dashboard Utama',
      path: '/'
    },
    { 
      id: '/data-overview', 
      label: 'Data Overview', 
      icon: Database, 
      description: 'Statistik & Preview Data',
      path: '/data-overview'
    },
    { 
      id: '/eda', 
      label: 'EDA & Visualisasi', 
      icon: BarChart3, 
      description: 'Eksplorasi Data',
      path: '/eda'
    },
    { 
      id: '/data-cleaning', 
      label: 'Data Cleaning', 
      icon: Settings, 
      description: 'Preprocessing Data',
      path: '/data-cleaning'
    },
    { 
      id: '/modeling', 
      label: 'Modeling', 
      icon: Brain, 
      description: 'Machine Learning Models',
      path: '/modeling'
    },
    { 
      id: '/results', 
      label: 'Visualisasi Hasil', 
      icon: TrendingUp, 
      description: 'Story Telling',
      path: '/results'
    },
    { 
      id: '/insights', 
      label: 'Insight', 
      icon: Target, 
      description: 'Insight dan Rekomendasi',
      path: '/insights'
    },
    { 
      id: '/prediction', 
      label: 'Prediksi', 
      icon: Target, 
      description: 'Model Prediction',
      path: '/prediction'
    },
    { 
      id: '/team', 
      label: 'Tentang Tim', 
      icon: Users, 
      description: 'Info Pembuat',
      path: '/team'
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-white shadow-xl transition-all duration-300 relative z-10`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚽</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Football Analytics</h2>
                  <p className="text-sm text-gray-600">Data Science Dashboard</p>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                {sidebarOpen && (
                  <div className="text-left">
                    <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className={`text-sm ${isActive ? 'text-green-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div ref={mainContentRef} className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>

      {/* Global Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl z-50 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 transition-transform duration-200" />
        </button>
      )}
    </div>
  );
};

export default Layout;