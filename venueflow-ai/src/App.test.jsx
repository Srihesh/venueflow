import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the vertical dock navigation', () => {
    // Render the app (uses BrowserRouter and lazy loading)
    render(<App />);
    
    // We expect the main navigation to be in the document
    const navElement = screen.getByRole('navigation', { name: /main navigation/i });
    expect(navElement).toBeInTheDocument();
  });

  it('renders the loading screen when suspending routes', () => {
    render(<App />);
    expect(screen.getByText(/initializing sector/i)).toBeInTheDocument();
  });
});
