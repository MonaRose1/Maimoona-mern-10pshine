import { render, screen } from '@testing-library/react';
import NoteCard from './NoteCard.jsx';

describe('NoteCard', () => {
  it('renders title and snippet', () => {
    render(<NoteCard title="My Note" content="This is the content" />);
    expect(screen.getByText('My Note')).toBeInTheDocument();
    expect(screen.getByText(/This is the content/i)).toBeInTheDocument();
  });
});
