import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PortfolioPage from './pages/Portfolio.jsx';
import AdminPage from './pages/Admin.jsx';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
