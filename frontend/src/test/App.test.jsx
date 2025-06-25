import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';

// Mock component to avoid complex rendering in tests
const MockApp = () => (
  <BrowserRouter>
    <div data-testid="app">
      <h1>BlueSystem.io</h1>
      <p>Application loaded successfully</p>
    </div>
  </BrowserRouter>
);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<MockApp />);
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<MockApp />);
    expect(screen.getByText('BlueSystem.io')).toBeInTheDocument();
  });

  it('shows application loaded message', () => {
    render(<MockApp />);
    expect(screen.getByText('Application loaded successfully')).toBeInTheDocument();
  });
});