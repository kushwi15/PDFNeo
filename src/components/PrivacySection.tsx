import { motion } from "framer-motion";
import { ShieldCheck, ServerOff, EyeOff, Trash2, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const PrivacySection = () => {
  const { t } = useTranslation();

  const items = [
    {
      icon: ServerOff,
      label: t('privacy.items.noServers.title'),
      detail: t('privacy.items.noServers.detail')
    },
    {
      icon: EyeOff,
      label: t('privacy.items.noTracking.title'),
      detail: t('privacy.items.noTracking.detail')
    },
    {
      icon: Trash2,
      label: t('privacy.items.volatile.title'),
      detail: t('privacy.items.volatile.detail')
    },
    {
      icon: ShieldCheck,
      label: t('privacy.items.auditable.title'),
      detail: t('privacy.items.auditable.detail')
    },
  ];

  return (
    <section id="privacy" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">{t('privacy.title')}</h2>
            <p className="mt-3 text-muted-foreground">
              {t('privacy.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mb-16">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex gap-4 rounded-xl border bg-card p-5 text-left card-shadow"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{item.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border bg-card p-8 shadow-sm md:p-12"
          >
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('privacy.cardTitle')}</h3>
                <p className="mt-2 text-muted-foreground">
                  {t('privacy.cardText')}
                </p>
                <div className="mt-6 flex items-center gap-2 font-medium text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                  {t('privacy.verdict')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
