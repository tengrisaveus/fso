import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

test('renders title and author but not url or number of likes', () => {
    const blog = {
        author: 'testo taylan',
        title: 'ev ziyareti',
        url: 'youtube.com',
        likes: 4
    }

    const { container } = render(<Blog blog={blog} />)

    const element = screen.getAllByText('ev ziyareti testo taylan')[0]
    expect(element).toBeDefined()

    const hiddenSection = container.querySelector('div[style*="display: none"]')
    expect(hiddenSection).toBeDefined()
    
    expect(hiddenSection.textContent).toContain('URL: youtube.com')
    expect(hiddenSection.textContent).toContain('Likes: 4')
})   

test('url and likes are shown when view button is clicked', async () => {
    const blog = {
        author: 'testo taylan',
        title: 'ev ziyareti',
        url: 'youtube.com',
        likes: 4
    }

    const user = userEvent.setup()
    const { container } = render(<Blog blog={blog} />)

    
    let hiddenSection = container.querySelector('div[style*="display: none"]')
    expect(hiddenSection).toBeDefined()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlElement = screen.getByText('URL: youtube.com')
    const likesElement = screen.getByText(/Likes: 4/)
    
    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()

    const hideButton = screen.getByText('hide')
    expect(hideButton).toBeDefined()
})

test('like button calls event handler twice when clicked twice', async () => {
    const blog = {
        author: 'testo taylan',
        title: 'ev ziyareti',
        url: 'youtube.com',
        likes: 4
    }

    const mockHandleLike = vi.fn()
    const user = userEvent.setup()

    render(<Blog blog={blog} handleLike={mockHandleLike} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandleLike).toHaveBeenCalledTimes(2)
    expect(mockHandleLike).toHaveBeenCalledWith(blog)
})
