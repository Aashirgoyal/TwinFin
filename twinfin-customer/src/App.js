import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './components/routing.js';
import Header from './components/header.js';
import Footer from './components/footer.js';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Header />
          <main className="app-main">
            <Routing />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
