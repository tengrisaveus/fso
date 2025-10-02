import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('form calls event handler with right details when a new blog is created', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]  
    const authorInput = inputs[1]   
    const urlInput = inputs[2]   

    await user.type(titleInput, 'Testesteron')
    await user.type(authorInput, 'Test Testoglu')
    await user.type(urlInput, 'https://testing.com')

    const createButton = screen.getByText('create')
    await user.click(createButton)

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)

    expect(mockCreateBlog).toHaveBeenCalledWith({
        title: 'Testesteron',
        author: 'Test Testoglu',
        url: 'https://testing.com'
    })
})