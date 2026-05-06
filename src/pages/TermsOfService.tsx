import SEO from "@/components/SEO";
import ToolLayout from "@/components/ToolLayout";
import { FileText } from "lucide-react";

const TermsOfService = () => {
    return (
        <ToolLayout
            title="Terms of Service"
            description="The rules and guidelines for using PDFNeo."
            icon={FileText}
        >
            <div className="prose prose-blue max-w-4xl mx-auto py-8 text-left">
                <p className="text-muted-foreground italic mb-8">Last updated: May 6, 2026</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using PDFNeo, you agree to be bound by these Terms of Service. 
                        If you do not agree, please do not use the application.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                    <p>
                        PDFNeo is a client-side tool for editing and manipulating PDF documents. 
                        The service is provided "as is" and "as available" without any warranties.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. Local Processing</h2>
                    <p>
                        You acknowledge that PDFNeo processes documents locally in your browser. 
                        While this enhances privacy, you are responsible for maintaining backups of your original documents. 
                        We are not liable for any data loss or document corruption.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">4. Prohibited Uses</h2>
                    <p>
                        You agree not to use PDFNeo for any illegal purposes or to infringe upon the intellectual property rights of others.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                    <p>
                        In no event shall PDFNeo or its developers be liable for any damages arising out of the use or inability to use the tools.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">6. Open Source</h2>
                    <p>
                        PDFNeo is open-source software licensed under the MIT License. You are free to inspect, modify, and distribute the code 
                        according to the license terms.
                    </p>
                </section>
            </div>
            <SEO title="Terms of Service" description="Read the Terms of Service for PDFNeo. Simple, transparent, and fair." />
        </ToolLayout>
    );
};

export default TermsOfService;
