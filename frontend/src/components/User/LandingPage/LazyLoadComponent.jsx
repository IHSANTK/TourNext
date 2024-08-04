import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';

// This function dynamically imports the component
const loadComponent = (importFunc) => {
  const Component = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

const LazyLoadComponent = ({ importFunc, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } 
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const Component = loadComponent(importFunc);

  return (
    <div ref={ref}>
      {isVisible && <Component {...props} />}
    </div>
  );
};

export default LazyLoadComponent;
