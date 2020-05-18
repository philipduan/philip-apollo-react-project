export default function (user) {
  if (user && user["https://philgame-dev.com/user_authorization"]) {
    return user["https://philgame-dev.com/user_authorization"].permissions;
  }
  return false;
}
