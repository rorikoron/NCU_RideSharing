import { defineStore } from 'pinia'
import PocketBase, { type RecordModel } from 'pocketbase'
import { ref } from 'vue'

export interface User{
    id?: string
    name: string
    email: string
    avatar?: string
    role: string
    verified: boolean
    created?: string,
    update?: string
}

export interface Propose{
    id?: string,
    proponent: string,
    origin: string,
    arrival: string,
    departure: string,
    headcount: number
    price?: number
    appendix?: string
    created?: string,
    updated?: string,
    expand?:{
        proponent: User
    }
}

const pb = new PocketBase('http://localhost:8090')

export const usePocketbaseStore = defineStore('pocketbase', () => {
    const proposes = ref<Propose[]>([])

    const refreshProposes = async () => {
        proposes.value = await pb.collection("Propose").getFullList({
            sort: 'created',
            expand: 'proponent'
        });
    }

    const createPropose = async (propose: FormData) => {
        const createdPropose = await pb.collection("Propose").create(propose)
        return createdPropose
    }

    const fetchAvatarURL = (user: User | undefined) => {
        const defaultAvatar = './vue.svg';
        console.log(user)
        if(!user || !user.avatar) return defaultAvatar
        return `${pb.baseURL}/api/files/users/${user.id}/${user.avatar}`
    }
    
    return{
        fetchAvatarURL,
        proposes,
        refreshProposes,
        createPropose,
    }
})