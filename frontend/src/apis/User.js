import { ApiUsers } from "./Api";
const END_POINT = 'users';

export default {
    login(email, password) {
        return ApiUsers.post(`${END_POINT}/login`, { email, password })
    }
}