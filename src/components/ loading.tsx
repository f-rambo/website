export function Loading() {
  return (
    <div className="loading">
      <div className="loading-icon">
        <svg viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            stroke-width="10"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
