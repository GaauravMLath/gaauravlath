import { motion } from 'framer-motion';
import { Mail, Linkedin, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from './ScrollReveal';
import { slideUpVariants, staggerContainerVariants } from '@/lib/animations';

const contactInfo = {
  name: 'Gaaurav Manish Kumar Lath',
  email: 'gaauravlath@gmail.com',
  phone: '+31687353543',
  location: 'The Netherlands',
  linkedin: 'https://www.linkedin.com/in/gaaurav-lath/',
};

const socialLinks = [
  { icon: Mail, label: 'Email', href: `mailto:${contactInfo.email}`, color: 'hover:text-red-400' },
  { icon: Linkedin, label: 'LinkedIn', href: contactInfo.linkedin, color: 'hover:text-blue-400' },
  { icon: Phone, label: 'Phone', href: `tel:${contactInfo.phone}`, color: 'hover:text-green-400' },
  { icon: MapPin, label: 'Location', href: '#', color: 'hover:text-orange-400' },
];

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainerVariants}
            className="text-center"
          >
            {/* Section heading */}
            <motion.div variants={slideUpVariants} className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mx-auto" />
            </motion.div>

            {/* Contact name */}
            <motion.h3
              variants={slideUpVariants}
              className="text-2xl md:text-3xl font-bold mb-4 text-foreground"
            >
              {contactInfo.name}
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={slideUpVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
            >
              I'm always interested in hearing about new projects and opportunities. Whether you have a question or
              just want to say hello, feel free to reach out!
            </motion.p>

            {/* Main CTA */}
            <motion.div variants={slideUpVariants} className="mb-16">
              <a href={`mailto:${contactInfo.email}`}>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg"
                >
                  Send me an Email
                </Button>
              </a>
            </motion.div>

            {/* Contact details grid */}
            <motion.div
              variants={slideUpVariants}
              className="grid md:grid-cols-2 gap-6 mb-12"
            >
              <div className="p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors">
                <Mail className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">Email</h3>
                <a href={`mailto:${contactInfo.email}`} className="text-accent hover:underline">
                  {contactInfo.email}
                </a>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors">
                <Phone className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">Phone</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-accent hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors">
                <Linkedin className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">LinkedIn</h3>
                <a 
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  View Profile
                </a>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors">
                <MapPin className="h-6 w-6 text-accent mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">{contactInfo.location}</p>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={slideUpVariants}
              className="flex justify-center gap-6"
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target={social.label !== 'Location' ? '_blank' : undefined}
                    rel={social.label !== 'Location' ? 'noopener noreferrer' : undefined}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-full border border-border hover:border-accent/50 transition-all ${social.color}`}
                    title={social.label}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
