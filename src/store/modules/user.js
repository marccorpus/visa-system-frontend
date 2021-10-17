import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    user: null
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_USER: (state, user) => {
    state.user = user;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password })
        .then(response => {
          const { data } = response.data;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response.data;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const {
            id,
            first_name,
            last_name,
            email,
            contact_number,
            gender,
            avatar_circle_color,
            avatar_top_type,
            avatar_top_color,
            avatar_hair_color,
            avatar_accessories_type,
            avatar_eyebrow_type,
            avatar_eye_type,
            avatar_facial_hair_type,
            avatar_facial_hair_color,
            avatar_mouth_type,
            avatar_skin_color,
            avatar_clothes_type,
            avatar_clothes_color,
            avatar_graphic_type,
            role
          } = data.user;

          commit("SET_NAME", `${first_name} ${last_name}`);
          commit("SET_USER", {
            id,
            firstName: first_name,
            lastName: last_name,
            email,
            contactNumber: contact_number,
            gender: gender,
            avatar: {
              avatarCircleColor: avatar_circle_color,
              avatarTopType: avatar_top_type,
              avatarTopColor: avatar_top_color,
              avatarHairColor: avatar_hair_color,
              avatarAccessoriesType: avatar_accessories_type,
              avatarEyebrowType: avatar_eyebrow_type,
              avatarEyeType: avatar_eye_type,
              avatarFacialHairType: avatar_facial_hair_type,
              avatarFacialHairColor: avatar_facial_hair_color,
              avatarMouthType: avatar_mouth_type,
              avatarSkinColor: avatar_skin_color,
              avatarClothesType: avatar_clothes_type,
              avatarClothesColor: avatar_clothes_color,
              avatarGraphicType: avatar_graphic_type
            },
            role
          });

          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
