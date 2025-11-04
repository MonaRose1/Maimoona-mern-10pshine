import { render, screen, fireEvent, waitFor } from '../test-utils';
import SetupPin from '../../src/pages/setup-pin/SetupPin';
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

describe('SetupPin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders setup PIN page correctly', () => {
    render(<SetupPin />);

    expect(screen.getByText(/Set up your secret PIN/i)).toBeInTheDocument();
    expect(screen.getByText(/This PIN will be required to access your secret notes/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-pin')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirm-pin')).toBeInTheDocument();
    expect(screen.getByTestId('button-set-pin')).toBeInTheDocument();
  });

  it('shows error for mismatched PINs', async () => {
    render(<SetupPin />);

    const pinInput = screen.getByTestId('input-pin');
    const confirmPinInput = screen.getByTestId('input-confirm-pin');
    const setPinButton = screen.getByTestId('button-set-pin');

    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.change(confirmPinInput, { target: { value: '5678' } }); // Different PIN
    fireEvent.click(setPinButton);

    await waitFor(() => {
      expect(screen.getByText(/PINs do not match/i)).toBeInTheDocument();
    });
  });

  it('shows error for PIN too short', async () => {
    render(<SetupPin />);

    const pinInput = screen.getByTestId('input-pin');
    const confirmPinInput = screen.getByTestId('input-confirm-pin');
    const setPinButton = screen.getByTestId('button-set-pin');

    fireEvent.change(pinInput, { target: { value: '123' } }); // Too short
    fireEvent.change(confirmPinInput, { target: { value: '123' } });
    fireEvent.click(setPinButton);

    await waitFor(() => {
      expect(screen.getByText(/PIN must be at least 4 characters/i)).toBeInTheDocument();
    });
  });

  it('navigates to secret safe on successful PIN setup', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({ message: 'PIN set successfully' });

    render(<SetupPin />);

    const pinInput = screen.getByTestId('input-pin');
    const confirmPinInput = screen.getByTestId('input-confirm-pin');
    const setPinButton = screen.getByTestId('button-set-pin');

    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.change(confirmPinInput, { target: { value: '1234' } });
    fireEvent.click(setPinButton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/api/secret/set-pin', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ pin: '1234' })
      }));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/secret-safe');
  });

  it('shows error message on failed PIN setup', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockRejectedValue(new Error('Failed to set PIN'));

    render(<SetupPin />);

    const pinInput = screen.getByTestId('input-pin');
    const confirmPinInput = screen.getByTestId('input-confirm-pin');
    const setPinButton = screen.getByTestId('button-set-pin');

    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.change(confirmPinInput, { target: { value: '1234' } });
    fireEvent.click(setPinButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to set PIN/i)).toBeInTheDocument();
    });
  });

  it('navigates back to home when cancel button is clicked', () => {
    render(<SetupPin />);

    const cancelButton = screen.getByTestId('button-cancel-setup');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});