import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';

const AnalyticsManager: React.FC = () => {
    const { saasAppConfig } = useData();
    const config = saasAppConfig; // Use SaaS config for global analytics

    useEffect(() => {
        if (!config) return;

        // 1. Google Analytics / GTM
        if (config.googleAnalyticsId) {
            const gaId = config.googleAnalyticsId;
            // Check if script already exists
            if (!document.getElementById('ga-script')) {
                const script = document.createElement('script');
                script.id = 'ga-script';
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
                document.head.appendChild(script);

                const inlineScript = document.createElement('script');
                inlineScript.id = 'ga-inline';
                inlineScript.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `;
                document.head.appendChild(inlineScript);
                console.log('Google Analytics Injected:', gaId);
            }
        }

        // 2. Meta Pixel
        if (config.metaPixelId) {
            const pixelId = config.metaPixelId;
            if (!document.getElementById('fb-pixel')) {
                const script = document.createElement('script');
                script.id = 'fb-pixel';
                script.innerHTML = `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${pixelId}');
                    fbq('track', 'PageView');
                `;
                document.head.appendChild(script);
                console.log('Meta Pixel Injected:', pixelId);
            }
        }

        // 3. SEO Meta Tags
        if (config.seoTitle) {
            document.title = config.seoTitle;
        }
        if (config.seoDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', config.seoDescription);
        }

    }, [config?.googleAnalyticsId, config?.metaPixelId, config?.seoTitle, config?.seoDescription]);

    return null; // Renderless component
};

export default AnalyticsManager;
