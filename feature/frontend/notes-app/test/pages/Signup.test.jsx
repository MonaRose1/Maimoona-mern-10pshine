import { render, screen, fireEvent, waitFor } from '../test-utils';
import Signup from '../../src/pages/signup/Signup';
import '@testing-library/jest-dom';

// Mock the helper functions
jest.mock('../../src/utils/helper', () => ({
  apiRequest: jest.fn(),
  validateEmail: jest.fn(() => true),
  validatePassword: jest.fn(() => true),
  validateConfirmPassword: jest.fn(() => true),
  validateUsername: jest.fn(() => true)
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders signup form correctly', () => {
    render(<Signup />);

    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirm-password')).toBeInTheDocument();
    expect(screen.getByTestId('button-signup')).toBeInTheDocument();
  });

  it('shows error for mismatched passwords', async () => {
    const { validateConfirmPassword } = require('../../src/utils/helper');
    validateConfirmPassword.mockReturnValue(false);

    render(<Signup />);

    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-signup');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('navigates to login on successful signup', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({
      token: 'mock-token-123',
      user: { name: 'Test User', email: 'test@example.com', id: '123' }
    });

    // Mock window.alert
    window.alert = jest.fn();

    render(<Signup />);

    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-signup');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorage.getItem('token')).toBe('mock-token-123');
    });
  });

  it('disables submit button during loading', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<Signup />);

    const submitButton = screen.getByTestId('button-signup');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it('shows error message on failed signup', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockRejectedValue(new Error('User already exists'));

    render(<Signup />);

    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-signup');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('has link to login page', () => {
    render(<Signup />);

    const loginLink = screen.getByTestId('link-login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
