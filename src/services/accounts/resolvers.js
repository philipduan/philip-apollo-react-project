import { UserInputError } from "apollo-server";

import { DateTimeResolver } from "../../lib/customScalars";
import getToken from "../../lib/getToken";

const resolvers = {
  DateTime: DateTimeResolver,
  Account: {
    __resolveReference(reference, { dataSources }, info) {
      return dataSources.accountsApi.getAccountById(reference.id);
    },
    id(account, args, { dataSources }, info) {
      return account.user_id;
    },
    isBlocked(account, args, { dataSources }, info) {
      return account.blocked;
    },
    createdAt(account, args, { dataSources }, info) {
      return account.created_at;
    },
    isModerator(account, args, { dataSources }, info) {
      return (
        account.app_metadata &&
        account.app_metadata.roles &&
        account.app_metadata.roles.includes("moderator")
      );
    },
  },
  Query: {
    account(parent, { id }, { dataSources }, info) {
      return dataSources.accountsApi.getAccountById(id);
    },
    accounts(parent, args, { dataSources }, info) {
      return dataSources.accountsApi.getAccounts();
    },
    viewer(parent, args, { user }, info) {
      if (user && user.sub) {
        return dataSources.accountsApi.getAccountById(user.sub);
      }
      return null;
    },
  },
  Mutation: {
    changeAccountBlockedStatus(
      parent,
      { where: { id } },
      { dataSources },
      info
    ) {
      return dataSources.accountsApi.changeAccountBlockedStatus(id);
    },
    changeAccountModeratorRole(
      parent,
      { where: { id } },
      { dataSources },
      info
    ) {
      return dataSources.accountsApi.changeAccountModeratorRole(id);
    },
    createAccount(
      parent,
      { data: { email, password } },
      { dataSources },
      info
    ) {
      return dataSources.accountsApi.createAccount(email, password);
    },
    deleteAccount(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.accountsApi.deleteAccount(id);
    },
    updateAccount(parent, { data, where: { id } }, { dataSources }, info) {
      return dataSources.accountsApi.updateAccount(id, data);
    },
  },
};

export default resolvers;
