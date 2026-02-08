import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';
import { slideUpVariants, staggerContainerVariants } from '@/lib/animations';

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container max-w-5xl mx-auto px-4">
        <ScrollReveal>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainerVariants}
          >
            {/* Section heading */}
            <motion.div variants={slideUpVariants} className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </motion.div>

            {/* Content grid */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Professional story */}
              <motion.div variants={slideUpVariants} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-accent">The Professional</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Analytical data professional with 2 years of experience in data analytics and predictive modeling. 
                    I leverage expertise in Python, SQL, and Power BI to build high-precision analytical models that solve 
                    complex business problems. I'm passionate about improving data flow efficiency and developing intuitive 
                    dashboards that accelerate decision-making and improve model performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-accent">Education</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Joint Bachelor of Science in Data Science
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Eindhoven University of Technology & Tilburg University, The Netherlands
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    September 2022 – July 2025 | Minor: Business and Entrepreneurship
                  </p>
                </div>
              </motion.div>

              {/* Right side - Thesis & Personal story */}
              <motion.div variants={slideUpVariants} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-accent">Bachelor Thesis</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Predictive Energy Storage Management
                  </p>
                  <ul className="text-muted-foreground leading-relaxed text-sm space-y-2 mt-2">
                    <li>• Developed a robust data pipeline integrating real-time consumption and weather data with CNN-BiLSTM prediction framework, <span className="font-semibold">cutting prediction errors by 89%</span></li>
                    <li>• Designed a real-time battery dispatch algorithm, <span className="font-semibold">reducing peak electricity demand by 15%</span> for large-scale urban energy systems</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-accent">Beyond the Data</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I'm a lifelong learner who thrives on staying at the forefront of data science innovations. 
                    When I'm not diving into datasets, you'll find me exploring new technologies or sharing knowledge 
                    with the community. I'm passionate about making data science more accessible and interpretable.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
