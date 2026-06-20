export const currentUser = (state) => state.currentUser;
export const isAdmin = (state) => state.currentUser && state.currentUser.role === "admin";
