import { motion } from "framer-motion";
import { ShieldCheck, ServerOff, EyeOff, Trash2 } from "lucide-react";

const items = [
  {
    icon: ServerOff,
    label: "No Cloud Servers",
    detail: "We've removed the middleman. By performing all computations locally, we eliminate the need for document servers, reducing the attack surface to zero."
  },
  {
    icon: EyeOff,
    label: "Strict Anti-Tracking",
    detail: "Most free tools monetize your data. We don't. We have no backend databases, no login requirements, and absolutely no data harvesting mechanisms."
  },
  {
    icon: Trash2,
    label: "Volatile Memory Only",
    detail: "Your data is only as persistent as your current session. We utilize secure browser memory that is automatically reclaimed by the OS once your work is done."
  },
  {
    icon: ShieldCheck,
    label: "Fully Auditable Code",
    detail: "Our commitment to security is backed by transparency. Our entire implementation is public, ensuring that our 'Privacy-First' promise is exactly what it says."
  },
];

const PrivacySection = () => {
  return (
    <section id="privacy" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">Your files. Your device. Your rules.</h2>
            <p className="mt-3 text-muted-foreground">
              PDFNeo was built with a simple principle: your documents should never leave your computer.
              Every operation runs entirely in your browser using Web Workers and WebAssembly.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
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
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
