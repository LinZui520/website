const Loading = () => (
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
    <svg
      className="w-16 h-16 fill-none stroke-2 stroke-mint-950 dark:stroke-mint-50 animate-spin"
      viewBox="0 0 32 32"
    >
      <circle cx="16" cy="16" r="12" strokeDasharray="56.5 18.9" strokeLinecap="round" />
    </svg>
  </div>
);

export default Loading;
