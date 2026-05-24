export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  // Size variants
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div
      className={`rounded-full border-2 border-indigo-500 border-t-transparent animate-spin ${
        sizeClasses[size]
      }`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
