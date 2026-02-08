import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';
import { slideUpVariants, staggerContainerVariants } from '@/lib/animations';

const experiences = [
  {
    id: 1,
    role: 'Data Analyst - Capacity Management',
    company: 'Eindhoven University of Technology',
    period: 'November 2025 - January 2026',
    description: 'Consolidated and validated multi-source datasets to support strategic resource planning',
    highlights: [
      'Consolidated & validated multi-source datasets using Power Query, automating manual workflows to reduce processing time by 65%',
      'Developed dynamic Power BI dashboards with DAX queries to analyze capacity metrics',
    ],
  },
  {
    id: 2,
    role: 'Student Teaching Assistant - Data Science and Impact of Technology',
    company: 'Eindhoven University of Technology',
    period: 'September 2024 - Present',
    description: 'Guided 500+ students through data-driven analysis and programming fundamentals',
    highlights: [
      'Guided student groups through data-driven analysis techniques and ethical implications',
      'Assisted 500+ students in learning programming concepts and applying them to exercises',
      'Delivered hands-on support that contributed to improved student performance and course success rates',
    ],
  },
  {
    id: 3,
    role: 'Data Scientist - Computer Vision and Analytics',
    company: 'Unique Enterprises Holding Co., Ltd. (Thailand)',
    period: 'September 2023 - August 2025',
    description: 'Engineered automated quality control and classification workflows for gemstone analysis',
    highlights: [
      'Engineered an automated quality control workflow that processed 50,000+ units with 97% precision, reducing manual inspection time by 75%',
      'Performed advanced data analysis on gemstone attributes using Excel and Power BI, identifying seasonal price variation of 15%',
      'Improved strategic decision-making speed by 30% through interactive dashboards',
    ],
  },
  {
    id: 4,
    role: 'Admissions Data Systems Coordinator',
    company: 'Eindhoven University of Technology',
    period: 'January 2024 - July 2025',
    description: 'Optimized applicant data systems and streamlined admissions workflows',
    highlights: [
      'Optimized and maintained structured applicant data systems for 1000+ candidates using process automation tools',
      'Reduced processing time by 20% while enabling real-time communication with prospective students',
      'Designed and implemented standardized communication templates, improving applicant onboarding efficiency by 30%',
    ],
  },
  {
    id: 5,
    role: 'Internship - Data Analytics',
    company: 'Eindhoven University of Technology',
    period: 'June 2023 - August 2023',
    description: 'Developed data analysis pipelines and visualization dashboards',
    highlights: [
      'Created automated data collection and analysis pipelines for research projects',
      'Designed interactive dashboards for stakeholder reporting',
      'Collaborated with cross-functional teams to deliver insights-driven solutions',
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-20 md:py-28 bg-background">
      <div className="container max-w-5xl mx-auto px-4">
        <ScrollReveal>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainerVariants}
            className="space-y-12"
          >
            {/* Section Header */}
            <motion.div variants={slideUpVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Experience
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A journey through diverse roles and impactful projects
              </p>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={staggerContainerVariants} className="space-y-8">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  variants={slideUpVariants}
                  className="relative"
                >
                  {/* Timeline line and dot */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-accent/30 md:left-1/2 md:transform md:-translate-x-1/2" />

                  <div className="md:flex md:gap-8">
                    {/* Timeline dot */}
                    <div className="hidden md:flex md:w-1/2 md:justify-end md:pr-12">
                      <div className="absolute left-1/2 top-6 w-4 h-4 bg-accent rounded-full transform -translate-x-1/2 border-4 border-background" />
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 md:pl-12 pl-8">
                      {/* Timeline dot for mobile */}
                      <div className="md:hidden absolute left-0 top-6 w-3 h-3 bg-accent rounded-full border-2 border-background" />

                      {/* Content card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-lg border border-border bg-background hover:border-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{experience.role}</h3>
                            <p className="text-accent font-semibold">{experience.company}</p>
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                            {experience.period}
                          </span>
                        </div>

                        <p className="text-muted-foreground mb-4">{experience.description}</p>

                        {/* Highlights */}
                        <ul className="space-y-2">
                          {experience.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="text-accent mt-1">▸</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
