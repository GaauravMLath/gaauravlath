import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface NodeDetails {
  id: string;
  label: string;
  type: 'skill' | 'project' | 'section';
  description: string;
  details?: string[];
  tags?: string[];
  icon?: string;
}

interface NodeDetailsModalProps {
  node: NodeDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NodeDetailsModal({ node, isOpen, onClose }: NodeDetailsModalProps) {
  if (!node) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50,
              maxWidth: '90vw',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                padding: '32px',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#1e3a8a',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {node.label}
                  </h2>
                  {node.type && (
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#3559c8',
                        backgroundColor: '#e0e7ff',
                        padding: '4px 12px',
                        borderRadius: '4px',
                      }}
                    >
                      {node.type}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#6b7280';
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#374151',
                  margin: '0 0 24px 0',
                }}
              >
                {node.description}
              </p>

              {/* Details List */}
              {node.details && node.details.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#6b7280',
                      margin: '0 0 12px 0',
                    }}
                  >
                    Key Points
                  </h3>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {node.details.map((detail, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          fontSize: '14px',
                          color: '#374151',
                          padding: '8px 0 8px 24px',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            color: '#3559c8',
                            fontWeight: '600',
                          }}
                        >
                          •
                        </span>
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {node.tags && node.tags.length > 0 && (
                <div>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#6b7280',
                      margin: '0 0 12px 0',
                    }}
                  >
                    Tags
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {node.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#3559c8',
                          backgroundColor: '#f0f4ff',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: '1px solid #e0e7ff',
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
