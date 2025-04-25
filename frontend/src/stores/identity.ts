import { defineStore } from "pinia";
import PocketBase, { type RecordModel } from 'pocketbase'
import { ref } from "vue";

const pb = new PocketBase("http://localhost:8090");
export const useIdentity = defineStore('identity', () => {
    
    const isLogin = ref(false);
    const authUser = ref<RecordModel | null>(null);

    const getIsLogin = () => isLogin.value;
    const getAuthUser = () => authUser.value;
    
    const checkLogin = async () => {
        try {
            if (pb.authStore.record) {
                const { record, token } = await pb
                    .collection(pb.authStore.record.collectionName)
                    .authRefresh()

                if (token) {
                    authUser.value = record as RecordModel;
                    isLogin.value = true
                } else {
                    throw new Error('Login failed')
                }
            } else {
                authUser.value = null
                isLogin.value = false
            }
        } catch (error) {
            isLogin.value = false
        }
    }

    const login = async (email: string, password: string) => {
        if (isLogin.value) {
            return;
        }

        try{
            const authData = await pb.collection("users").authWithPassword(email, password);
            authUser.value = authData.record;
            isLogin.value = true;
            console.log(authUser.value)
        }catch(e){
            console.error(e);
            return;
        }
    };

    const logout = async () => {
        await pb.authStore.clear();
        isLogin.value = false;
    };

    const fetchAvatarURL = (id: string | undefined, avatar: string | undefined) => {
        const defaultAvatar = './vue.svg';
        if(!id || !avatar) return defaultAvatar
        return `${pb.baseURL}/api/files/users/${id}/${avatar}`
    }

    return { pb, getIsLogin,getAuthUser, checkLogin, login, logout, fetchAvatarURL };
})