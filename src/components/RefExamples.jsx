import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function RefExamples() {
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const previousValueRef = useRef('');
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));

  useEffect(() => {
    // Store previous value of inputValue
    previousValueRef.current = inputValue;
  }, [inputValue]);

  const handleFocusInput = () => {
    inputRef.current.focus();
  };

  const handleScrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  const handleAddItem = () => {
    setItems([...items, `New Item ${items.length + 1}`]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">useRef Hook Examples</h2>
      <p className="text-gray-700 dark:text-gray-300">
        The <code>useRef</code> hook returns a mutable ref object whose <code>.current</code> property is initialized to the passed argument (<code>initialValue</code>).
        The returned ref object will persist for the full lifetime of the component.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Focus Management Example */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Management</CardTitle>
            <CardDescription>Focus an input field programmatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="focusInput">Click button to focus:</Label>
            <Input ref={inputRef} id="focusInput" type="text" placeholder="I will be focused" />
            <Button onClick={handleFocusInput}>Focus Input</Button>
            <p className="text-sm text-gray-500">
              Useful for accessibility or guiding user input.
            </p>
          </CardContent>
        </Card>

        {/* Scroll to Element Example */}
        <Card>
          <CardHeader>
            <CardTitle>Scroll to Element</CardTitle>
            <CardDescription>Scroll to the bottom of a container</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div ref={scrollContainerRef} className="h-48 overflow-y-auto border rounded-md p-2 space-y-1 bg-gray-50 dark:bg-gray-800">
              {items.map((item, index) => (
                <p key={index} className="text-sm">{item}</p>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleScrollToBottom}>Scroll to Bottom</Button>
              <Button onClick={handleAddItem} variant="outline">Add Item</Button>
            </div>
            <p className="text-sm text-gray-500">
              Useful for chat applications, logs, or long lists.
            </p>
          </CardContent>
        </Card>

        {/* Previous Value Tracking Example */}
        <Card>
          <CardHeader>
            <CardTitle>Previous Value Tracking</CardTitle>
            <CardDescription>Keep track of a state's previous value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="valueInput">Enter something:</Label>
            <Input
              id="valueInput"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
            />
            <p className="text-sm">
              Current Value: <span className="font-semibold">{inputValue}</span>
            </p>
            <p className="text-sm">
              Previous Value: <span className="font-semibold">{previousValueRef.current}</span>
            </p>
            <p className="text-sm text-gray-500">
              The previous value updates after the current value changes.
            </p>
          </CardContent>
        </Card>

        {/* DOM Manipulation Example (Conceptual) */}
        <Card>
          <CardHeader>
            <CardTitle>DOM Manipulation (Conceptual)</CardTitle>
            <CardDescription>Directly interacting with DOM elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              While React encourages declarative programming, <code>useRef</code> can be used for imperative DOM manipulations when necessary (e.g., integrating with third-party libraries).
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`const myDivRef = useRef(null);

useEffect(() => {
  if (myDivRef.current) {
    myDivRef.current.style.backgroundColor = 'lightblue';
  }
}, []);

return <div ref={myDivRef}>Hello</div>;`}
            </pre>
            <p className="text-sm text-gray-500">
              Always prefer React's declarative approach (state and props) over direct DOM manipulation unless absolutely necessary.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RefExamples;


