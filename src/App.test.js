import { render, screen } from '@testing-library/react';
import ChatApp from './pages/ChatApp';

test('renders learn react link', () => {
  render(<ChatApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
