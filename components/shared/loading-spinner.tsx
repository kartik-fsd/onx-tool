export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-primary ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
