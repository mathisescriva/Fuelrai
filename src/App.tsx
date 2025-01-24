import { useState } from 'react'
import { MainLayout } from './layouts/MainLayout'
import { KIDManager } from './components/KIDManager/KIDManager'

function App() {
  return (
    <MainLayout>
      <KIDManager />
    </MainLayout>
  );
}

export default App
