const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await
request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('form')).toBeVisible()
  })

  describe('Login', () => {
    test('fails with wrong password', async ({ page }) => {
     await page.getByRole('button', { name: 'login' }).click()
     await page.getByLabel('username').fill('mluukkai')
     await page.getByLabel('password').fill('wrong')
     await page.getByRole('button', { name: 'login' }).click()

     await expect(page.getByText('wrong credentials')).toBeVisible()
  })

    test('succeeds with correct credentials', async ({ page }) => {
     await page.getByRole('button', { name: 'login' }).click()
     await page.getByLabel('username').fill('mluukkai')
     await page.getByLabel('password').fill('salainen')
     await page.getByRole('button', { name: 'login' }).click()

     await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
     await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
  })
})

  describe('When logged in', () => {
     beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('a blog created by playwright')
      await page.getByLabel('author').fill('Matti Luukkainen')
      await page.getByLabel('url').fill('http://example.com/playwright')
      await page.getByRole('button', { name: 'save' }).click()

      await expect(page.getByText('a blog created by playwright')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('a blog to like')
      await page.getByLabel('author').fill('Author Name')
      await page.getByLabel('url').fill('http://example.com/like')
      await page.getByRole('button', { name: 'save' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText(/likes\s*0/i)).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(/likes\s*1/i)).toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('a blog to delete')
      await page.getByLabel('author').fill('Author Delete')
      await page.getByLabel('url').fill('http://example.com/delete')
      await page.getByRole('button', { name: 'save' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('a blog to delete')).toHaveCount(0)
    })

    test('only the user who added the blog sees the delete button', async ({ page, request }) => {

      await request.post('http://localhost:3003/api/users', {
        data: { name: 'Other User', username: 'other', password: 'password' }
      })

      const loginResp = await request.post('http://localhost:3003/api/login', {
        data: { username: 'mluukkai', password: 'salainen' }
      })
      const token = (await loginResp.json()).token

      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'blog by mluu', author: 'Matti Luukkainen', url: 'http://example.com/mluu' },
        headers: { Authorization: `Bearer ${token}` }
      })

      await page.goto('http://localhost:5173')

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('other')
      await page.getByLabel('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)

      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('blogs are ordered by likes (most liked first)', async ({ page, request }) => {
      
      const loginResp = await request.post('http://localhost:3003/api/login', {
        data: { username: 'mluukkai', password: 'salainen' }
      })
      const token = (await loginResp.json()).token

      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'least liked blog', author: 'A', url: 'http://example.com/1', likes: 1 },
        headers: { Authorization: `Bearer ${token}` }
      })

      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'most liked blog', author: 'B', url: 'http://example.com/2', likes: 7 },
        headers: { Authorization: `Bearer ${token}` }
      })

      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'middle liked blog', author: 'C', url: 'http://example.com/3', likes: 5 },
        headers: { Authorization: `Bearer ${token}` }
      })

      await page.goto('http://localhost:5173')

      const blogTexts = await page.locator('.blog').allTextContents()

      expect(blogTexts[0]).toContain('most liked blog')
      expect(blogTexts[1]).toContain('middle liked blog')
      expect(blogTexts[2]).toContain('least liked blog')
    })
  })  
  
})