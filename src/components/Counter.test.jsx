import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments count by 1 when +1 button is clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /\+ 1/i }));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements count by 1 when -1 button is clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /\+ 1/i })); // Increment first to have a value to decrement
    fireEvent.click(screen.getByRole('button', { name: /\- 1/i }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('resets count to 0 when Reset button is clicked', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /\+ 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('changes step to 5 and increments correctly', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /Step: 5/i }));
    fireEvent.click(screen.getByRole('button', { name: /\+ 5/i }));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('changes step to 10 and decrements correctly', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: /Step: 10/i }));
    fireEvent.click(screen.getByRole('button', { name: /\+ 10/i }));
    fireEvent.click(screen.getByRole('button', { name: /\- 10/i }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});


