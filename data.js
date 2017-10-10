const casual = require('casual')

const NUM_AUTHORS = 20
const NUM_POSTS = 20
const PAGE_SIZE = 10

casual.seed(1234567890)

casual.define('post', (id) => ({
  id: id,
  title: casual.title,
  authorId: casual.integer(1, NUM_AUTHORS)
}))

casual.define('author', (id) => ({
  id,
  name: {
    first: casual.first_name,
    middle: (casual.random < 0.5) ? casual.first_name : undefined,
    last: casual.last_name
  }
}))

const listOfSize = (size) =>
  [...Array(size)].map((_, i) => i + 1)

const generate = (type, count) =>
  listOfSize(count).map(id => type(id))

const db = {
  posts: generate(casual._post, NUM_POSTS),
  authors: generate(casual._author, NUM_AUTHORS)
}

const getStartPage = (page, pageSize) =>
  page ? page * pageSize : 0

const getEndPage = (page, pageSize) =>
  getStartPage(page, pageSize) + pageSize

const getAll = (collectionName) => ({ page }) =>
  db[collectionName].slice(
    getStartPage(page, PAGE_SIZE),
    getEndPage(page, PAGE_SIZE)
  )

const getById = (collectionName) => (id) =>
  db[collectionName].filter(thing => thing.id === id)[0]

const getAllPosts = getAll('posts')
const getAllAuthors = getAll('authors')

const getPost = getById('posts')
const getAuthor = getById('authors')

const getPostsByAuthor = (authorId) =>
  db.posts.filter(post => post.authorId === authorId)

module.exports = {
  getAllPosts,
  getAllAuthors,
  getPost,
  getAuthor,
  getPostsByAuthor
}
