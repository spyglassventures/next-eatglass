'use client';

import React, { useEffect, useRef } from 'react';

export default function SafeHtmlFrame({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Entfernt globale Styles aus dem HTML
  function stripGlobalStyles(input: string) {
    return input.replace(/<style[^>]*>[\s\S]*?(body|html|\*)[\s\S]*?<\/style>/gi, '');
  }

  // Macht alle Links klickbar mit target=_blank
  function withTargetBlank(input: string) {
    return input.replace(/<a\s/g, '<a target="_blank" rel="noopener noreferrer" ');
  }

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    const cleanedHtml = withTargetBlank(stripGlobalStyles(html));

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_blank">
          <style>
            body {
              margin: 0;
              font-family: sans-serif;
              font-size: 14px;
              padding: 10px;
              color: #1f2937;
              background: white;
            }
            a {
              color: #2563eb;
              text-decoration: underline;
              word-break: break-word;
            }
          </style>
        </head>
        <body>${cleanedHtml}</body>
      </html>
    `);
    doc.close();
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin allow-scripts"
      className="w-full border rounded h-60"
      style={{ background: 'white' }}
    />
  );
}
