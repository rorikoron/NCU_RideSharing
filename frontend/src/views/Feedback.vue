<script setup lang="ts">
import ProposeCard from "@/components/ProposeCard.vue";
import UserSummary from "@/components/UserSummary.vue";
import {
  usePocketbaseStore,
  type Offer,
  type Propose,
} from "@/stores/pocketbase";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const { fetchUserProposes, fetchProposeOffers, acceptOffer } =
  usePocketbaseStore();
const proposes = ref<Propose[]>([]);
const offers = ref<Offer[]>([]);

// query parameter used for paging
const route = useRoute();
const page = Number(route.query.page ?? 1) as number;

const handleAcceptOffer = async (proposeId: string, offer: Offer) => {
  try {
    await acceptOffer(proposeId, offer);
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  // ATTENTION: here should implement the ID of user
  proposes.value = await fetchUserProposes("748lod0038buwzd", page);
  const offerDelegates = proposes.value.map(({ id }) => id ?? "");
  offers.value = await fetchProposeOffers(offerDelegates);
});
</script>

<template>
  <div v-for="propose in proposes" :key="propose.id" class="q-gutter-y-sm">
    <span class="text-h6">
      {{ propose.departure.substring(0, 16).replace(/-/g, "/") }}
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
              @click="handleAcceptOffer(propose.id ?? '', offer)"
              label="接受"
              rounded
              outline
              color="primary"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>
