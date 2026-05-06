import SEO from "@/components/SEO";
import ToolLayout from "@/components/ToolLayout";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <ToolLayout
            title="Privacy Policy"
            description="Your privacy is our top priority. Learn how we handle your data."
            icon={ShieldCheck}
        >
            <div className="prose prose-blue max-w-4xl mx-auto py-8 text-left">
                <p className="text-muted-foreground italic mb-8">Last updated: May 6, 2026</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                    <p>
                        Welcome to PDFNeo. We are committed to protecting your personal information and your right to privacy. 
                        Unlike traditional PDF tools, PDFNeo is a <strong>client-side application</strong>, meaning the majority 
                        of your data never leaves your device.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. The "No-Upload" Guarantee</h2>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                        <p className="text-blue-700 font-semibold">
                            Critical Security Information:
                        </p>
                        <p className="text-blue-600">
                            PDFNeo does not upload your PDF files to any server. All processing (merging, splitting, editing, etc.) 
                            is performed locally within your web browser using WebAssembly and modern JavaScript APIs.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. Data Collection</h2>
                    <p>
                        We do not collect any personal data or document content. Since your files are processed locally:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>We cannot see your documents.</li>
                        <li>We do not store your documents on our servers.</li>
                        <li>We do not share your documents with third parties.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">4. Analytics</h2>
                    <p>
                        We may use basic, anonymized analytics (like Vercel Analytics) to monitor site traffic and performance. 
                        This data includes things like page views and browser types but <strong>never</strong> includes information 
                        about the files you process.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">5. Third-Party Libraries</h2>
                    <p>
                        PDFNeo uses industry-standard libraries like <code>pdf-lib</code> and <code>pdf.js</code>. 
                        These libraries are bundled with the application and also run entirely within your browser.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, you can contact us through our GitHub repository.
                    </p>
                </section>
            </div>
            <SEO title="Privacy Policy" description="Read the PDFNeo Privacy Policy. We process all your PDF files locally in your browser for 100% privacy." />
        </ToolLayout>
    );
};

export default PrivacyPolicy;
