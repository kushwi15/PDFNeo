import SEO from "@/components/SEO";
import ToolLayout from "@/components/ToolLayout";
import { Lock, Cpu, EyeOff, Globe } from "lucide-react";

const Security = () => {
    return (
        <ToolLayout
            title="Security & Transparency"
            description="Detailed information on how PDFNeo keeps your documents safe."
            icon={Lock}
            hideTrustBadges={true}
        >
            <div className="prose prose-blue max-w-4xl mx-auto py-8 text-left">
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-12 flex items-center gap-6">
                    <div className="bg-green-600 p-4 rounded-full">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-green-900 mb-1">100% Client-Side Processing</h2>
                        <p className="text-green-800">Your files never leave your computer. We don't have servers that store your documents.</p>
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">How it Works</h2>
                    <div className="grid gap-6">
                        <div className="flex gap-4">
                            <Cpu className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold mb-2">WebAssembly (WASM)</h3>
                                <p>We use WebAssembly to run powerful PDF manipulation logic directly in your browser's memory. This is the same technology used in modern high-performance web apps.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <EyeOff className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold mb-2">Privacy by Design</h3>
                                <p>Because there is no "upload" step, there is no chance for a server-side breach or a developer to intercept your files. Your browser is the only environment where your data exists.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Globe className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold mb-2">Static Hosting</h3>
                                <p>PDFNeo is hosted on Vercel as a static application. The "hosting" only serves the code to your browser. Once the site is loaded, you could theoretically disconnect from the internet and many tools would still work.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Addressing "Red Flags"</h2>
                    <p className="mb-4">We are aware that small tools on the internet can be suspicious. Here is how we verify our safety:</p>
                    <ul className="space-y-4">
                        <li className="bg-secondary/20 p-4 rounded-lg">
                            <strong>No Tracking:</strong> We don't use invasive trackers or sell your behavior to advertisers.
                        </li>
                        <li className="bg-secondary/20 p-4 rounded-lg">
                            <strong>Open Code:</strong> Our source code is public. Anyone can audit it to ensure no data is being sent to external servers.
                        </li>
                        <li className="bg-secondary/20 p-4 rounded-lg">
                            <strong>No Account Required:</strong> We never ask for your email, password, or login. Your identity is your own.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Safe for Sensitive Data</h2>
                    <p>
                        Because of our architecture, PDFNeo is one of the safest places to process sensitive documents like bank statements, 
                        IDs, and legal contracts. Since nothing is uploaded, there is no digital trail on the internet.
                    </p>
                </section>
            </div>
            <SEO title="Security" description="Learn about the industry-leading security measures of PDFNeo. Total privacy through local browser processing." />
        </ToolLayout>
    );
};

export default Security;
