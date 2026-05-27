import FloatingNavbar from './FloatingNavbar';
import FloatingCryptoCoins from './FloatingCryptoCoins';

export default function AppShell({ children }) {
  return (
    <div className="app-shell top-nav" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background layers */}
      <div className="mat-hero-bg" style={{ opacity: 0.8 }}>
        <div className="mat-hero-gradient" />
        <div className="mat-edge-blur-top" />
        <div className="mat-edge-blur-bottom" />
      </div>

      <FloatingCryptoCoins />

      <div className="app-main" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <FloatingNavbar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
}
