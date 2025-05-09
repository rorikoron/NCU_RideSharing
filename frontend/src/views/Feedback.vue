<script setup lang="ts">
import ProposeCard from "@/components/ProposeCard.vue";
import UserSummary from "@/components/UserSummary.vue";
import {
  usePocketbaseStore,
  type ImmutableOffer,
  type ImmutablePropose,
  type ProposeStatus,
} from "@/stores/pocketbase";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const { fetchUserProposes, fetchProposeOffers, acceptOffer } =
  usePocketbaseStore();
const proposes = ref<ImmutablePropose[]>([]);
const offers = ref<ImmutableOffer[]>([]);

const statusMap: Record<ProposeStatus, string> = {
  pending: "待選擇",
  accepted: "待評分",
  completed: "已完成",
  cancelled: "已取消",
};

// query parameter used for paging
const route = useRoute();
const page = Number(route.query.page ?? 1) as number;

const handleAcceptOffer = async (proposeId: string, offerId: string) => {
  try {
    await acceptOffer(proposeId, offerId);
    await refreshOffers();
  } catch (error) {
    console.log(error);
  }
};

const refreshOffers = async () => {
  // ATTENTION: here should implement the ID of user
  proposes.value = await fetchUserProposes("748lod0038buwzd", page);
  const offerDelegates = proposes.value.map(({ id }) => id);
  offers.value = await fetchProposeOffers(offerDelegates);
};

onMounted(async () => {
  await refreshOffers();
});
</script>

<template>
  <div v-for="propose in proposes" :key="propose.id" class="q-gutter-y-sm">
    <span class="text-h6">
      {{ propose.departure.substring(0, 16).replace(/-/g, "/") }}
      <span
        :class="{
          'text-primary': propose.status==='pending',
          'text-positive':    propose.status==='accepted',
          'text-active': propose.status==='completed',
          'text-negative': propose.status==='cancelled'
        }"
        :style = "{
          border: '1px solid currentColor',
          borderRadius: '12px',
          padding: '2px 8px',
          marginLeft: '8px',
          backgroundColor: '#f5f5f5',
          fontSize: '0.85em',
          fontWeight: '500',
          display: 'inline-block'
        }"
      >
        {{ statusMap[propose.status] }}
      </span>
      
    </span>
    <q-card class="row q-mb-md" flat bordered>
      <ProposeCard :propose="propose" :bordered="false" />
      <q-separator vertical inset />
      <q-list class="col-9 q-pa-sm">
        <q-item
          v-for="(offer, i) in offers.filter((o) => propose.id === o.propose)"
          dense
        >
          <q-separator v-if="i != 0" inset />
          <q-item-section class="col-3" avatar>
            <UserSummary :user="offer.expand!.driver" />
          </q-item-section>
          <q-item-section>{{ offer.price }}元</q-item-section>
          <q-item-section>備註：{{ offer?.appendix }}</q-item-section>
          <q-item-section side>
            <q-btn
              v-if="propose.status === 'pending'"
              @click="handleAcceptOffer(propose.id, offer.id)"
              label="接受"
              rounded
              outline
              color="primary"
            />
            <q-icon
              v-if="propose.status !== 'pending' && propose.offer === offer.id"
              name="check"
              color="primary"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>
