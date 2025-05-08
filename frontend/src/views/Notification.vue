<script setup lang="ts">
import { useIdentity } from "@/stores/identity";
import { useNotification } from "@/stores/notification";
import { onMounted } from "vue";

const { fetchNotifications } = useNotification();
const { getAuthUser } = useIdentity();
onMounted(async () => {
  const { id, created } = getAuthUser()!;
  console.log(await fetchNotifications(id, created));
});
</script>
