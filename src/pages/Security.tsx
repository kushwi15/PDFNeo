import SEO from "@/components/SEO";
import ToolLayout from "@/components/ToolLayout";
import { Lock, Cpu, EyeOff, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const Security = () => {
    const { t } = useTranslation();

    return (
        <ToolLayout
            title={t('security.title')}
            description={t('security.description')}
            icon={Lock}
            hideTrustBadges={true}
        >
            <div className="prose prose-blue max-w-4xl mx-auto py-8 text-left">
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-12 flex items-center gap-6">
                    <div className="bg-green-600 p-4 rounded-full">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-green-900 mb-1">{t('security.clientSideTitle')}</h2>
                        <p className="text-green-800">{t('security.clientSideText')}</p>
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">{t('security.howItWorks')}</h2>
                    <div className="grid gap-6">
                        <div className="flex gap-4">
                            <Cpu className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold mb-2">{t('security.wasmTitle')}</h3>
                                <p>{t('security.wasmText')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <EyeOff className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold mb-2">{t('security.designTitle')}</h3>
                                <p>{t('security.designText')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Globe className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold mb-2">{t('security.hostingTitle')}</h3>
                                <p>{t('security.hostingText')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">{t('security.redFlags')}</h2>
                    <p className="mb-4">{t('security.redFlagsSubtitle')}</p>
                    <ul className="space-y-4">
                        <li className="bg-secondary/20 p-4 rounded-lg">
                            {t('security.noTracking')}
                        </li>
                        <li className="bg-secondary/20 p-4 rounded-lg">
                            {t('security.openCode')}
                        </li>
                        <li className="bg-secondary/20 p-4 rounded-lg">
                            {t('security.noAccount')}
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{t('security.sensitiveTitle')}</h2>
                    <p>
                        {t('security.sensitiveText')}
                    </p>
                </section>
            </div>
            <SEO title="Security" description="Learn about the industry-leading security measures of PDFNeo. Total privacy through local browser processing." />
        </ToolLayout>
    );
};

export default Security;
