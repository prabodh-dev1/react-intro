import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LazyLoadedComponent = () => {
  useEffect(() => {
    console.log("LazyLoadedComponent mounted");
    return () => console.log("LazyLoadedComponent unmounted");
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lazy Loaded Component</CardTitle>
        <CardDescription>This component was loaded on demand!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300">
          This content is part of a component that was loaded asynchronously using <code>React.lazy</code> and <code>Suspense</code>.
          Check your network tab to see the chunk loading!
        </p>
      </CardContent>
    </Card>
  );
};

export default LazyLoadedComponent;


