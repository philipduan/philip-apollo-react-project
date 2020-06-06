import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
  DateTime: DateTimeResolver,
  Mutation: {
    createPost(parent, { data }, { dataSources }, info) {
      return dataSources.contentAPI.createPost(data);
    },
  },
  Post: {
    author(post, args, context, info) {
      return { __typename: "Profile", id: post.authorProfileId };
    },
    id(post, args, context, info) {
      return post._id;
    },
    isBlocked(post, args, context, info) {
      return post.blocked;
    },
  },
  Profile: {
    posts(profile, args, { dataSources }, info) {
      console.log("posts -> profile", profile);

      return dataSources.contentAPI.getOwnPosts({
        ...args,
        authorProfileId: profile.id,
      });
    },
  },
  Query: {
    post(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getPostById(id);
    },
    posts(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getPosts(args);
    },
  },
};

export default resolvers;
