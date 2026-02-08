import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-8 md:py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Left side - branding */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-foreground mb-1">Gaaurav Lath</h3>
            <p className="text-sm text-muted-foreground">
              Crafted with precision and passion for data
            </p>
          </div>

          {/* Right side - copyright */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-xs text-muted-foreground">
              © {currentYear} All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
