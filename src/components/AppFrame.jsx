import React from 'react';

export default function AppFrame({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ezpp!stats</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
