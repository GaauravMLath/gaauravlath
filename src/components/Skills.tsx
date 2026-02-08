import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';
import { slideUpVariants, staggerContainerVariants, hoverScaleVariants } from '@/lib/animations';

const skillCategories = [
  {
    category: 'Programming Languages',
    skills: ['Python', 'SQL', 'R', 'JavaScript'],
  },
  {
    category: 'Data & ML Frameworks',
    skills: ['Pandas', 'TensorFlow', 'Keras', 'Scikit-learn', 'LangChain', 'LangGraph'],
  },
  {
    category: 'Data Visualization & BI',
    skills: ['Power BI', 'Tableau', 'Matplotlib', 'Plotly', 'Seaborn'],
  },
  {
    category: 'Cloud & Big Data',
    skills: ['AWS', 'Apache Spark', 'Databricks', 'NoSQL', 'GitHub'],
  },
  {
    category: 'Deep Learning & NLP',
    skills: ['CNN', 'LSTM', 'BiLSTM', 'ResNet50', 'BERTweet', 'YOLO', 'Transformers'],
  },
  {
    category: 'Core Competencies',
    skills: ['Leadership', 'Teamwork', 'Business Acumen', 'Strategic Thinking', 'Agile/Scrum'],
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-32 bg-card">
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </motion.div>

            {/* Skills grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial="initial"
                  whileHover="hover"
                  variants={hoverScaleVariants}
                  className="p-6 rounded-lg border border-border bg-background hover:border-accent/50 transition-colors"
                >
                  {/* Category header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">{category.category}</h3>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skillIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: skillIndex * 0.05 }}
                        className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 hover:border-accent/50 transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional info */}
            <motion.div
              variants={slideUpVariants}
              className="mt-16 p-8 rounded-lg bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20"
            >
              <h3 className="text-lg font-bold mb-3 text-foreground">Hobbies & Interests</h3>
              <p className="text-muted-foreground">
                Beyond work, I'm passionate about badminton, finance & investments, and automobiles & aviation. 
                I'm constantly exploring emerging technologies and methodologies in data science, with current interests in 
                multi-agent systems, advanced time series analysis, and ethical AI practices.
              </p>
            </motion.div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
