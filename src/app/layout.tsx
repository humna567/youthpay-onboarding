import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouthPay — Smart money starts young',
  description: "Pakistan's first financial platform designed for teenagers",
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <div className="phone-frame">{children}</div>
        </div>
      </body>
    </html>
  );
}
