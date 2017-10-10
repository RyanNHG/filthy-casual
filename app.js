const { makeExecutableSchema } = require('graphql-tools')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const express = require('express')
const bodyParser = require('body-parser')
const { typeDefs, resolvers } = require('./graphql')

const port = process.env.PORT || 3000
const graphQLOptions = {
  schema: makeExecutableSchema({ typeDefs, resolvers })
}

const app = express()

app.use('/graphql',
  bodyParser.json(),
  (_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  },
  graphqlExpress(graphQLOptions)
)
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(port, () => console.info(`Ready at http://localhost:${port}`))
