import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Github, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { slideUpVariants, staggerContainerVariants } from '@/lib/animations';

const projects = [
  {
    id: 1,
    title: 'Intelligent Research & Market Analysis AgenticAI',
    description: '5-agent autonomous research system reducing research time by 96%',
    problem: 'Manual market research and analysis is time-consuming and prone to human bias',
    data: 'Multi-source data integration with statistical analysis pipelines',
    impact: 'Reduced research time by 96% with 95% accuracy in insights generation',
    technologies: ['LangChain', 'LangGraph', 'Multi-Agent Systems', 'NLP', 'SciPy'],
    links: { github: '#', demo: '#' },
  },
  {
    id: 2,
    title: 'Predictive Energy Storage Management',
    description: 'CNN-BiLSTM framework for smart grid optimization',
    problem: 'Inefficient peak demand management in residential grids',
    data: 'Real-time consumption and weather data integrated into prediction framework',
    impact: 'Cut prediction errors by 89%, reduced peak electricity demand by 15%',
    technologies: ['Python', 'CNN', 'BiLSTM', 'TensorFlow', 'Time-Series Forecasting'],
    links: { github: '#', demo: '#' },
  },
  {
    id: 3,
    title: 'Automated Fish Counting for Marine Conservation',
    description: 'AI-based fish detection and counting for reef monitoring',
    problem: 'Manual marine biodiversity monitoring is labor-intensive and inaccurate',
    data: 'Underwater footage with YOLO-Fish and Deep SORT tracking',
    impact: 'Achieved 95% precision in fish detection, supporting ReefSupport conservation strategies',
    technologies: ['YOLO-5', 'Object Detection', 'Deep SORT', 'Deep Learning'],
    links: { github: 'https://drive.google.com/file/d/1vYCFqiXONmfPpqrvKIMDJkurbEf1h3qi/view?usp=sharing', demo: '#' },
  },
  {
    id: 4,
    title: 'Political Leaning Detection in Social Media',
    description: 'NLP analysis of 198 million tweets across 30+ languages',
    problem: 'Understanding political sentiment and leanings across diverse social media',
    data: '198 million tweets in 30+ languages with BERTweet embeddings',
    impact: 'Achieved AUC-ROC score of 0.849 in political leaning classification',
    technologies: ['NLP', 'BERTweet', 'Logistic Regression', 'Hugging Face', 'Feature Engineering'],
    links: { github: '#', demo: '#' },
  },
  {
    id: 5,
    title: 'Predictive Modeling for Sleep Quality',
    description: 'Wearable data analysis identifying key sleep quality predictors',
    problem: 'Understanding factors affecting sleep quality from heterogeneous wearable data',
    data: '30-day wearable study with 20%+ missing values requiring imputation',
    impact: 'Identified anaerobic exercise as key predictor, 73% improvement in sleep scores',
    technologies: ['Data Modelling', 'Time Series Analysis', 'Statistical Analysis', 'FAIR Principles'],
    links: { github: '#', demo: '#' },
  },
  {
    id: 6,
    title: 'Impact of Use of Force on Public Trust',
    description: 'Statistical analysis of 850,000+ police use of force cases',
    problem: 'Identifying patterns in police use of force and their impact on public trust',
    data: '850,000+ police cases across London boroughs with multicollinearity handling',
    impact: 'Predictive models identifying high-risk patterns, targeting 10% improvement in public trust',
    technologies: ['Statistical Analysis', 'Hyperparameter Tuning', 'Data Visualization', 'Predictive Modeling'],
    links: { github: '#', demo: '#' },
  },
  {
    id: 7,
    title: 'Deep Learning for Medical Imaging',
    description: 'ResNet50-based thoracic disorder detection from chest X-rays',
    problem: 'Automated detection of thoracic disorders from medical imaging',
    data: '25,000+ chest X-rays with disease-specific classification',
    impact: 'High classification accuracy with robust disease-specific models',
    technologies: ['PyTorch', 'ResNet50', 'CNN', 'Data Augmentation', 'Binary Classification'],
    links: { github: '#', demo: '#' },
  },
  {
    id: 8,
    title: 'Optimizing Credit Dynamics Dashboard',
    description: 'Interactive credit risk dashboard with predictive analytics',
    problem: 'Understanding loan repayment patterns and creditworthiness assessment',
    data: 'Loan portfolio data with financial correlations and behavior patterns',
    impact: 'Projected 15% improvement in loan portfolio risk assessment accuracy',
    technologies: ['Data Visualization', 'Business Intelligence', 'Predictive Modeling', 'Financial Analysis'],
    links: { github: '#', demo: '#' },
  },
  {
    id: 9,
    title: 'Electronic Patient Dossier Development',
    description: 'End-to-end EPD system for healthcare digital transformation',
    problem: 'Streamlining paper-based patient intake and care coordination workflows',
    data: 'Patient data with capacity management and secure access control',
    impact: 'Automated patient intake, care group assignment, and treatment scheduling',
    technologies: ['Mendix', 'Microflows', 'Entity Management', 'Data Privacy', 'XPath Constraints'],
    links: { github: '#', demo: '#' },
  },
];

export function Projects() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="projects" className="py-20 md:py-32 bg-background">
      <div className="container max-w-5xl mx-auto px-4">
        <ScrollReveal>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainerVariants}
          >
            {/* Section heading */}
            <motion.div variants={slideUpVariants} className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </motion.div>

            {/* Projects list */}
            <div className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={slideUpVariants}
                  className="border border-border rounded-lg overflow-hidden bg-card hover:border-accent/50 transition-colors"
                >
                  {/* Header - always visible */}
                  <button
                    onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-accent/5 transition-colors"
                  >
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                      <p className="text-muted-foreground text-sm">{project.description}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedId === project.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 flex-shrink-0"
                    >
                      <ChevronDown className="h-5 w-5 text-accent" />
                    </motion.div>
                  </button>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {expandedId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-border"
                      >
                        <div className="px-6 py-6 space-y-4 bg-accent/5">
                          {/* Problem */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-accent" />
                              Problem
                            </h4>
                            <p className="text-muted-foreground text-sm">{project.problem}</p>
                          </div>

                          {/* Data */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-accent" />
                              Data
                            </h4>
                            <p className="text-muted-foreground text-sm">{project.data}</p>
                          </div>

                          {/* Impact */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-accent" />
                              Impact
                            </h4>
                            <p className="text-muted-foreground text-sm">{project.impact}</p>
                          </div>

                          {/* Technologies */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Links */}
                          <div className="flex gap-4 pt-4">
                            {project.links.github !== '#' && (
                              <a
                                href={project.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
                              >
                                <Github className="h-4 w-4" />
                                Code
                              </a>
                            )}
                            {project.links.demo !== '#' && (
                              <a
                                href={project.links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
