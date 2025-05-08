import { defineStore } from "pinia";
import PocketBase, { type RecordModel } from 'pocketbase'
import { useIdentity } from "./identity";

const pb = new PocketBase("http://localhost:8090");
const { getAuthUser } = useIdentity()
export type NotificationType = 'negative' | 'positive' | 'neutral'
export interface MutableNotification {
    receiver: string,
    message: string,
    type: NotificationType,
}
export interface ImmutableNotification extends MutableNotification {
    id: string,
    created: string,
    updated: string,
    expand: {
        receiver: string
    }
}
export const useNotification = defineStore('notification', () => {
    const createNotification = async (receiver: string, message: string, type: NotificationType) => {
        const data : MutableNotification = {
            receiver: receiver,
            message: message,
            type: type,
        }
        await pb.collection("Notification").create(data)
    }

    const fetchNotifications = async (id: string, last_seen: string) => {
        console.log(getAuthUser()?.read_notification_at)
        const notifications = await pb.collection("Notification").getFullList({
            filter: `receiver = "${id}" && created >= "${last_seen}"`,
            sort: '-created',
            expand: 'receiver'
        })
        return notifications
    }

    return{
        createNotification,
        fetchNotifications
    }
})
