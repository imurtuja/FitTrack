const Spinner = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[120px]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--kick-green)] border-opacity-70 bg-[#23272F]/40 shadow-xl" style={{ borderLeftColor: '#B0FFB0', borderRightColor: '#B0FFB0' }}></div>
  </div>
);
 
export default Spinner; 