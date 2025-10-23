import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Formations from './components/Formations';
import PackIoT from './components/PackIoT';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Inscription from './components/Inscription'; 
import FormationsPage from './components/FormationsPage';
import PackIot from './components/PackIoT';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Formations />
                <PackIoT />
                <Contact />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/pack-iot" element={<PackIot />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/inscription" element={<Inscription />} /> {/* Ajoutez cette route */}
            <Route path="/formations" element={<FormationsPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;