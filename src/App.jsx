import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolPage from './pages/ToolPage';
import ExamSpecsPage from './pages/ExamSpecsPage';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exams" element={<ExamSpecsPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/:category" element={<ToolsPage />} />
              <Route path="/tool/:toolId" element={<ToolPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}
