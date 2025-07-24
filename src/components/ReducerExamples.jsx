import React, { useReducer, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Reducer for Todo List
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        { id: Date.now(), text: action.payload, completed: false },
      ];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'REMOVE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
};

// Reducer for Shopping Cart
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          total: state.total + action.payload.price
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price
        };
      }
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (itemToRemove) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload),
          total: state.total - (itemToRemove.price * itemToRemove.quantity)
        };
      }
      return state;
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        ...state,
        items: updatedItems,
        total: newTotal
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

function ReducerExamples() {
  // Todo List Example
  const [todos, dispatchTodos] = useReducer(todoReducer, [
    { id: 1, text: 'Learn useReducer', completed: false },
    { id: 2, text: 'Build a shopping cart', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      dispatchTodos({ type: 'ADD_TODO', payload: newTodoText });
      setNewTodoText('');
    }
  };

  // Shopping Cart Example
  const [cart, dispatchCart] = useReducer(cartReducer, { items: [], total: 0 });
  const products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">useReducer Hook Examples</h2>
      <p className="text-gray-700 dark:text-gray-300">
        The <code>useReducer</code> hook is an alternative to <code>useState</code> for managing more complex state logic that involves multiple sub-values or when the next state depends on the previous one.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Todo List with useReducer */}
        <Card>
          <CardHeader>
            <CardTitle>Todo List (useReducer)</CardTitle>
            <CardDescription>Managing array state with a reducer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add new todo..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <Button onClick={handleAddTodo}>Add</Button>
            </div>
            <div className="space-y-2">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatchTodos({ type: 'TOGGLE_TODO', payload: todo.id })}
                    className="w-4 h-4"
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </span>
                  <Button
                    onClick={() => dispatchTodos({ type: 'REMOVE_TODO', payload: todo.id })}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {todos.filter((t) => !t.completed).length} of {todos.length} remaining
            </p>
          </CardContent>
        </Card>

        {/* Shopping Cart with useReducer */}
        <Card>
          <CardHeader>
            <CardTitle>Shopping Cart (useReducer)</CardTitle>
            <CardDescription>Complex state management with a reducer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{product.name} (${product.price})</span>
                  <Button onClick={() => dispatchCart({ type: 'ADD_ITEM', payload: product })} size="sm">
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold mt-4">Your Cart</h3>
            {cart.items.length === 0 ? (
              <p className="text-gray-500">Cart is empty.</p>
            ) : (
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{item.name} (x{item.quantity})</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => dispatchCart({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                        disabled={item.quantity <= 1}
                        size="sm"
                        variant="outline"
                      >
                        -
                      </Button>
                      <Button
                        onClick={() => dispatchCart({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                        size="sm"
                        variant="outline"
                      >
                        +
                      </Button>
                      <Button
                        onClick={() => dispatchCart({ type: 'REMOVE_ITEM', payload: item.id })}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total:</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <Button onClick={() => dispatchCart({ type: 'CLEAR_CART' })} className="w-full mt-2">
                  Clear Cart
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* useState vs useReducer Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>useState vs useReducer Comparison</CardTitle>
          <CardDescription>When to use which hook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">useState</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Simpler for basic state updates (e.g., numbers, booleans, strings).</li>
                <li>Ideal for independent state variables.</li>
                <li>Less boilerplate code for simple scenarios.</li>
                <li>Updates are direct: <code>setCount(count + 1)</code>.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">useReducer</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Better for complex state logic (e.g., objects, arrays).</li>
                <li>When state transitions are complex or involve multiple sub-values.</li>
                <li>When the next state depends on the previous state.</li>
                <li>Centralized state logic (reducer function).</li>
                <li>Updates are dispatched: <code>{`dispatch({ type: 'ACTION', payload: value })`}</code>.</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Choose <code>useReducer</code> when you have complex state logic, and <code>useState</code> for simpler state management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReducerExamples;


