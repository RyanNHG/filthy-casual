const {
  getAllPosts,
  getAllAuthors,
  getPost,
  getAuthor,
  getPostsByAuthor
} = require('../data')

const resolvers = {
  Query: {
    posts: (_, { page }) => getAllPosts({ page }),
    post: (_, { id }) => getPost(id),
    authors: (_, { page }) => getAllAuthors({ page }),
    author: (_, { id }) => getAuthor(id)
  },
  Post: {
    author: (post) => getAuthor(post.authorId)
  },
  Author: {
    posts: (author) => getPostsByAuthor(author.id)
  },
  Name: {
    full: (name) =>
      [name.first, name.middle, name.last].filter(a => a).join(' ')
  }
}

module.exports = resolvers
