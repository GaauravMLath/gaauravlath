import { motion } from 'framer-motion';

interface NetworkLoaderProps {
  isLoading: boolean;
}

export function NetworkLoader({ isLoading }: NetworkLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      animate={isLoading ? { opacity: 1, x: 0 } : { opacity: 0, x: -window.innerWidth }}
      transition={{
        duration: 1.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: isLoading ? 0 : 1.2,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        pointerEvents: isLoading ? 'auto' : 'none',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Name Container */}
      <div
        style={{
          textAlign: 'center',
        }}
      >
        {/* Main Name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoading ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          style={{
            fontSize: '5.5rem',
            fontWeight: '800',
            color: '#1e3a8a',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
            margin: 0,
            padding: 0,
          }}
        >
          Gaaurav Lath
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoading ? { opacity: 1 } : { opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: 'easeOut',
          }}
          style={{
            fontSize: '1.25rem',
            fontWeight: '500',
            color: '#3559c8',
            letterSpacing: '0.08em',
            margin: '1rem 0 0 0',
            padding: 0,
            textTransform: 'uppercase',
          }}
        >
          Data Scientist
        </motion.p>
      </div>
    </motion.div>
  );
}
