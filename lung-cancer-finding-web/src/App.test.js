import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the image analysis workspace', () => {
  render(<App />);
  expect(screen.getByText(/a clearer first look at your scan/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /run analysis/i })).toBeInTheDocument();
});
