import axios from 'axios'
import { ref } from 'vue'

export default function useNavigation() {
  const token = localStorage.getItem('token')
  const itemsFromStorage = JSON.parse(localStorage.getItem('navigation'))

  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

  const navigationItems = ref(itemsFromStorage)

  const toggleMenu = async (slug: string) => {
    await Array.from(
      document.getElementsByClassName('sidebar-dropdown open')
    ).forEach((e: Element) => {
      if (!e.classList.contains('menu-' + slug + '-items')) {
        e.classList.remove('open')
        // loop through all children and remove potential active states as well
        Array.from(e.getElementsByClassName('active')).forEach((child) => {
          child.classList.remove('active')
        })
      }
    })

    Array.from(
      document.getElementsByClassName('menu-' + slug + '-items')
    ).forEach((e: Element) => {
      e.classList.add('open')
    })
  }

  const getNavigationItems = async (): Promise<void> => {
    await axios
      .get('/api/admin_navigations')
      .then((response) => {
        navigationItems.value = response.data.data
        localStorage.setItem('navigation', JSON.stringify(response.data.data))
      })
      .catch((error) => {
        console.error('HANDLE THIS', error)
      })
  }

  if (itemsFromStorage === null) {
    getNavigationItems()
  }

  return {
    navigationItems,
    toggleMenu,
  }
}
