const { db } = require('./data')

const resolvers = {
  Query: {
    posts: () =>
      db.posts,
    author: (_, { id }) =>
      db.authors.filter(author => author.id === id)
  },
  Post: {
    author: (post) =>
      db.authors.filter(author => author.id === post.authorId)[0]
  },
  Author: {
    posts: (author) =>
      db.posts.filter(post => post.author === author.id)
  },
  Name: {
    full: (name) =>
      name.first + (name.middle ? ` ${name.middle} ` : '') + name.last
  }
}

module.exports = resolvers
