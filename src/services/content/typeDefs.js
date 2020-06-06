import { gql } from "apollo-server";

const typeDefs = gql`
  """
  Sorting options for post connections
  """
  enum PostOrderByInput {
    "Order postst ascending by creation time"
    createdAt_ASC
    "Order postst descending by creation time"
    createdAt_DESC
  }

  """
  Provides data to create a post
  """
  input CreatePostInput {
    "The body content of the post (max. 256 characters)"
    text: String!
    "The unique username of the user who authored the post"
    username: String!
  }

  """
  Provides a filter on which postst may be queried
  """
  input PostWhereInput {
    """
    The unique username of the user viewing posts by users they follow

    Results includes their own posts
    """
    followedBy: String
    """
    Whether to include posts that have been blocked by a moderator

    Default is 'true'
    """
    includeBlocked: Boolean
  }

  """
  AN ISO 8601-encoded UTC date string
  """
  scalar DateTime

  """
  Information about pagination in a connection
  """
  type PageInfo {
    "The cursor to continue from when pagination forward"
    endCursor: String
    "Whether there are more items when paginating forward"
    hasNextPage: Boolean!
    "Whether there are more items when paginating backward"
    hasPreviousPage: Boolean!
    "The cursor to continue from when paginating backward"
    startCursor: String
  }

  """
  A list of post edges with pagination information
  """
  type PostConnection {
    "A list of post edges"
    edges: [PostEdge]
    "Information to assist with pagination"
    pageInfo: PageInfo!
  }

  """
  A single post node with its cursor
  """
  type PostEdge {
    "A cursor for use in Pagination"
    cursor: ID!
    "A post at the end of an edge"
    node: Post!
  }

  """
  A post contains content authored by a user
  """
  type Post {
    "The unique MongoDB document ID of the post"
    id: ID!
    "The profile of the user who authored the post"
    author: Profile!
    "The  data and time the post was created"
    createdAt: DateTime!
    "Whether the post is blocked"
    isBlocked: Boolean
    "The URL of a media file associated with the content"
    media: String
    "The body content of the post (max. 256 characters)"
    text: String!
  }

  extend type Mutation {
    "Create a new post"
    createPost(data: CreatePostInput!): Post!
  }

  extend type Profile @key(fields: "id") {
    id: ID! @external
    "A list of posts written by the user"
    posts(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: PostOrderByInput
    ): PostConnection
  }

  extend type Query {
    "Retrieves a single post by MongoDB document ID"
    post(id: ID!): Post!
    "Retrieves a list of posts"
    posts(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: PostOrderByInput
      filter: PostWhereInput
    ): PostConnection
  }
`;

export default typeDefs;
