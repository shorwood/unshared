<script setup lang="ts">
const props = defineProps<{
  id?: string
  label?: string
  value?: string
  modelValue?: string[]
}>()

const model = useVModel(props, 'modelValue')
</script>

<template>
  <!-- Input -->
  <BaseInputToggle
    :id="id"
    v-slot="{ isActive }"
    v-model="model"
    as="div"
    :value="value"
    class-active="bg-primary-600/20"
    type="checkbox"
    class="
      flex items-center space-x-2 px-2
      hover:bg-primary-600/10
      ring-1 ring-primary-900/10 hover:ring-primary-600/100
      transition-all duration-200 ease-in-out
      px-4 py-2 rounded-md
    ">

    <!-- Circle when active -->
    <div
      class="rounded-sm w-4 h-4 relative p-.5 flex items-center justify-center transition-all duration-200 ease-in-out"
      :class="{
        'ring-1 ring-primary-600/20': isActive === false,
        'bg-primary-600/80': isActive === true,
      }">
      <i v-if="isActive === true" class="i-carbon:checkmark text-white" />
      <i v-if="isActive === 'mixed'" class="i-carbon:close text-white" />
    </div>

    <!-- Label -->
    <label v-if="label" :for="id" class="text-sm select-none" >
      {{ label }}
    </label>
  </BaseInputToggle>
</template>
