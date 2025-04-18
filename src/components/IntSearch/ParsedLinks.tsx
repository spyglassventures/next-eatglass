'use client';

import React from 'react';

type LinkInfo = {
  href: string;
  label: string;
};

// Funktion zum Dekodieren von HTML-Entities (wie &#39;)
function decodeHTMLEntities(str: string) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

export default function GoogleSuggestions({ html }: { html: string }) {
  const containerRegex = /<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi;

  const links: LinkInfo[] = [];
  let match;
  while ((match = containerRegex.exec(html)) !== null) {
    const href = match[1];
    const label = decodeHTMLEntities(match[2]);
    if (href.includes('grounding-api-redirect')) {
      links.push({ href, label });
    }
  }

  if (links.length === 0) return null;

  return (
    <div className="container">
      <div className="logo-container">
        <img
          src="/images/brands/google-search.png"
          alt="Google"
          width={18}
          height={18}
          className="logo"
        />
      </div>
      <div className="carousel">
        {links.map(({ href, label }, index) => (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="chip"
          >
            {label}
          </a>
        ))}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
          background-color: #fafafa !important;
          border-radius: 8px;
          font-family: 'Google Sans', Roboto, sans-serif;
          font-size: 14px;
          line-height: 20px;
          padding: 8px 12px;
          box-shadow: 0 0 0 1px #0000000f;
          position: relative;
          overflow: hidden;
        }
        .logo-container {
          margin-right: 12px;
          flex-shrink: 0;
        }
        .carousel {
          overflow-x: auto;
          scrollbar-width: none;
          white-space: nowrap;
        }
        .chip {
          display: inline-block;
          background-color: #fff;
          border: 1px solid #d2d2d2;
          border-radius: 16px;
          color: #5e5e5e;
          padding: 5px 16px;
          text-align: center;
          user-select: none;
          margin: 0 8px;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .chip:hover,
        .chip:focus {
          background-color: #e6e6e6;
        }
        .chip:active {
          background-color: #d8d8d8;
          border-color: #b6b6b6;
        }
      `}</style>
    </div>
  );
}
