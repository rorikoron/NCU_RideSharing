import { defineStore } from "pinia";
import PocketBase, { type RecordModel } from 'pocketbase'
import { ref } from "vue";

const pb = new PocketBase("http://localhost:8090");
export const useIdentity = defineStore('identity', () => {
    
    const isLogin = ref(false);
    const isDriver = ref(false)
    const authUser = ref<RecordModel | null>(null);

    const getIsLogin = () => isLogin.value;
    const getAuthUser = () => authUser.value;
    const getIsDriver = () => isDriver.value;

    const createUser = async (user: FormData) => {
        const createUser = await pb.collection("users").create(user)
        return createUser;
    }
    
    const checkLogin = async () => {
        try {
            if (pb.authStore.record) {
                const { record, token } = await pb
                    .collection(pb.authStore.record.collectionName)
                    .authRefresh()

                if (token) {
                    authUser.value = record as RecordModel;
                    isLogin.value = true
                    isDriver.value = record?.is_driver || false
                } else {
                    throw new Error('Login failed')
                }
            } else {
                authUser.value = null
                isLogin.value = false
                isDriver.value = false
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
            isDriver.value = authUser.value?.is_driver || false
            console.log(authUser.value)
        }catch(e){
            console.error(e);
            return;
        }
    };

    const logout = async () => {
        await pb.authStore.clear();
        isLogin.value = false;
        isDriver.value = false
        authUser.value = null
    };

    const fetchAvatarURL = (id: string | undefined, avatar: string | undefined) => {
        const defaultAvatar = './vue.svg';
        if(!id || !avatar) return defaultAvatar
        return `${pb.baseURL}/api/files/users/${id}/${avatar}`
    }

    return { pb, createUser, getIsLogin, getIsDriver, getAuthUser, checkLogin, login, logout, fetchAvatarURL };
})
