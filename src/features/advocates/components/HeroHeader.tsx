"use client";

export function HeroHeader() {
  return (
    <div className="hero-section">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        <div className="text-center">
          <div className="text-gold text-sm font-medium tracking-wide uppercase mb-3">
            Find Your Healthcare Advocate
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold mb-4 leading-tight">
            Don&apos;t navigate your health alone.
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Find an advocate who will help untangle your healthcare by phone or video—no matter what you need—covered by Medicare.
          </p>
          <div className="flex justify-center">
            <button 
              className="btn-hero-primary"
              onClick={() => {
                const tableSection = document.querySelector('[data-section="advocates-table"]');
                tableSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Find an Advocate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
