import { motion } from "framer-motion";
import { Shield, Cpu, Eye, HardDrive, Clock, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Private & Secure",
    description: "Your documents never leave your side. Unlike traditional online PDF editors, PDFNeo processes every single byte locally within your browser's sandbox environment. No uploads, no server-side storage, and zero risk of data breaches."
  },
  {
    icon: Cpu,
    title: "High-Performance Processing",
    description: "Experience native-level speed for complex tasks. Leveraging modern browser technologies like Web Workers and specialized libraries, we handle large PDFs, high-resolution images, and intricate text extractions with lightning efficiency."
  },
  {
    icon: Eye,
    title: "Zero Analytics or Tracking",
    description: "Your privacy is our specification, not just a feature. We do not use cookies, tracking pixels, or third-party analytics. We have no way of knowing who you are or what you are processing — exactly how it should be."
  },
  {
    icon: HardDrive,
    title: "Pure Local Memory",
    description: "No persistent storage, no hidden caches. All file data lives temporarily in your browser's RAM and is instantly purged the moment you close the tab or finish your task. Your disk remains clean, and your data remains yours."
  },
  {
    icon: Clock,
    title: "Instant Execution",
    description: "Eliminate the 'Upload-Wait-Download' cycle. Since processing happens on your own hardware, even multi-hundred page documents begin transforming the second you drop them. No queues, no server lag, just instant results."
  },
  {
    icon: Lock,
    title: "Transparent & Open Source",
    description: "Trust but verify. PDFNeo is fully open-source, allowing researchers and developers to audit our security claims. You can even fork the repository and host your own private instance for complete infrastructure control."
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="border-t bg-secondary/30 py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Built for privacy. Engineered for speed.</h2>
          <p className="mt-3 text-muted-foreground">PDFNeo is designed from the ground up to protect your data.</p>
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
