import { defineStore } from "pinia";

interface UserStore {
  user: {
    userName: string;
    password: string;
  };
}

const userNameStorage = localStorage.getItem("userName");
const passwordStorage = localStorage.getItem("password");

export const useUserStore = defineStore({
  id: "userStore",
  state: (): UserStore => ({
    user: {
      userName: userNameStorage === null ? "" : userNameStorage,
      password: passwordStorage === null ? "" : passwordStorage,
    },
  }),
  getters: {},
  actions: {
    setUserName(userName: string) {
      this.user.userName = userName;
      localStorage.setItem("userName", userName);
    },
    setPassword(password: string) {
      this.user.password = password;
      localStorage.setItem("password", password);
    },
  },
});
