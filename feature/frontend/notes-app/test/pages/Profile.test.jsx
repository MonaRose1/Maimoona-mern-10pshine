import { render, screen, fireEvent, waitFor } from '../test-utils';
import Profile from '../../src/pages/profile/Profile';
import '@testing-library/jest-dom';

// Mock the helper functions
jest.mock('../../src/utils/helper', () => ({
  apiRequest: jest.fn(),
  validateEmail: jest.fn(() => true),
  validatePassword: jest.fn(() => true),
  validateUsername: jest.fn(() => true)
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders profile page correctly', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2023-01-01T00:00:00.000Z'
    });

    render(<Profile />);

    expect(screen.getByText(/Profile Settings/i)).toBeInTheDocument();
    expect(await screen.findByText(/Test User/i)).toBeInTheDocument();
    expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('shows error message on failed profile load', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockRejectedValue(new Error('Failed to load profile'));

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load profile/i)).toBeInTheDocument();
    });
  });

  it('handles logout correctly', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2023-01-01T00:00:00.000Z'
    });

    render(<Profile />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });

    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);

    const logoutButton = screen.getByTestId('button-logout');
    fireEvent.click(logoutButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to logout?');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('cancels logout when user declines', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2023-01-01T00:00:00.000Z'
    });

    render(<Profile />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });

    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);

    const logoutButton = screen.getByTestId('button-logout');
    fireEvent.click(logoutButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to logout?');
    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});