import { motion } from "framer-motion";
import { Shield, Cpu, Eye, HardDrive, Clock, Lock } from "lucide-react";

const features = [
  { icon: Shield, title: "100% Private", description: "Files never leave your device. All processing happens locally in your browser." },
  { icon: Cpu, title: "Browser-Powered", description: "Uses Web Workers and WebAssembly for fast, native-like PDF processing." },
  { icon: Eye, title: "No Tracking", description: "Zero analytics, cookies, or telemetry. We can't see your files — by design." },
  { icon: HardDrive, title: "No Storage", description: "Temporary memory only. Files are automatically cleared when you close the tab." },
  { icon: Clock, title: "Instant Results", description: "No upload wait times. Processing starts immediately on your machine." },
  { icon: Lock, title: "Open Source", description: "Fully transparent codebase. Audit, fork, and self-host with confidence." },
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
