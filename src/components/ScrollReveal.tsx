import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  threshold?: number;
}

/**
 * ScrollReveal component - reveals content with animation when it comes into view
 * Uses Intersection Observer for performance
 */
export function ScrollReveal({
  children,
  variants,
  className = '',
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
