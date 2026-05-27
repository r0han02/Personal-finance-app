export default function CornerMarkers({ color = '#D9D9D9' }) {
  const marker = (
    <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2H5V3H3V5H2V3H0V2H2V0H3V2Z" fill={color} />
    </svg>
  );

  return (
    <>
      <span className="corner-marker tl">{marker}</span>
      <span className="corner-marker tr">{marker}</span>
      <span className="corner-marker bl">{marker}</span>
      <span className="corner-marker br">{marker}</span>
    </>
  );
}
