import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { KIDManager } from './components/KIDManager/KIDManager'
import { Home } from './components/Home/Home'
import AnnualReportAnalyzer from './components/AnnualReportAnalyzer/AnnualReportAnalyzer'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kid-analyzer" element={
          <MainLayout>
            <KIDManager onUpload={(files) => console.log('Files uploaded:', files)} />
          </MainLayout>
        } />
        <Route path="/annual-reports" element={
          <MainLayout>
            <AnnualReportAnalyzer />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App
