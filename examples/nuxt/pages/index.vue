<script setup lang="ts">
import { ref } from 'vue'
import { dedent } from '@unshared/string/dedent'
import InputText from '../components/InputText.vue'
import ColorSwatches from '../components/theme/ColorSwatches.vue'

const values = [
  { label: 'Cooking', value: 'cooking' },
  { label: 'Reading', value: 'reading' },
  { label: 'Running', value: 'running' },
]

const valueSwitch = ref(false)
const valueRadio = ref('cooking')
const valueCheckbox = ref(['cooking'])
const valueList = ref(['TEST', 'Sincere@april.biz'])
const valueText = ref<string>('Hello, <b>World</b>!')
const valueEditor = ref(dedent(`
  program odd_even
  implicit none
  integer :: number

  ! Read or attribute value to number before test
  read*,number
      if (MOD(number,2) .eq. 0) then
          print*, 'number is even.'
          ELSE
          print*,'number is odd'
      end if

  end program odd_even
`))
</script>

<template>
  <ThemeWrapper>
    <ThemePanel />
    
    <div class="w-screen min-h-screen flex items-center justify-center pb-48 pt-32">
      <main class="grid grid-cols-2 gap-4 items-center justify-stretch max-w-3xl mx-auto my-24">

      <!-- Swatches -->
      <ColorSwatches class="col-span-2"/>


      <!-- Checkbox -->
      <Card title="Checkbox">
        <InputCheckbox
          v-for="value in values"
          :key="value.value"
          v-model="valueCheckbox"
          :label="value.label"
          :value="value.value"
        />
      </Card>

      <!-- Radio -->
      <Card title="Radio">
        <InputRadio
          v-for="value in values"
          :key="value.value"
          v-model="valueRadio"
          :label="value.label"
          :value="value.value"
        />
      </Card>

      <!-- Switch -->
      <Card title="Switch">
        <InputSwitch
          v-model="valueSwitch"
          label="Switch"
        />
      </Card>

      <!-- Progress -->
      <Card title="Progress">
        <Progress
          :value="100"
          message="Downloading..."
        />
      </Card>

      <!-- Editor -->
      <Card class="col-span-2" title="Editor">
        <div class="w-full">
          <InputEditor v-model="valueEditor" />
        </div>
      </Card>

      <!-- File -->
      <Card class="col-span-2" title="File">
        <InputFile />
      </Card>

      <!-- List -->
      <Card class="col-span-2" title="List">
        <InputList v-model="valueList" />
      </Card>

      <!-- Input Text -->
      <Card class="col-span-2" title="Input Text">
        <InputText
          v-model="valueText"
          :parse="(value) => value.toUpperCase()"
          :serialize="(value) => value.toLowerCase()"
        />
      </Card>

      <!-- Content Editable -->
      <Card class="col-span-2" title="Content Editable">
        <ContentEditable v-model="valueText" />
      </Card>

      <!-- Context Menu -->
      <Card class="col-span-2" title="Context Menu">
        <ContextMenu>
          <BaseButton class="p-4">
            Right
            <b>click</b> me!
          </BaseButton>
        </ContextMenu>
      </Card>

      <!-- Buttons -->
      <Card class="col-span-2" title="Buttons">
        <div class="flex flex-col gap-4">
          <!-- Primary Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <Button variant="primary" size="sm" label="Small" />
            <Button variant="primary" size="md" label="Medium" />
            <Button variant="primary" size="lg" label="Large" />
          </div>

          <!-- Secondary Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm" label="Small" />
            <Button variant="secondary" size="md" label="Medium" />
            <Button variant="secondary" size="lg" label="Large" />
          </div>

          <!-- Accent Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <Button variant="accent" size="sm" label="Small" />
            <Button variant="accent" size="md" label="Medium" />
            <Button variant="accent" size="lg" label="Large" />
          </div>

          <!-- Ghost Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" label="Small" />
            <Button variant="ghost" size="md" label="Medium" />
            <Button variant="ghost" size="lg" label="Large" />
          </div>
        </div>
      </Card>

      <!-- Interactive Demo -->
      <Card class="col-span-2" title="V2 Theme System Demo">
        <div class="space-y-4">
          <p class="text-sm opacity-80">
            The V2 theme system uses perceptually uniform OKLCH colors with chroma-based visual hierarchy.
            All colors are accessible via CSS variables for easy customization!
          </p>

          <div class="grid grid-cols-3 gap-4">
            <!-- Interactive Demo -->
            <div class="demo-card demo-interactive">
              <h4 class="demo-title">INTERACTIVE</h4>
              <p class="demo-text">Hover me!</p>
            </div>

            <!-- Muted Demo -->
            <div class="demo-card demo-muted">
              <h4 class="demo-title">MUTED</h4>
              <p class="demo-text">Subtle variant</p>
            </div>

            <!-- Emphasis Demo -->
            <div class="demo-card demo-emphasis">
              <h4 class="demo-title">EMPHASIS</h4>
              <p class="demo-text">High impact</p>
            </div>
          </div>

          <div class="text-xs opacity-60 space-y-1">
            <p><strong>V2 Features:</strong> Mathematical color harmony, WCAG-compliant contrast, chroma-based hierarchy</p>
            <p><strong>CSS Variables:</strong> 724 variables covering all semantic colors, intensities, and states</p>
            <NuxtLink to="/css-vars" class="text-primary-fg underline">View CSS Variables Documentation →</NuxtLink>
          </div>
        </div>
      </Card>

      <!-- Color Swatches -->
      <Card class="col-span-2" title="Complete Theme Palette">
      </Card>
    </main>
    </div>
  </ThemeWrapper>
</template>

<style scoped>
/* Demo card styles using V2 CSS variables */
.demo-card {
  padding: 1rem;
  cursor: pointer;
  border: 2px solid;
}

.demo-title {
  font-size: 0.75rem;
  font-weight: bold;
  opacity: 0.6;
  margin-bottom: 0.5rem;
}

.demo-text {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Interactive intensity - for buttons and clickable elements */
.demo-interactive {
  background-color: var(--color-primary-interactive-bg);
  color: var(--color-primary-interactive-fg);
  border-color: var(--color-primary-interactive-border);
}

.demo-interactive:hover {
  background-color: var(--color-primary-interactive-hover-bg);
  color: var(--color-primary-interactive-hover-fg);
  border-color: var(--color-primary-interactive-hover-border);
}

.demo-interactive:active {
  background-color: var(--color-primary-interactive-active-bg);
  color: var(--color-primary-interactive-active-fg);
  border-color: var(--color-primary-interactive-active-border);
}

/* Muted intensity - for secondary content */
.demo-muted {
  background-color: var(--color-primary-muted-bg);
  color: var(--color-primary-muted-fg);
  border-color: var(--color-primary-muted-border);
}

.demo-muted:hover {
  background-color: var(--color-primary-muted-hover-bg);
  color: var(--color-primary-muted-hover-fg);
  border-color: var(--color-primary-muted-hover-border);
}

/* Emphasis intensity - for important highlights */
.demo-emphasis {
  background-color: var(--color-primary-emphasis-bg);
  color: var(--color-primary-emphasis-fg);
  border-color: var(--color-primary-emphasis-border);
}

.demo-emphasis:hover {
  background-color: var(--color-primary-emphasis-hover-bg);
  color: var(--color-primary-emphasis-hover-fg);
  border-color: var(--color-primary-emphasis-hover-border);
}
</style>
