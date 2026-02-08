import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { NeuralNetworkBackground } from '@/components/NeuralNetworkBackground';

type Section = 'home' | 'about' | 'skills' | 'experience' | 'projects' | 'contact';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId as Section);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Hero onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'skills':
        return <Skills />;
      case 'experience':
        return <Experience />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ position: 'relative', overflow: 'hidden' }}>
      <NeuralNetworkBackground />
      
      {currentSection !== 'home' && (
        <div style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 20 }}>
          <button
            onClick={() => setCurrentSection('home')}
            style={{
              padding: isMobile ? '0.75rem 0.75rem' : '0.5rem 1rem',
              backgroundColor: '#3559c8',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              fontWeight: '500',
              minHeight: isMobile ? '44px' : 'auto',
              minWidth: isMobile ? '44px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#254aa0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3559c8')}
            onTouchStart={(e) => (e.currentTarget.style.backgroundColor = '#254aa0')}
            onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = '#3559c8')}
          >
            {isMobile ? '←' : '← Back'}
          </button>
        </div>
      )}
      
      <div style={{ position: 'relative', zIndex: 10, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {renderSection()}
        </div>
        
        {currentSection !== 'home' && <Footer />}
      </div>
    </div>
  );
}
