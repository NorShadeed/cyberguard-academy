import { render, screen } from '@testing-library/react';
import App from './App';
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from 'react'; // Make sure to import this too!

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
