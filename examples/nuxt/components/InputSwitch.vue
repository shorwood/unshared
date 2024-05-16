<script setup lang="ts">
const props = defineProps<{
  id?: string
  label?: string
  value?: string
  modelValue?: boolean
}>()

const model = useVModel(props, 'modelValue')
</script>

<template>
  <!-- Input -->
  <BaseInputToggle
    as="div"
    :id="id"
    v-slot="{ isActive }"
    v-model="model"
    type="switch"
    class="
      flex items-center space-x-2 px-2
      hover:bg-primary-600/10 active:bg-primary-600/20
      ring-1 ring-primary-900/10 hover:ring-primary-600/100
      transition-all duration-200 ease-in-out
      px-4 py-2 rounded-lg
    "
    class-active="bg-primary-600/20">

    <!-- Circle when active -->
    <div
      class="
        rounded-lg w-8 h-4 relative
        bg-primary-600 p-1 flex items-center
      ">
      <div
        class="
         bg-white rounded-md w-3 h-3 transform
          transition-all duration-200 ease-in-out
        "
        :class="{
          'translate-x-3': isActive,
          'translate-x-0': !isActive,
        }"
      />

    </div>

    <!-- Label -->
    <label :for="id" v-if="label" class="text-sm select-none">
      {{ label }}
    </label>
  </BaseInputToggle>
</template>
