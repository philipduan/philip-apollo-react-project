import { UserInputError } from "apollo-server";

const resolvers = {
  Account: {
    profile(account, args, { dataSources }, info) {
      return dataSources.profilesAPI.getProfile({ accountId: account.id });
    },
  },

  Profile: {
    __resolveReference(reference, { dataSources }, info) {
      return dataSources.profilesAPI;
    },
    account(profile, args, context, info) {
      return { __typename: "Account", id: profile.accountId };
    },
    id(profile, args, context, info) {
      return profile._id;
    },
    viewerIsFollowing(profile, args, { dataSources, user }, info) {
      return dataSources.profilesAPI.checkViewerFollowingProfile(
        user.sub,
        profile._id
      );
    },
  },

  Mutation: {
    createProfile(parent, { data }, { dataSources }, info) {
      return dataSources.profilesAPI.createProfile(data);
    },
  },

  Query: {
    async ProfilesDataSource(parent, { username }, { dataSources }, info) {
      const profile = await dataSources.profilessAPI.getProfile({ username });

      if (!profile) {
        throw new UserInputError("Profile does not exist");
      }
      return profile;
    },
    profiles(parent, args, { dataSources }, info) {
      return dataSources.profilesAPI.getProfiles();
    },
  },
};

export default resolvers;
