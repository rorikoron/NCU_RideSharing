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

type ProposeStatus = 'pending' | 'accpeted' | 'completed' | 'cancelled'
export interface Propose{
    id?: string,
    proponent: string,
    origin: string,
    arrival: string,
    departure: string,
    headcount: number
    price?: number
    status: ProposeStatus
    appendix?: string
    created?: string,
    updated?: string,
    expand?:{
        proponent: User
    }
}
export interface Offer {
    id?: string;
    propose: string;
    driver: string;
    price: number;
    appendix?: string;
    created?: string;
    updated?: string;
    expand?: {
      propose: Propose;
      driver: User;
    };
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

    const fetchUserProposes = async (id: string, page: number) : Promise<Propose[]> => {
        return await pb.collection("Propose").getFullList({
            filter: `proponent = "${id}"`,
            sort: '-created',
            page: page,
        })
    }
    const fetchProposeOffers = async (ids: string[]) : Promise<Offer[]>  => {
        return await pb.collection("Offer").getFullList({
            filter: `${ids.map(id => `propose = "${id}"`).join(' || ')}`,
            sort: '-created',
            expand: 'driver,propose',
        })
    }

    const acceptOffer = async (proposeId: string, offer: Offer) => {
        const updatedPropose = await pb.collection("Propose").update(proposeId, {
            status: 'accepted',
            price: offer.price,
        })

    }
    
    return{
        acceptOffer,
        fetchAvatarURL,
        fetchUserProposes,
        fetchProposeOffers,
        proposes,
        refreshProposes,
        createPropose,
    }
})