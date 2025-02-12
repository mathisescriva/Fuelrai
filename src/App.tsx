import { MainLayout } from './layouts/MainLayout'
import { KIDManager } from './components/KIDManager/KIDManager'

function App() {
  return (
    <MainLayout>
      <KIDManager onUpload={(files) => console.log('Files uploaded:', files)} />
    </MainLayout>
  );
}

export default App
