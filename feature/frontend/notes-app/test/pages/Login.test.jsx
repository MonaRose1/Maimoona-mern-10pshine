import { render, screen, fireEvent, waitFor } from '../test-utils';
import Login from '../../src/pages/login/Login';
import '@testing-library/jest-dom';

// Mock the apiRequest helper
jest.mock('../../src/utils/helper', () => ({
  apiRequest: jest.fn(),
  validateEmail: jest.fn(() => true),
  validatePassword: jest.fn(() => true)
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    render(<Login />);

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('button-login')).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockRejectedValue(new Error('Invalid credentials'));

    render(<Login />);

    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('navigates to home on successful login', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({
      token: 'mock-token-123',
      user: { name: 'Test User', email: 'test@example.com', id: '123' }
    });

    render(<Login />);

    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
      expect(localStorage.getItem('token')).toBe('mock-token-123');
    });
  });

  it('disables submit button during loading', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<Login />);

    const submitButton = screen.getByTestId('button-login');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it('has link to signup page', () => {
    render(<Login />);

    const signupLink = screen.getByTestId('link-signup');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});
