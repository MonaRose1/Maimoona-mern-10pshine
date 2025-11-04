import { render, screen, fireEvent, waitFor } from '../test-utils';
import SecretSafe from '../../src/pages/secret-safe/SecretSafe';
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

describe('SecretSafe Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders secret safe page correctly', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue([
      { _id: '1', title: 'Secret Note 1', content: 'Secret content 1' },
      { _id: '2', title: 'Secret Note 2', content: 'Secret content 2' }
    ]);

    render(<SecretSafe />);

    expect(screen.getByText(/Secret Safe/i)).toBeInTheDocument();
    expect(await screen.findByText(/Secret Note 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Secret Note 2/i)).toBeInTheDocument();
  });

  it('shows error message on failed secret notes load', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockRejectedValue(new Error('Failed to load secret notes'));

    render(<SecretSafe />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load secret notes/i)).toBeInTheDocument();
    });
  });

  it('handles creating a new secret note', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    // Mock for loading existing notes
    apiRequest.mockResolvedValueOnce([
      { _id: '1', title: 'Secret Note 1', content: 'Secret content 1' }
    ]);
    // Mock for creating new note
    apiRequest.mockResolvedValueOnce({
      _id: '2',
      title: 'Untitled Secret Note',
      content: ''
    });

    render(<SecretSafe />);

    // Wait for initial notes to load
    await waitFor(() => {
      expect(screen.getByText(/Secret Note 1/i)).toBeInTheDocument();
    });

    const newNoteButton = screen.getByTestId('button-new-secret-note');
    fireEvent.click(newNoteButton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/api/secret/notes', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'Untitled Secret Note',
          content: '',
          tags: [],
          isPinned: false
        })
      }));
    });
  });

  it('handles going back to home', async () => {
    const { apiRequest } = require('../../src/utils/helper');
    apiRequest.mockResolvedValue([]);

    render(<SecretSafe />);

    const backButton = screen.getByTestId('button-back-to-home');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});