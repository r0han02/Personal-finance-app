import CornerMarkers from './CornerMarkers';

export default function FinancialTicker() {
  return (
    <div className="fin-ticker" aria-hidden="true">
      {/* BTC */}
      <div className="fin-card">
        <div className="fin-card-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 6.5C10.8 5.3 10 4.8 8.8 4.5L9.1 3.2L8.3 3L8 4.3C7.8 4.25 7.6 4.2 7.4 4.15L7.7 2.85L6.9 2.65L6.6 3.95C6.4 3.9 6.2 3.86 6.05 3.82L4.9 3.55L4.7 4.4C4.7 4.4 5.3 4.55 5.3 4.56C5.6 4.63 5.65 4.85 5.64 5.02L5.3 6.4C5.33 6.41 5.37 6.42 5.41 6.44L5.3 6.41L4.8 8.5C4.77 8.58 4.68 8.7 4.5 8.66C4.5 8.67 3.92 8.52 3.92 8.52L3.5 9.45L4.6 9.72L5.1 9.85L4.8 11.18L5.6 11.38L5.9 10.05C6.1 10.1 6.3 10.15 6.5 10.2L6.2 11.5L7 11.7L7.3 10.37C8.7 10.65 9.7 10.55 10.1 9.3C10.4 8.3 10 7.7 9.3 7.35C9.8 7.23 10.2 6.87 10.5 6.5ZM8.6 8.85C8.35 9.85 6.7 9.3 6.2 9.17L6.6 7.4C7.1 7.53 8.85 7.8 8.6 8.85ZM8.85 6.48C8.62 7.38 7.2 6.9 6.8 6.79L7.15 5.2C7.55 5.31 9.09 5.53 8.85 6.48Z" fill="white"/>
          </svg>
        </div>
        <div className="fin-card-text">
          <span className="fin-title">BTC</span>
          <span className="fin-price-row">
            <span className="fin-price">108,421</span>
            <span className="fin-change up">
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
                <path d="M5 6H1L3 3L5 6Z" fill="#65A049"/>
              </svg>
              2.14%
            </span>
          </span>
        </div>
      </div>

      <div className="fin-divider" />

      {/* S&P 500 */}
      <div className="fin-card">
        <div className="fin-card-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12L5 8L8 10L14 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 4H14V8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="fin-card-text">
          <span className="fin-title">S&P500</span>
          <span className="fin-price-row">
            <span className="fin-price">5,892</span>
            <span className="fin-change down">
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
                <path d="M5 3H1L3 6L5 3Z" fill="#A0494B"/>
              </svg>
              0.33%
            </span>
          </span>
        </div>
      </div>

      <div className="fin-divider" />

      {/* NASDAQ */}
      <div className="fin-card">
        <div className="fin-card-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="8" width="3" height="6" rx=".5" fill="white" opacity=".4"/>
            <rect x="5" y="5" width="3" height="9" rx=".5" fill="white" opacity=".6"/>
            <rect x="9" y="3" width="3" height="11" rx=".5" fill="white" opacity=".8"/>
            <rect x="13" y="1" width="2" height="13" rx=".5" fill="white"/>
          </svg>
        </div>
        <div className="fin-card-text">
          <span className="fin-title">NASDAQ</span>
          <span className="fin-price-row">
            <span className="fin-price">19,017</span>
            <span className="fin-change up">
              <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
                <path d="M5 6H1L3 3L5 6Z" fill="#65A049"/>
              </svg>
              1.07%
            </span>
          </span>
        </div>
      </div>

      <CornerMarkers color="rgba(217,217,217,.3)" />
    </div>
  );
}
