'use client';

import React, { useEffect, useRef } from 'react';

export default function SafeHtmlFrame({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_blank">
          <style>
            body { margin: 0; font-family: sans-serif; font-size: 14px; }
          </style>
        </head>
        <body>${html}</body>
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
