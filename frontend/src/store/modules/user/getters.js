export const currentUser = (state) => state.currentUser;
export const isAdmin = (state) => {
  return (
    state.currentUser &&
    Array.isArray(state.currentUser.roles) &&
    state.currentUser.roles.includes("admin")
  )
};
