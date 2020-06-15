import { gql } from "@apollo/client";

import {
  basicPost,
  basicProfile,
  basicReply,
  postsNextPage,
  repliesNextPage,
  profilesNextPage,
} from "./fragment";

export const GET_PROFILE = gql`
  query GET_PROFILE($username: String!) {
    profile(username: $username) {
      ...basicProfile
      account {
        id
        createdAt
        isBlocked
        isModerator
      }
    }
  }
  ${basicProfile}
`;

export const GET_PROFILE_CONTENT = gql`
  query GET_PROFILE_CONTENT(
    $followingCursor: String
    $postsCursor: String
    $repliesCursor: String
    $username: String!
  ) {
    profile(username: $username) {
      id
      following(first: 2, after: $followingCursor) {
        edges {
          node {
            ...basicProfile
          }
        }
        ...profilesNextPage
      }
      posts(first: 4, after: $postsCursor) {
        edges {
          node {
            ...basicPost
          }
        }
        ...postsNextPage
      }
      replies(first: 4, after: $repliesCursor) {
        edges {
          node {
            ...basicReply
          }
        }
        ...repliesNextPage
      }
    }
  }
  ${basicProfile}
  ${basicPost}
  ${basicReply}
  ${profilesNextPage}
  ${postsNextPage}
  ${repliesNextPage}
`;

export const GET_VIEWER = gql`
  query GET_VIEWER {
    viewer {
      id
      createdAt
      email
      isModerator
      profile {
        ...basicProfile
      }
    }
  }
  ${basicProfile}
`;
