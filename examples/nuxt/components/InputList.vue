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
    const searchLower = search.value.toLowerCase()
    return user.name.toLowerCase().includes(searchLower)
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
      class-search="list-search"
      class-options="list-options"
      class="input-list">

      <template #values="{ values }">
        <div class="flex flex-wrap flex-nowrap items-center space-x-2">
          <div
            v-for="value in values.slice(0, 2)"
            :key="value.label"
            class="list-value">
            <p class="text-sm">
              {{ value.label }}
            </p>
            <button
              class="list-value-remove"
              @click.prevent="() => value.off()">
              X
            </button>
          </div>

          <div
            v-if="values.length > 2"
            class="list-value">
            <p class="text-sm">
              +{{ values.length - 2 }}
            </p>
          </div>
        </div>
      </template>

      <template #option="{ option, isSelected }">
        <div
          class="list-option"
          :class="{ 'selected': isSelected() }">
          <p class="text-sm">
            {{ option.name }}
          </p>
          <p class="list-option-email">
            {{ option.email }}
          </p>
        </div>
      </template>
    </BaseInputList>

    <!-- Debug value -->
    <pre
      class="list-debug"
      v-text="JSON.stringify(model, null, 2)"
    />

  </div>
</template>

<style scoped>
.input-list {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  position: relative;
  border: 1px solid color-mix(in srgb, var(--color-primary) 50%, transparent);
  padding: 0.5rem;
  border-radius: 0.375rem;
  outline: none;
  gap: 0.5rem;
  cursor: pointer;
  background-color: color-mix(in srgb, var(--color-primary) 10%, var(--color-base));
  transition: all 300ms;
}

.input-list:hover {
  background-color: color-mix(in srgb, var(--color-primary) 15%, var(--color-base));
  border-color: var(--color-primary);
}

.list-search {
  width: 100%;
  border-radius: 0.375rem;
  transition: all 300ms;
  background-color: transparent;
  outline: none;
}

.list-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 15rem;
  overflow-y: auto;
  padding: 0.5rem;
  margin: 0;
  margin-top: 0.5rem;
  border-radius: 0.375rem;
  transition: all 300ms;
  background-color: color-mix(in srgb, var(--color-primary) 15%, var(--color-base));
  border: 1px solid var(--color-primary);
}

.list-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
  padding: 0 0.5rem;
  border-radius: 0.375rem;
  white-space: nowrap;
}

.list-value-remove {
  color: var(--color-primary);
  transition: color 300ms;
}

.list-value-remove:hover {
  color: color-mix(in srgb, var(--color-primary) 80%, white);
}

.list-option {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.list-option:hover {
  background-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.list-option:last-child {
  margin-bottom: 0;
}

.list-option.selected {
  background-color: color-mix(in srgb, var(--color-primary) 25%, transparent);
  font-weight: bold;
}

.list-option-email {
  font-size: 0.75rem;
  color: var(--color-primary);
}

.list-debug {
  font-size: 0.75rem;
  color: white;
  border: 1px solid var(--color-primary);
  padding: 0.5rem;
}
</style>
