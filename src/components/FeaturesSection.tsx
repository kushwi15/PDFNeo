import { motion } from "framer-motion";
import { Shield, Cpu, Eye, HardDrive, Clock, Lock } from "lucide-react";

import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t('features.items.private.title'),
      description: t('features.items.private.description')
    },
    {
      icon: Cpu,
      title: t('features.items.performance.title'),
      description: t('features.items.performance.description')
    },
    {
      icon: Eye,
      title: t('features.items.noTracking.title'),
      description: t('features.items.noTracking.description')
    },
    {
      icon: HardDrive,
      title: t('features.items.memory.title'),
      description: t('features.items.memory.description')
    },
    {
      icon: Clock,
      title: t('features.items.instant.title'),
      description: t('features.items.instant.description')
    },
    {
      icon: Lock,
      title: t('features.items.openSource.title'),
      description: t('features.items.openSource.description')
    },
  ];

  return (
    <section id="features" className="border-t bg-secondary/30 py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t('features.title')}</h2>
          <p className="mt-3 text-muted-foreground">{t('features.subtitle')}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border bg-card p-6 card-shadow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
