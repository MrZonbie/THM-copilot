import { Layout } from './components/Layout';
import { MainArea } from './components/MainArea';
import { ContextPanel } from './components/ContextPanel';

function App() {
  return (
    <Layout>
      <MainArea />
      <ContextPanel />
    </Layout>
  );
}

export default App;
