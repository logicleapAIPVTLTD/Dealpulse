import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StreamPage from './pages/StreamPage';
import DocIntelligencePage from './pages/DocIntelligencePage';
import MatchingPage from './pages/MatchingPage';
import LegalPage from './pages/LegalPage';
import PredictionPage from './pages/PredictionPage';
import CompanyDetailPage from './pages/CompanyDetailPage'; // 1. Import the new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="stream" element={<StreamPage />} />
          <Route path="doc-intelligence" element={<DocIntelligencePage />} />
          <Route path="matching" element={<MatchingPage />} />
          <Route path="legal" element={<LegalPage />} />
          <Route path="prediction" element={<PredictionPage />} />
          
          {/* 2. Add the new route */}
          <Route path="company/:companyName" element={<CompanyDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;