import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useApi from '@/hooks/useApi';
import useLocalStorage from '@/hooks/useLocalStorage';
import useToggle from '@/hooks/useToggle';

export function ApiExample() {
  const { data, loading, error } = useApi('https://jsonplaceholder.typicode.com/todos/1');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>useApi Demo</CardTitle>
        <CardDescription>Fetches data from JSONPlaceholder</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && (
          <div className="space-y-2">
            <p><strong>User ID:</strong> {data.userId}</p>
            <p><strong>ID:</strong> {data.id}</p>
            <p><strong>Title:</strong> {data.title}</p>
            <p><strong>Completed:</strong> {data.completed ? 'Yes' : 'No'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LocalStorageExample() {
  const [name, setName] = useLocalStorage('username', 'Guest');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>useLocalStorage Demo</CardTitle>
        <CardDescription>Persists input value in local storage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="flex-1 px-3 py-2 border rounded-md w-full"
        />
        <p>Hello, {name}!</p>
        <Button onClick={() => setName('Guest')}>Reset Name</Button>
      </CardContent>
    </Card>
  );
}

export function ToggleExample() {
  const [isOn, toggle, setTrue, setFalse] = useToggle(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>useToggle Demo</CardTitle>
        <CardDescription>Toggles a boolean state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Current state: {isOn ? 'ON' : 'OFF'}</p>
        <div className="flex gap-2">
          <Button onClick={toggle}>Toggle</Button>
          <Button onClick={setTrue} variant="outline">Set ON</Button>
          <Button onClick={setFalse} variant="outline">Set OFF</Button>
        </div>
      </CardContent>
    </Card>
  );
}


