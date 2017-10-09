const casual = require('casual')

const NUM_AUTHORS = 20
const NUM_POSTS = 20

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

const db = {
  posts: listOfSize(NUM_POSTS).map((id) => casual.post(id)),
  authors: listOfSize(NUM_AUTHORS).map((id) => casual.author(id))
}

module.exports = {
  db
}
