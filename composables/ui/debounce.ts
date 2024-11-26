
import { computed} from "vue";

export function useDebounce(millis: number, reactive: any ,property: string = '', immediate = false) {

    const debounce = (fn, delay = 0, immediate = false) => {
        let timeout
        return (...args) => {
            if (immediate && !timeout) fn(...args)
            clearTimeout(timeout)

            timeout = setTimeout(() => {
                fn(...args)
            }, delay)
        }
    }

    const debouncedInput = computed({
        // getter
        get() {
            if (!property.length) {
                return reactive.value
            }
            return reactive.value[property]
        },
        // setter
        set: debounce(
            newValue => {
                if (!property.length) {
                    reactive.value = newValue
                } else {
                    reactive.value[property] = newValue
                }
            },
            millis,
            immediate
        )
    })

    return {
        debouncedInput
    }
}
