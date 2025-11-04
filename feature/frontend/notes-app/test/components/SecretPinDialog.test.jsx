import { render, screen, fireEvent, waitFor } from '../test-utils';
import SecretPinDialog from '../../src/components/secret-pin-dialog';
import '@testing-library/jest-dom';

// Mock the helper functions
jest.mock('../../src/utils/helper', () => ({
  apiRequest: jest.fn(),
}));

describe('SecretPinDialog Component', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders setup PIN dialog correctly when isFirstTime is true', () => {
    render(
      <SecretPinDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSuccess={mockOnSuccess} 
        isFirstTime={true} 
      />
    );

    expect(screen.getByText(/Set up your secret PIN/i)).toBeInTheDocument();
    expect(screen.getByText(/This PIN will be required to access your secret notes/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-pin')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirm-pin')).toBeInTheDocument();
    expect(screen.getByTestId('button-set-pin')).toBeInTheDocument();
  });

  it('renders verify PIN dialog correctly when isFirstTime is false', () => {
    render(
      <SecretPinDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSuccess={mockOnSuccess} 
        isFirstTime={false} 
      />
    );

    expect(screen.getByText(/Enter your secret PIN/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter your PIN to access secret notes/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-pin')).toBeInTheDocument();
    expect(screen.getByTestId('button-verify-pin')).toBeInTheDocument();
  });

  it('calls onSuccess when PIN is set successfully', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({ message: 'PIN set successfully' });

    render(
      <SecretPinDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSuccess={mockOnSuccess} 
        isFirstTime={true} 
      />
    );

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

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('calls onSuccess when PIN is verified successfully', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({ 
      valid: true, 
      message: 'PIN verified',
      pinToken: 'mock-pin-token-123'
    });

    render(
      <SecretPinDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSuccess={mockOnSuccess} 
        isFirstTime={false} 
      />
    );

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
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('shows error for mismatched PINs in setup mode', async () => {
    render(
      <SecretPinDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSuccess={mockOnSuccess} 
        isFirstTime={true} 
      />
    );

    const pinInput = screen.getByTestId('input-pin');
    const confirmPinInput = screen.getByTestId('input-confirm-pin');
    const setPinButton = screen.getByTestId('button-set-pin');

    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.change(confirmPinInput, { target: { value: '5678' } }); // Different PIN
    fireEvent.click(setPinButton);

    await waitFor(() => {
      expect(screen.getByText(/PINs do not match/i)).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('shows error for incorrect PIN in verify mode', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({ 
      valid: false, 
      message: 'Invalid PIN'
    });

    render(
      <SecretPinDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSuccess={mockOnSuccess} 
        isFirstTime={false} 
      />
    );

    const pinInput = screen.getByTestId('input-pin');
    const verifyButton = screen.getByTestId('button-verify-pin');

    fireEvent.change(pinInput, { target: { value: '0000' } }); // Wrong PIN
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid PIN/i)).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('calls onOpenChange with false when dialog is closed', () => {
    render(
      <SecretPinDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSuccess={mockOnSuccess} 
        isFirstTime={true} 
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});