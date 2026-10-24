import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Consent from '@/components/Consent';
import './fonts.css';
import './globals.css';
import './consent.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://meshdentteljeshonlap.vercel.app'),
  title: { default: 'DOF Freedom Air | MeshDent', template: '%s · MeshDent' },
  icons: { icon: '/assets/logo.png' },
  formatDetection: { telephone: false, email: false, address: false },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#1aa37e' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="hu"><body><a href="#tartalom" className="skip-link">Ugrás a tartalomra</a>{children}<Consent /><Script src="/site-config.js" strategy="beforeInteractive" /><Script src="/app.js" strategy="afterInteractive" /></body></html>;
}
