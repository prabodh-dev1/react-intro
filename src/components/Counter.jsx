import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';

// Component 2: Counter with State Hook
export function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>State Hook Example</CardTitle>
        <CardDescription>Demonstrates useState hook with counter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{count}</div>
          <p className="text-sm text-gray-600">Current Count</p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => setCount(count - step)} variant="outline">
            - {step}
          </Button>
          <Button onClick={() => setCount(count + step)}>
            + {step}
          </Button>
        </div>
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={() => setStep(1)} 
            variant={step === 1 ? "default" : "outline"}
            size="sm"
          >
            Step: 1
          </Button>
          <Button 
            onClick={() => setStep(5)} 
            variant={step === 5 ? "default" : "outline"}
            size="sm"
          >
            Step: 5
          </Button>
          <Button 
            onClick={() => setStep(10)} 
            variant={step === 10 ? "default" : "outline"}
            size="sm"
          >
            Step: 10
          </Button>
        </div>
        <Button onClick={() => setCount(0)} variant="destructive" className="w-full">
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}


