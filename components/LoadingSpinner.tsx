function LoadingSpinner() {
    return (
      <div role="status" className="flex items-center justify-center">
        <svg
          aria-hidden="true"
          className="w-6 h-6 text-gray-300 animate-spin dark:text-gray-600 fill-white"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 50C50 77.6142 22.3858 100 0 100C22.3858 100 0 77.6142 0 50C0 27.0234 50 0 50 0Z"
            fill="currentColor"
          />
          <path
            d="M50 50C50 77.6142 22.3858 100 0 100C22.3858 100 0 77.6142 0 50C0 27.0234 50 0 50 0Z"
            fill="currentColor"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  export default LoadingSpinner;
