import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'
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

export type ProposeStatus = 'pending' | 'accepted' | 'completed' | 'cancelled'

export interface MutablePropose{
    proponent: string,
    origin: string,
    arrival: string,
    departure: string,
    headcount: number
    appendix?: string
}
export interface ImmutablePropose extends MutablePropose{
    id: string,
    offer: string,
    status: ProposeStatus
    created: string,
    updated: string,
    expand:{
        proponent: User
    }
}

export interface MutableOffer{
    propose: string;
    driver: string;
    price: number;
    appendix?: string

}
export interface ImmutableOffer extends MutableOffer{
    id: string;
    created: string;
    updated: string;
    expand?: {
      propose: ImmutablePropose;
      driver: User;
    };
  }
const pb = new PocketBase('http://localhost:8090')

export const usePocketbaseStore = defineStore('pocketbase', () => {
    const proposes = ref<ImmutablePropose[]>([])

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


    const fetchUserProposes = async (id: string, page: number) : Promise<ImmutablePropose[]> => {
        return await pb.collection("Propose").getFullList({
            filter: `proponent = "${id}"`,
            sort: '-created',
            page: page,
        })
    }

    const createOffer = async (offer: FormData) => {
        const createdOffer = await pb.collection("offer").create(offer)
        return createdOffer
    }

    const fetchProposeOffers = async (ids: string[]) : Promise<ImmutableOffer[]>  => {
        return await pb.collection("Offer").getFullList({
            filter: `${ids.map(id => `propose = "${id}"`).join(' || ')}`,
            sort: '-created',
            expand: 'driver,propose',
        })
    }

    const acceptOffer = async (proposeId: string, offerId: string) => {
        await pb.collection("Propose").update(proposeId, {
            offer: offerId,
            status: 'accepted',
        })
    }
    
    return{
        acceptOffer,
        fetchUserProposes,
        fetchProposeOffers,
        proposes,
        refreshProposes,
        createPropose,
        createOffer,
    }
})
