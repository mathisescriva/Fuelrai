import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { KIDManager } from './components/KIDManager/KIDManager'
import { Home } from './components/Home/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kid-analyzer" element={
          <MainLayout>
            <KIDManager />
          </MainLayout>
        } />
        <Route path="/annual-reports" element={
          <MainLayout>
            <div className="p-4">
              <h1 className="text-2xl font-bold">Analyseur de rapports annuels</h1>
              <p className="mt-4">Cette fonctionnalité sera bientôt disponible.</p>
            </div>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App
