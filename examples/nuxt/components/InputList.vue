<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | string[]
}>()

interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

const model = useVModel(props, 'modelValue')

const multiple = ref(true)
const native = ref(false)
const search = ref('')
const loading = ref(false)
const users = ref<User[]>([])

async function fetchUsers() {
  loading.value = true
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await response.json() as User[]
  users.value = data.filter((user: User) => {
    if (!search.value) return true
    return user.name.toLowerCase().includes(search.value.toLowerCase())
  })
  loading.value = false
}

await fetchUsers()
watchDebounced(search, fetchUsers, { debounce: 500 })
</script>

<template>
  <div class="w-full space-y-4">
    <InputSwitch
      v-model="multiple"
      label="Multiple"
    />

    <InputSwitch
      v-model="native"
      label="Native"
    />

    <BaseInputList
      v-model="model"
      v-model:search="search"
      :native="native"
      :options="users"
      :option-value="x => x.email"
      :option-label="x => x.name"
      :option-filter="(search, x) => x.name.toLowerCase().includes(search.toLowerCase())"
      :multiple="multiple"
      allow-custom-value
      class-search="
        w-full rounded-md
        transition-all duration-300 bg-transparent outline-none
      "
      class-options="
        absolute top-full left-0 w-full max-h-60 overflow-y-auto
        p-2 !mx-0 mt-2 rounded-md transition-all duration-300
        bg-primary-900 border-1 border-primary-500
      "
      class="
        flex flex-nowrap items-center w-full
        relative w-full border-1 p-2 rounded-md outline-none
        gap-2 items-center cursor-pointer
        bg-primary-900/50 hover:bg-primary-900
        border-primary-500/50 hover:border-primary-500
        transition-all duration-300
      ">

      <template #values="{ values }">
        <div class="flex flex-wrap flex-nowrap items-center space-x-2">
          <div
            v-for="value in values.slice(0, 2)"
            :key="value.text"
            class="flex items-center space-x-2 border border-primary-500/20 px-2 rounded-md whitespace-nowrap">
            <p class="text-sm">
              {{ value.text }}
            </p>
            <button
              class="text-primary-500 hover:text-primary-400 transition-colors duration-300"
              @click.prevent="() => value.off()">
              X
            </button>
          </div>

          <div
            v-if="values.length > 2"
            class="flex items-center space-x-2 border border-primary-500/20 px-2 rounded-md whitespace-nowrap">
            <p class="text-sm">
              +{{ values.length - 2 }}
            </p>
          </div>
        </div>
      </template>

      <template #option="{ option, isSelected }">
        <div
          class="flex flex-col items-start last:mb-0 mb-2 hover:bg-primary-800/50 p-2 rounded-md cursor-pointer"
          :class="{ '!bg-primary-800 font-bold': isSelected() }">
          <p class="text-sm">
            {{ option.name }}
          </p>
          <p class="text-xs text-primary-500">
            {{ option.email }}
          </p>
        </div>
      </template>
    </BaseInputList>

    <!-- Debug value -->
    <pre
      class="text-xs text-white border border-primary-500 p-2"
      v-text="JSON.stringify(model, null, 2)"
    />

  </div>
</template>
