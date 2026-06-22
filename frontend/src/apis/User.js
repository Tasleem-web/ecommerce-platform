import { ApiUsers } from "./Api";
const END_POINT = 'users';

export default {
    login(email, password) {
        return ApiUsers.post(`${END_POINT}/login`, { email, password });
    },
    logout() {
        return ApiUsers.post(`${END_POINT}/logout`);
    },
    me() {
        return ApiUsers.get(`${END_POINT}/me`);
    },
    register(payload) {
        return ApiUsers.post(`${END_POINT}/register`, payload);
    },
    uploadImageBuffer(imageData, folder = 'user_profiles') {
        return ApiUsers.post(`${END_POINT}/upload-buffer`, { imageData, folder });
    },
};