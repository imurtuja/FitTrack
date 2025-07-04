const Skeleton = ({ className = '', style = {} }) => (
  <div
    className={`relative overflow-hidden bg-[#23272F]/60 rounded-lg ${className}`}
    style={style}
  >
    <div className="absolute inset-0 animate-skeleton-shimmer bg-gradient-to-r from-transparent via-[#B0FFB0]/20 to-transparent" />
    <span className="invisible">&nbsp;</span>
  </div>
);

export default Skeleton; 