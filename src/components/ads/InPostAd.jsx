import React, { memo, useEffect } from 'react';

const InPostAd = () => {
    useEffect(() => {
        const loadGoogleAdsScript = () => {
            const existingScript = document.querySelector('script[src*="adsbygoogle"]');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2681103030876233";
                script.async = true;
                script.crossOrigin = "anonymous";
                document.body.appendChild(script);
            }
        };

        loadGoogleAdsScript();

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("Adsbygoogle push error:", err);
        }
    }, []);

    return (
        <div
            style={{
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto',
                textAlign: 'center',
            }}
        >
            <ins
                title="ads"
                className="adsbygoogle"
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                }}
                data-ad-client="ca-pub-2681103030876233"
                data-ad-slot="4055424990"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default memo(InPostAd);