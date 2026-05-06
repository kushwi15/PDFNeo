import SEO from "@/components/SEO";
import ToolLayout from "@/components/ToolLayout";
import { Info, Heart, Code, Shield } from "lucide-react";

const AboutUs = () => {
    return (
        <ToolLayout
            title="About PDFNeo"
            description="The story behind the modern, privacy-first PDF editor."
            icon={Info}
        >
            <div className="prose prose-blue max-w-4xl mx-auto py-8 text-left">
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                        PDFNeo was born out of a simple problem: Most online PDF tools require you to upload your sensitive 
                        documents to their servers. We believe that in the modern age, <strong>your data should stay your data.</strong>
                    </p>
                    <p className="text-lg leading-relaxed mt-4">
                        Our mission is to provide professional-grade PDF tools that are fast, free, and 100% private. 
                        By leveraging the power of modern browsers, we've built a suite that handles complex PDF operations 
                        without a single kilobyte ever leaving your device.
                    </p>
                </section>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl">
                        <Shield className="h-10 w-10 text-blue-600 mb-4" />
                        <h3 className="font-bold mb-2">Privacy First</h3>
                        <p className="text-sm text-muted-foreground">No uploads. No storage. Total control over your files.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-red-50 rounded-xl">
                        <Heart className="h-10 w-10 text-red-600 mb-4" />
                        <h3 className="font-bold mb-2">Free & Open</h3>
                        <p className="text-sm text-muted-foreground">MIT licensed and free for everyone, forever.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl">
                        <Code className="h-10 w-10 text-green-600 mb-4" />
                        <h3 className="font-bold mb-2">High Performance</h3>
                        <p className="text-sm text-muted-foreground">Optimized WebAssembly for desktop-like speed.</p>
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">The Developer</h2>
                    <p>
                        PDFNeo is developed and maintained by <strong>Kushwinth Kumar</strong>. As a developer passionate about 
                        privacy and web technology, I wanted to create a tool that I could trust with my own documents.
                    </p>
                    <p className="mt-4">
                        You can find more of my work on <a href="https://github.com/kushwi15" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Why PDFNeo?</h2>
                    <p>
                        Most "free" online tools profit from your data or lock features behind subscriptions. PDFNeo is different. 
                        It's a community-driven project aimed at making the web a safer place for document management. 
                        We don't want your files; we just want to give you the tools to manage them yourself.
                    </p>
                </section>
            </div>
            <SEO title="About Us" description="Learn about the mission of PDFNeo: bringing professional, private, and free PDF tools to everyone." />
        </ToolLayout>
    );
};

export default AboutUs;
