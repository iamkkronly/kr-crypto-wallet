import { render, screen } from '@testing-library/react';
import Wallet from '../Wallet';

describe('Wallet', () => {
  it('renders the connect wallet button', () => {
    render(<Wallet />);
    const connectButton = screen.getByText('Connect Wallet');
    expect(connectButton).toBeInTheDocument();
  });
});