import React, { useState, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// --- Expensive Calculation Example with useMemo ---
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const ExpensiveCalculationComponent = ({ number }) => {
  const result = useMemo(() => {
    console.log(`Calculating Fibonacci for ${number}...`);
    return fibonacci(number);
  }, [number]); // Only re-calculate when 'number' changes

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>useMemo: Expensive Calculation</CardTitle>
        <CardDescription>Memoizes a computationally expensive function</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Fibonacci of {number} is: <span className="font-bold text-blue-600">{result}</span></p>
        <p className="text-sm text-gray-500">
          Open console to see when calculation re-runs.
        </p>
      </CardContent>
    </Card>
  );
};

// --- Callback Memoization with useCallback ---
const ButtonComponent = memo(({ onClick, children }) => {
  console.log(`Rendering ButtonComponent: ${children}`);
  return <Button onClick={onClick}>{children}</Button>;
});

const CallbackMemoizationExample = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // This function will be re-created on every render without useCallback
  const incrementCount = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // Dependency array is empty, so it's memoized once

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>useCallback: Preventing Unnecessary Re-renders</CardTitle>
        <CardDescription>Memoizes functions to optimize child components</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Count: <span className="font-bold text-blue-600">{count}</span></p>
        <ButtonComponent onClick={incrementCount}>Increment Count</ButtonComponent>
        <Input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Type something..."
        />
        <p className="text-sm text-gray-500">
          Open console. The button component will only re-render when its props change.
          Typing in the input will not cause the button to re-render because `incrementCount` is memoized.
        </p>
      </CardContent>
    </Card>
  );
};

// --- React.memo Example ---
const PureComponent = memo(({ name, version }) => {
  console.log(`Rendering PureComponent: ${name}`);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>React.memo: Pure Component</CardTitle>
        <CardDescription>Prevents re-renders if props are shallowly equal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Component Name: <span className="font-bold text-blue-600">{name}</span></p>
        <p>Version: <span className="font-bold text-blue-600">{version}</span></p>
        <p className="text-sm text-gray-500">
          This component will only re-render if its `name` or `version` props change.
        </p>
      </CardContent>
    </Card>
  );
});

const ParentComponentForMemo = () => {
  const [counter, setCounter] = useState(0);
  const [appName, setAppName] = useState("My App");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>React.memo Parent</CardTitle>
        <CardDescription>Demonstrates React.memo in action</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Parent Counter: <span className="font-bold text-blue-600">{counter}</span></p>
        <Button onClick={() => setCounter(counter + 1)}>Increment Parent Counter</Button>
        <Input
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="Change app name..."
        />
        <p className="text-sm text-gray-500">
          Open console. PureComponent will only re-render when its props change, not when parent state unrelated to its props changes.
        </p>
        <PureComponent name="React Intro" version="1.0" />
        <PureComponent name={appName} version="1.0" />
      </CardContent>
    </Card>
  );
};

// --- Performance Comparison Demo ---
const UnoptimizedComponent = ({ data }) => {
  console.log("Rendering UnoptimizedComponent");
  // Simulate expensive operation
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unoptimized Component</CardTitle>
        <CardDescription>Re-renders on every parent state change</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Data: {data}</p>
        <p className="text-sm text-gray-500">This component re-renders even if its props don't change, due to parent re-renders and no memoization.</p>
      </CardContent>
    </Card>
  );
};

const OptimizedComponent = memo(({ data }) => {
  console.log("Rendering OptimizedComponent");
  // Simulate expensive operation
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Optimized Component (React.memo)</CardTitle>
        <CardDescription>Only re-renders if props change</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Data: {data}</p>
        <p className="text-sm text-gray-500">This component uses <code>React.memo</code> and only re-renders when its <code>data</code> prop changes.</p>
      </CardContent>
    </Card>
  );
});

const PerformanceComparisonDemo = () => {
  const [parentCount, setParentCount] = useState(0);
  const [optimizedData, setOptimizedData] = useState("Initial Data");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Comparison Demo</CardTitle>
        <CardDescription>Observe re-renders in console</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Parent Count: <span className="font-bold text-blue-600">{parentCount}</span></p>
        <Button onClick={() => setParentCount(parentCount + 1)}>Increment Parent Count</Button>
        <Input
          type="text"
          value={optimizedData}
          onChange={(e) => setOptimizedData(e.target.value)}
          placeholder="Change optimized data..."
        />
        <p className="text-sm text-gray-500">
          Open console to see re-render logs. Incrementing parent count will re-render UnoptimizedComponent but not OptimizedComponent (unless its data changes).
        </p>
        <UnoptimizedComponent data="Static Data" />
        <OptimizedComponent data={optimizedData} />
      </CardContent>
    </Card>
  );
};


function PerformanceExamples() {
  const [fibNum, setFibNum] = useState(35);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Optimization Hooks</h2>
      <p className="text-gray-700 dark:text-gray-300">
        React provides hooks like <code>useMemo</code>, <code>useCallback</code>, and the HOC <code>React.memo</code> to optimize component rendering performance by preventing unnecessary re-calculations and re-renders.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <ExpensiveCalculationComponent number={fibNum} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Control Fibonacci Input</CardTitle>
            <CardDescription>Adjust the number for calculation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="fibInput">Fibonacci Number:</Label>
            <Input
              id="fibInput"
              type="number"
              value={fibNum}
              onChange={(e) => setFibNum(Number(e.target.value))}
              min="1"
              max="40"
            />
            <p className="text-sm text-gray-500">
              Changing this input will trigger a re-calculation in the component above.
            </p>
          </CardContent>
        </Card>

        <CallbackMemoizationExample />
        <ParentComponentForMemo />
        <PerformanceComparisonDemo />
      </div>
    </div>
  );
}

export default PerformanceExamples;


