import { render, screen, fireEvent, waitFor } from '../test-utils';
import VerifyPin from '../../src/pages/verify-pin/VerifyPin';
import '@testing-library/jest-dom';

// Mock the helper functions
jest.mock('../../src/utils/helper', () => ({
  apiRequest: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('VerifyPin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders verify PIN page correctly', () => {
    render(<VerifyPin />);

    expect(screen.getByText(/Enter your secret PIN/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter your PIN to access secret notes/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-pin')).toBeInTheDocument();
    expect(screen.getByTestId('button-verify-pin')).toBeInTheDocument();
  });

  it('navigates to secret safe on successful PIN verification', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({ 
      valid: true, 
      message: 'PIN verified',
      pinToken: 'mock-pin-token-123'
    });

    render(<VerifyPin />);

    const pinInput = screen.getByTestId('input-pin');
    const verifyButton = screen.getByTestId('button-verify-pin');

    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/api/secret/verify-pin', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ pin: '1234' })
      }));
    });

    // Check that PIN verification is stored in sessionStorage
    expect(sessionStorage.setItem).toHaveBeenCalledWith('secretSafePinVerified', 'true');
    expect(mockNavigate).toHaveBeenCalledWith('/secret-safe');
  });

  it('shows error message on failed PIN verification', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({ 
      valid: false, 
      message: 'Invalid PIN'
    });

    render(<VerifyPin />);

    const pinInput = screen.getByTestId('input-pin');
    const verifyButton = screen.getByTestId('button-verify-pin');

    fireEvent.change(pinInput, { target: { value: '0000' } }); // Wrong PIN
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid PIN/i)).toBeInTheDocument();
    });
  });

  it('shows error message on API error', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockRejectedValue(new Error('Network error'));

    render(<VerifyPin />);

    const pinInput = screen.getByTestId('input-pin');
    const verifyButton = screen.getByTestId('button-verify-pin');

    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('navigates back to home when cancel button is clicked', () => {
    render(<VerifyPin />);

    const cancelButton = screen.getByTestId('button-cancel-verify');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});