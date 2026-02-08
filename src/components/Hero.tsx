import { HeroNetwork } from './HeroNetwork';
import { NameDisplay } from './NameDisplay';

interface HeroProps {
  onNavigate?: (sectionId: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const handleNavigate = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      // Fallback to traditional scroll
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <NameDisplay />
      <HeroNetwork onNavigate={handleNavigate} />
    </>
  );
}
