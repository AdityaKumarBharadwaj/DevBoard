/**
 * LoadingSpinner Component
 * ============================================================================
 * Reusable animated circular loading spinner with configurable sizing
 * ('sm', 'md', 'lg') and fullscreen backdrop option.
 * ============================================================================
 */

/**
 * LoadingSpinner Component
 * 
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Visual size variant.
 * @param {boolean} [props.fullScreen=false] - When true, renders centered in a full-screen backdrop.
 * @returns {JSX.Element}
 */
export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  // Sizing utility classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div
      className={`rounded-full border-2 border-blue-500 border-t-transparent animate-spin ${
        sizeClasses[size]
      }`}
    />
  );

  // Render centered with full-viewport fixed overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // Render inline spinner
  return spinner;
}
