import VerificationSuccess from './pages/VerificationSuccess';
import VerificationError from './pages/VerificationError';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/verification-error" element={<VerificationError />} />
      </Routes>
    </Router>
  );
}

export default App; 