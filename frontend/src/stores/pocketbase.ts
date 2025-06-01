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
    headcount_limit: number,
    is_commission: boolean,
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
export interface MutableParticipant{
    propose: string,
    participant: string,
    headcount: number,
}
export interface ImmutableParticipant extends MutableParticipant{
    id: string,
    is_proponent: boolean,
    expand: {
        proponent: ImmutablePropose,
        participant: User,
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

    // let user search propose in filter bar
    const filterProposes = async (isDriver?: boolean, filter?: {
        origin?: string
        arrival?: string
        date?: string
        time?: string
        }) => {
        const filterQuery = []

        if (isDriver) {
            filterQuery.push('is_commision = true')
        }

        if (filter?.origin) {
            filterQuery.push(`origin ~ "${filter.origin}"`) 
        }

        if (filter?.arrival) {
            filterQuery.push(`arrival ~ "${filter.arrival}"`) 
        }

        if (filter?.date) {
            filterQuery.push(`departure ~ "${filter.date}   "`); 
        }

        if (filter?.time) {
            // more detail time comparation
            filterQuery.push(`departure ~ "${filter.time}"`);
        }

        const finalFilter = filterQuery.join(' && ');

        proposes.value = await pb.collection("Propose").getFullList({
            sort: '-created',
            filter: finalFilter,
            expand: 'proponent'
        })
    }


    const refreshProposes = async (isDriver?: boolean) => {
        proposes.value = await pb.collection("Propose").getFullList({
            sort: 'created',
            filter: isDriver ? 'is_commision = true' : '',
            expand: 'proponent'
        });
    }

    const createPropose = async (propose: FormData) => {
        return await pb.collection("Propose").create(propose)
    }

    const createParticipant = async (participant: FormData) => {
        await pb.collection("Participant").create(participant)
    }

    /* combine these function to one to join with propose(Go custom hook) */
    const fetchParticipant = async (proposesId: string) : Promise<any> => {
        return await pb.collection("Participant").getFullList({
            filter: `propose = "${proposesId}"`,
            requestKey: null
        })
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
        fetchParticipant,
        fetchProposeOffers,
        proposes,
        filterProposes,
        refreshProposes,
        createPropose,
        createParticipant,
        createOffer,
    }
})
