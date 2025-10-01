import { useState } from "react"

const Blog = ({ blog, handleLike, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return(
  <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <div>URL: {blog.url}</div>
        <div>Likes: {blog.likes} <button onClick={() => handleLike(blog)}>like</button> </div>
        <div>Added by: {blog.user?.username}</div>
        <button onClick={() => removeBlog(blog)}>remove</button>
      </div>
    </div>
  )  
}

export default Blog