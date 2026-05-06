import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          nav: { home: 'Home', about: 'About', security: 'Security', tools: 'Tools' },
          hero: {
            title: 'Every PDF tool you need.',
            titleGradient: '100% in your browser.',
            subtitle: 'Your data is a right, not a resource. PDFNeo is a free PDF toolkit where your files never leave your device. No uploads. No tracking. 100% Private.',
            securityLink: 'Know how we keep your files safe →',
            explore: 'Explore Tools',
            github: 'View on GitHub',
            badges: { privacy: 'Privacy-first', noUploads: 'No file uploads', openSource: 'Open source' }
          },
          toolsGrid: {
            title: 'All the PDF tools you need',
            subtitle: 'Every tool runs locally in your browser. Nothing is ever uploaded.',
            categories: {
              conversion: 'Conversion',
              editing: 'Editing & Organization',
              security: 'Security'
            }
          },
          privacy: {
            title: 'Your files. Your device. Your rules.',
            subtitle: 'PDFNeo was built with a simple principle: your documents should never leave your computer.',
            cardTitle: 'Zero-Risk Document Handling',
            cardText: 'Processing sensitive documents like bank statements or IDs? PDFNeo is the safest option because it works entirely offline in your browser memory.',
            verdict: 'Privacy Verdict: Zero Risk',
            items: {
              noServers: { title: 'No Cloud Servers', detail: 'We eliminate the need for document servers, reducing the attack surface to zero.' },
              noTracking: { title: 'Strict Anti-Tracking', detail: 'We have no backend databases, no login requirements, and absolutely no data harvesting.' },
              volatile: { title: 'Volatile Memory Only', detail: 'Your data is only as persistent as your current session. Memory is reclaimed once you finish.' },
              auditable: { title: 'Fully Auditable Code', detail: 'Our entire implementation is public, ensuring our promise is exactly what it says.' }
            }
          },
          footer: {
            copyright: '© {{year}} PDFNeo. Open source under MIT License.',
            privacy: 'Privacy',
            terms: 'Terms',
            contact: 'Contact',
            github: 'GitHub'
          },
          about: {
            description: 'The story behind the modern, privacy-first PDF editor.',
            missionTitle: 'Our Mission',
            missionText: 'PDFNeo was born out of a simple problem: Most online PDF tools require you to upload your sensitive documents to their servers. We believe in a simple, non-negotiable truth: Your data is a right, not a resource, and it should stay exactly where it belongs: in your hands.',
            missionSubtext: 'Our mission is to provide professional-grade PDF tools that are fast, free, and 100% private.',
            privacyTitle: 'Privacy First',
            privacyText: 'No uploads. No storage. Total control over your files.',
            securityTitle: 'Secure by Nature',
            securityText: '100% local processing using modern WebAssembly technology.',
            devTitle: 'The Developer',
            devText: 'PDFNeo is developed and maintained by Kushwinth Kumar. As a developer passionate about privacy and web technology, I wanted to create a tool that users can trust with their most sensitive documents.',
            connect: 'Connect with the Developer'
          },
          security: {
            title: 'Security & Transparency',
            description: 'Detailed information on how PDFNeo keeps your documents safe.',
            clientSideTitle: '100% Client-Side Processing',
            clientSideText: 'Your files never leave your computer. We don\'t have servers that store your documents.',
            howItWorks: 'How it Works',
            wasmTitle: 'WebAssembly (WASM)',
            wasmText: 'We use WebAssembly to run powerful PDF manipulation logic directly in your browser\'s memory.',
            designTitle: 'Privacy by Design',
            designText: 'Because there is no "upload" step, there is no chance for a server-side breach or a developer to intercept your files.',
            hostingTitle: 'Static Hosting',
            hostingText: 'PDFNeo is hosted as a static application. Once loaded, you could theoretically disconnect from the internet and it would still work.',
            redFlags: 'Addressing "Red Flags"',
            redFlagsSubtitle: 'We are aware that small tools can be suspicious. Here is how we verify our safety:',
            noTracking: 'No Tracking: We don\'t use invasive trackers or sell your behavior to advertisers.',
            openCode: 'Open Code: Our source code is public. Anyone can audit it to ensure safety.',
            noAccount: 'No Account Required: We never ask for your email or login. Your identity is your own.',
            sensitiveTitle: 'Safe for Sensitive Data',
            sensitiveText: 'PDFNeo is one of the safest places to process sensitive documents like bank statements and legal contracts.'
          }
        }
      },
      hi: {
        translation: {
          nav: { home: 'होम', about: 'हमारे बारे में', security: 'सुरक्षा', tools: 'टूल्स' },
          hero: {
            title: 'हर वो PDF टूल जिसकी आपको ज़रूरत है।',
            titleGradient: '100% आपके ब्राउज़र में।',
            subtitle: 'आपका डेटा एक अधिकार है, संसाधन नहीं। PDFNeo एक मुफ्त PDF टूलकिट है जहाँ आपकी फाइलें आपके डिवाइस से कभी बाहर नहीं जातीं। कोई अपलोड नहीं। कोई ट्रैकिंग नहीं। 100% निजी।',
            securityLink: 'जानें कि हम आपकी फ़ाइलों को कैसे सुरक्षित रखते हैं →',
            explore: 'टूल्स देखें',
            github: 'गिटहब पर देखें',
            badges: { privacy: 'गोपनीयता पहले', noUploads: 'कोई फ़ाइल अपलोड नहीं', openSource: 'ओपन सोर्स' }
          },
          toolsGrid: {
            title: 'सभी PDF टूल्स जिनकी आपको आवश्यकता है',
            subtitle: 'प्रत्येक टूल आपके ब्राउज़र में स्थानीय रूप से चलता है। कुछ भी कभी अपलोड नहीं किया जाता है।',
            categories: { conversion: 'रूपांतरण', editing: 'संपादन और संगठन', security: 'सुरक्षा' }
          },
          privacy: {
            title: 'आपकी फ़ाइलें। आपका डिवाइस। आपके नियम।',
            subtitle: 'PDFNeo एक सरल सिद्धांत के साथ बनाया गया था: आपके दस्तावेज़ कभी भी आपके कंप्यूटर से बाहर नहीं जाने चाहिए।',
            cardTitle: 'शून्य-जोखिम दस्तावेज़ प्रबंधन',
            cardText: 'बैंक स्टेटमेंट या आईडी जैसे संवेदनशील दस्तावेजों को प्रोसेस कर रहे हैं? PDFNeo सबसे सुरक्षित विकल्प है क्योंकि यह पूरी तरह से आपकी ब्राउज़र मेमोरी में ऑफ़लाइन काम करता है।',
            verdict: 'गोपनीयता निर्णय: शून्य जोखिम',
            items: {
              noServers: { title: 'कोई क्लाउड सर्वर नहीं', detail: 'हम दस्तावेज़ सर्वर की आवश्यकता को समाप्त करते हैं, जिससे हमले की सतह शून्य हो जाती है।' },
              noTracking: { title: 'सख्त एंटी-ट्रैकिंग', detail: 'हमारे पास कोई बैकएंड डेटाबेस नहीं है, कोई लॉगिन आवश्यकता नहीं है, और बिल्कुल कोई डेटा कटाई नहीं है।' },
              volatile: { title: 'केवल अस्थिर मेमोरी', detail: 'आपका डेटा केवल आपके वर्तमान सत्र के दौरान ही रहता है। काम पूरा होने पर मेमोरी वापस ले ली जाती है।' },
              auditable: { title: 'पूरी तरह से ऑडिट योग्य कोड', detail: 'हमारा पूरा कार्यान्वयन सार्वजनिक है, यह सुनिश्चित करते हुए कि हमारा वादा वही है जो वह कहता है।' }
            }
          },
          footer: {
            copyright: '© {{year}} PDFNeo. MIT लाइसेंस के तहत ओपन सोर्स।',
            privacy: 'गोपनीयता',
            terms: 'शर्तें',
            contact: 'संपर्क',
            github: 'गिटहब'
          },
          about: {
            description: 'आधुनिक, गोपनीयता-प्रथम PDF संपादक के पीछे की कहानी।',
            missionTitle: 'हमारा मिशन',
            missionText: 'PDFNeo का जन्म एक सरल समस्या से हुआ था: अधिकांश ऑनलाइन PDF टूल्स के लिए आपको अपने संवेदनशील दस्तावेज़ों को उनके सर्वर पर अपलोड करना पड़ता है। हम एक सरल, गैर-परक्राम्य सत्य में विश्वास करते हैं: आपका डेटा एक अधिकार है, संसाधन नहीं, और इसे वहीं रहना चाहिए जहाँ यह है: आपके हाथों में।',
            missionSubtext: 'हमारा मिशन पेशेवर-ग्रेड PDF टूल प्रदान करना है जो तेज़, मुफ़्त और 100% निजी हों।',
            privacyTitle: 'गोपनीयता पहले',
            privacyText: 'कोई अपलोड नहीं। कोई स्टोरेज नहीं। अपनी फाइलों पर पूर्ण नियंत्रण।',
            securityTitle: 'स्वभाव से सुरक्षित',
            securityText: 'आधुनिक WebAssembly तकनीक का उपयोग करके 100% स्थानीय प्रोसेसिंग।',
            devTitle: 'डेवलपर',
            devText: 'PDFNeo का विकास और रखरखाव कुशविंथ कुमार द्वारा किया जाता है। गोपनीयता और वेब तकनीक के प्रति जुनूनी डेवलपर के रूप में, मैं एक ऐसा टूल बनाना चाहता था जिस पर उपयोगकर्ता अपने सबसे संवेदनशील दस्तावेज़ों के साथ भरोसा कर सकें।',
            connect: 'डेवलपर से जुड़ें'
          },
          security: {
            title: 'सुरक्षा और पारदर्शिता',
            description: 'PDFNeo आपकी फ़ाइलों को कैसे सुरक्षित रखता है, इसके बारे में विस्तृत जानकारी।',
            clientSideTitle: '100% क्लाइंट-साइड प्रोसेसिंग',
            clientSideText: 'आपकी फाइलें आपके कंप्यूटर से कभी बाहर नहीं जाती हैं। हमारे पास सर्वर नहीं हैं जो आपके दस्तावेज़ों को संग्रहीत करते हैं।',
            howItWorks: 'यह कैसे काम करता है',
            wasmTitle: 'WebAssembly (WASM)',
            wasmText: 'हम सीधे आपके ब्राउज़र की मेमोरी में शक्तिशाली PDF हेरफेर लॉजिक चलाने के लिए WebAssembly का उपयोग करते हैं।',
            designTitle: 'डिजाइन द्वारा गोपनीयता',
            designText: 'चूंकि कोई "अपलोड" कदम नहीं है, इसलिए सर्वर-साइड उल्लंघन या डेवलपर द्वारा आपकी फ़ाइलों को इंटरसेप्ट करने की कोई संभावना नहीं है।',
            hostingTitle: 'स्टैटिक होस्टिंग',
            hostingText: 'PDFNeo को एक स्टैटिक एप्लिकेशन के रूप में होस्ट किया गया है। एक बार लोड होने के बाद, आप सैद्धांतिक रूप से इंटरनेट से डिस्कनेक्ट कर सकते हैं और यह अभी भी काम करेगा।',
            redFlags: '"रेड फ्लैग्स" को संबोधित करना',
            redFlagsSubtitle: 'हम जानते हैं कि छोटे टूल्स संदिग्ध हो सकते हैं। यहां बताया गया है कि हम अपनी सुरक्षा को कैसे सत्यापित करते हैं:',
            noTracking: 'कोई ट्रैकिंग नहीं: हम आक्रामक ट्रैकर्स का उपयोग नहीं करते हैं या आपके व्यवहार को विज्ञापनदाताओं को नहीं बेचते हैं।',
            openCode: 'ओपन कोड: हमारा सोर्स कोड सार्वजनिक है। कोई भी सुरक्षा सुनिश्चित करने के लिए इसका ऑडिट कर सकता है।',
            noAccount: 'किसी खाते की आवश्यकता नहीं: हम कभी भी आपके ईमेल या लॉगिन के लिए नहीं पूछते हैं। आपकी पहचान आपकी अपनी है।',
            sensitiveTitle: 'संवेदनशील डेटा के लिए सुरक्षित',
            sensitiveText: 'बैंक स्टेटमेंट और कानूनी अनुबंध जैसे संवेदनशील दस्तावेजों को प्रोसेस करने के लिए PDFNeo सबसे सुरक्षित स्थानों में से एक है।'
          }
        }
      },
      es: {
        translation: {
          nav: { home: 'Inicio', about: 'Acerca de', security: 'Seguridad', tools: 'Herramientas' },
          hero: {
            title: 'Todas las herramientas PDF que necesitas.',
            titleGradient: '100% en tu navegador.',
            subtitle: 'Tus datos son un derecho, no un recurso. PDFNeo es un kit de herramientas PDF gratuito donde tus archivos nunca salen de tu dispositivo. Sin subidas. Sin rastreo. 100% privado.',
            securityLink: 'Saber cómo mantenemos sus archivos seguros →',
            explore: 'Explorar herramientas',
            github: 'Ver en GitHub',
            badges: { privacy: 'Privacidad primero', noUploads: 'Sin subidas de archivos', openSource: 'Código abierto' }
          },
          toolsGrid: {
            title: 'Todas las herramientas PDF que necesitas',
            subtitle: 'Cada herramienta se ejecuta localmente en su navegador. Nada se sube jamás.',
            categories: { conversion: 'Conversión', editing: 'Edición y Organización', security: 'Seguridad' }
          },
          privacy: {
            title: 'Tus archivos. Tu dispositivo. Tus reglas.',
            subtitle: 'PDFNeo se construyó con un principio simple: sus documentos nunca deben salir de su computadora.',
            cardTitle: 'Manejo de documentos sin riesgo',
            cardText: '¿Procesas documentos sensibles como extractos bancarios o identificaciones? PDFNeo es la opción más segura porque funciona completamente fuera de línea en la memoria de tu navegador.',
            verdict: 'Veredicto de Privacidad: Riesgo Cero',
            items: {
              noServers: { title: 'Sin servidores en la nube', detail: 'Eliminamos la necesidad de servidores de documentos, reduciendo la superficie de ataque a cero.' },
              noTracking: { title: 'Anti-rastreo estricto', detail: 'No tenemos bases de datos backend, ni requisitos de inicio de sesión, y absolutamente nada de recolección de datos.' },
              volatile: { title: 'Solo memoria volátil', detail: 'Tus datos solo son persistentes mientras dure tu sesión actual. La memoria se reclama una vez que terminas.' },
              auditable: { title: 'Código totalmente auditable', detail: 'Toda nuestra implementación es pública, asegurando que nuestra promesa sea exactamente lo que dice.' }
            }
          },
          footer: {
            copyright: '© {{year}} PDFNeo. Código abierto bajo licencia MIT.',
            privacy: 'Privacidad',
            terms: 'Términos',
            contact: 'Contacto',
            github: 'GitHub'
          }
        }
      },
      fr: {
        translation: {
          nav: { home: 'Accueil', about: 'À propos', security: 'Sécurité', tools: 'Outils' },
          hero: {
            title: 'Tous les outils PDF dont vous avez besoin.',
            titleGradient: '100% dans votre navigateur.',
            subtitle: 'Vos données sont un droit, pas une ressource. PDFNeo est une boîte à outils PDF gratuite où vos fichiers ne quittent jamais votre appareil. Pas de téléchargement. Pas de suivi. 100% privé.',
            securityLink: 'Savoir comment nous protégeons vos fichiers →',
            explore: 'Explorer les outils',
            github: 'Voir sur GitHub',
            badges: { privacy: 'Confidentialité d\'abord', noUploads: 'Aucun téléchargement de fichier', openSource: 'Open source' }
          },
          toolsGrid: {
            title: 'Tous les outils PDF dont vous avez besoin',
            subtitle: 'Chaque outil s\'exécute localement dans votre navigateur. Rien n\'est jamais téléchargé.',
            categories: { conversion: 'Conversion', editing: 'Édition et Organisation', security: 'Sécurité' }
          },
          privacy: {
            title: 'Vos fichiers. Votre appareil. Vos règles.',
            subtitle: 'PDFNeo a été construit sur un principe simple : vos documents ne devraient jamais quitter votre ordinateur.',
            cardTitle: 'Gestion des documents sans risque',
            cardText: 'Vous traitez des documents sensibles comme des relevés bancaires ou des identités ? PDFNeo est l\'option la plus sûre car elle fonctionne entièrement hors ligne dans la mémoire de votre navigateur.',
            verdict: 'Verdict de confidentialité : Risque zéro',
            items: {
              noServers: { title: 'Pas de serveurs cloud', detail: 'Nous éliminons le besoin de serveurs de documents, réduisant la surface d\'attaque à zéro.' },
              noTracking: { title: 'Anti-traçage strict', detail: 'Nous n\'avons pas de bases de données backend, pas d\'exigences de connexion, et absolument aucune collecte de données.' },
              volatile: { title: 'Mémoire volatile uniquement', detail: 'Vos données ne sont persistantes que pendant la durée de votre session actuelle. La mémoire est récupérée une fois terminé.' },
              auditable: { title: 'Code entièrement auditable', detail: 'Toute notre implémentation est publique, garantissant que notre promesse est exactement ce qu\'elle dit.' }
            }
          },
          footer: {
            copyright: '© {{year}} PDFNeo. Open source sous licence MIT.',
            privacy: 'Confidentialité',
            terms: 'Conditions',
            contact: 'Contact',
            github: 'GitHub'
          }
        }
      }
    }
  });

export default i18n;
