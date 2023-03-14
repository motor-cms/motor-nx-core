import {ref} from "vue";

const navbarSlot = ref(null);
export function useTeleport() {

    return {
        navbarSlot
    }
}
