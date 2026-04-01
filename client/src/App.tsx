import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Templates from './pages/Templates';
import PrintQueue from './pages/PrintQueue';

const App: React.FC = () => {
  const appStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const bodyStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    height: 'calc(100vh - 60px)',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    background: '#f5f5f5',
  };

  return (
    <BrowserRouter>
      <div style={appStyle}>
        <Navbar />
        <div style={bodyStyle}>
          <Sidebar />
          <main style={mainStyle}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/print-queue" element={<PrintQueue />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
