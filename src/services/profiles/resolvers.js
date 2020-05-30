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
    deleteProfile(parent, { where: { username } }, { dataSources }, info) {
      return dataSources.profilesAPI.deleteProfile(username);
    },
    updateProfile(
      parent,
      { data, where: { username: currentUsername } },
      { dataSources },
      info
    ) {
      return dataSources.profilesAPI.updateProfile(currentUsername, data);
    },
  },

  Query: {
    async profile(parent, { username }, { dataSources }, info) {
      const profile = await dataSources.profilesAPI.getProfile({ username });

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
