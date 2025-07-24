import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// --- Mouse Position Tracker with Render Props ---
const MouseTracker = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return render(position);
};

// --- Data Fetcher with Render Props ---
const DataFetcher = ({ url, render }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return render({ data, loading, error });
};

function RenderPropsExamples() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Render Props Pattern</h2>
      <p className="text-gray-700 dark:text-gray-300">
        The Render Props pattern is a technique for sharing code between React components using a prop whose value is a function.
        The component with the render prop calls the function to render its output, passing any necessary state to it.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mouse Position Tracker Example */}
        <Card>
          <CardHeader>
            <CardTitle>Mouse Position Tracker</CardTitle>
            <CardDescription>Sharing mouse coordinates with a render prop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MouseTracker
              render={(position) => (
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p>The mouse position is:</p>
                  <p className="font-mono text-lg">x: {position.x}, y: {position.y}</p>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Data Fetcher Example */}
        <Card>
          <CardHeader>
            <CardTitle>Data Fetcher</CardTitle>
            <CardDescription>Fetching data and rendering it with a render prop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataFetcher
              url="https://jsonplaceholder.typicode.com/posts/1"
              render={({ data, loading, error }) => {
                if (loading) return <p>Loading data...</p>;
                if (error) return <p>Error: {error.message}</p>;
                return (
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <h4 className="font-bold text-lg">{data.title}</h4>
                    <p>{data.body}</p>
                  </div>
                );
              }}
            />
          </CardContent>
        </Card>

        {/* Comparison with HOCs */}
        <Card>
          <CardHeader>
            <CardTitle>Render Props vs. HOCs</CardTitle>
            <CardDescription>Comparing two powerful patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Render Props</h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>Explicitly shows what is being shared (via props).</li>
              <li>Avoids prop name collisions.</li>
              <li>Can be more verbose than HOCs.</li>
            </ul>
            <h4 className="font-semibold">Higher-Order Components (HOCs)</h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>Less verbose, wraps components.</li>
              <li>Can lead to prop name collisions if not careful.</li>
              <li>Can create deeply nested component trees ("wrapper hell").</li>
            </ul>
            <p className="text-sm text-gray-500">
              Modern React often favors custom hooks for logic reuse, but both patterns are still valuable to understand.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RenderPropsExamples;


