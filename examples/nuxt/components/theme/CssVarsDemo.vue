<script setup lang="ts">
// This component demonstrates using CSS variables from ThemeWrapper
</script>

<template>
  <div class="css-vars-demo">
    <h2 class="title">CSS Variables Demo</h2>
    
    <div class="grid">
      <!-- Ultra-short base variables -->
      <div class="card card-base">
        <h3>Base Colors</h3>
        <p>Uses: --color-background, --color-foreground, --color-border</p>
        <code>background: var(--color-background)</code>
      </div>

      <!-- Semantic shortcuts -->
      <div class="card card-primary">
        <h3>Primary</h3>
        <p>Uses: --color-primary-background</p>
        <code>background: var(--color-primary-background)</code>
      </div>

      <div class="card card-success">
        <h3>Success</h3>
        <p>Uses: --color-success-background</p>
        <code>background: var(--color-success-background)</code>
      </div>

      <div class="card card-warning">
        <h3>Warning</h3>
        <p>Uses: --color-warning-background</p>
        <code>background: var(--color-warning-background)</code>
      </div>

      <div class="card card-error">
        <h3>Error</h3>
        <p>Uses: --color-error-background</p>
        <code>background: var(--color-error-background)</code>
      </div>

      <div class="card card-info">
        <h3>Info</h3>
        <p>Uses: --color-info-background</p>
        <code>background: var(--color-info-background)</code>
      </div>

      <!-- Role examples -->
      <div class="card card-surface">
        <h3>Surface</h3>
        <p>Uses: --color-primary-surface-background</p>
        <code>background: var(--color-primary-surface-background)</code>
      </div>

      <div class="card card-default">
        <h3>Default</h3>
        <p>Uses: --color-primary-default-background</p>
        <code>background: var(--color-primary-default-background)</code>
      </div>

      <div class="card card-emphasis">
        <h3>Emphasis</h3>
        <p>Uses: --color-primary-emphasis-background</p>
        <code>background: var(--color-primary-emphasis-background)</code>
      </div>

      <div class="card card-interactive">
        <h3>Interactive</h3>
        <p>Uses: --color-primary-interactive-background</p>
        <code>background: var(--color-primary-interactive-background)</code>
      </div>

      <!-- State examples -->
      <button class="button">
        Hover me!
        <span class="tooltip">Uses hover state variables</span>
      </button>
    </div>

    <div class="documentation">
      <h3>Available CSS Variables</h3>
      <div class="doc-grid">
        <div>
          <h4>1. Full Paths</h4>
          <code>--color-{color}-{role}-{state}-{target}</code>
          <p class="example">Example: --color-primary-interactive-hover-background</p>
        </div>
        <div>
          <h4>2. Default State Shortcuts</h4>
          <code>--color-{color}-{role}-{target}</code>
          <p class="example">Example: --color-primary-interactive-background</p>
        </div>
        <div>
          <h4>3. First Role Shortcuts</h4>
          <code>--color-{color}-{target}</code>
          <p class="example">Example: --color-primary-background</p>
        </div>
        <div>
          <h4>4. Base Shortcuts</h4>
          <code>--color-{target}</code>
          <p class="example">Example: --color-background</p>
        </div>
      </div>
      
      <div class="doc-section">
        <h4>Theme Structure</h4>
        <ul>
          <li><strong>Colors:</strong> base, primary, accent, success, warning, error, info</li>
          <li><strong>Roles:</strong> surface, default, emphasis, interactive</li>
          <li><strong>States:</strong> default, hover, focus, active, disabled</li>
          <li><strong>Targets:</strong> background, foreground, border, muted</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.css-vars-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: var(--color-foreground);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 2px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.card p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.card code {
  display: block;
  font-size: 0.75rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}

/* Card variants using CSS variables */
.card-base {
  background: var(--color-base-surface-background);
  color: var(--color-base-surface-foreground);
  border-color: var(--color-base-surface-border);
}

.card-primary {
  background: var(--color-primary-background);
  color: var(--color-primary-foreground);
  border-color: var(--color-primary-border);
}

.card-success {
  background: var(--color-success-background);
  color: var(--color-success-foreground);
  border-color: var(--color-success-border);
}

.card-warning {
  background: var(--color-warning-background);
  color: var(--color-warning-foreground);
  border-color: var(--color-warning-border);
}

.card-error {
  background: var(--color-error-background);
  color: var(--color-error-foreground);
  border-color: var(--color-error-border);
}

.card-info {
  background: var(--color-info-background);
  color: var(--color-info-foreground);
  border-color: var(--color-info-border);
}

.card-surface {
  background: var(--color-primary-surface-background);
  color: var(--color-primary-surface-foreground);
  border-color: var(--color-primary-surface-border);
}

.card-default {
  background: var(--color-primary-default-background);
  color: var(--color-primary-default-foreground);
  border-color: var(--color-primary-default-border);
}

.card-emphasis {
  background: var(--color-primary-emphasis-background);
  color: var(--color-primary-emphasis-foreground);
  border-color: var(--color-primary-emphasis-border);
}

.card-interactive {
  background: var(--color-primary-interactive-background);
  color: var(--color-primary-interactive-foreground);
  border-color: var(--color-primary-interactive-border);
}

/* Button with state variables */
.button {
  position: relative;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s;
  
  /* Default state */
  background: var(--color-primary-interactive-default-background);
  color: var(--color-primary-interactive-default-foreground);
  border-color: var(--color-primary-interactive-default-border);
}

.button:hover {
  /* Hover state */
  background: var(--color-primary-interactive-hover-background);
  color: var(--color-primary-interactive-hover-foreground);
  border-color: var(--color-primary-interactive-hover-border);
}

.button:active {
  /* Active state */
  background: var(--color-primary-interactive-active-background);
  color: var(--color-primary-interactive-active-foreground);
  border-color: var(--color-primary-interactive-active-border);
}

.button:focus {
  /* Focus state */
  outline: 2px solid var(--color-primary-interactive-focus-border);
  outline-offset: 2px;
}

.button:disabled {
  /* Disabled state */
  background: var(--color-primary-interactive-disabled-background);
  color: var(--color-primary-interactive-disabled-foreground);
  border-color: var(--color-primary-interactive-disabled-border);
  cursor: not-allowed;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: var(--color-base-emphasis-background);
  color: var(--color-base-emphasis-foreground);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  margin-bottom: 0.5rem;
}

.button:hover .tooltip {
  opacity: 1;
}

/* Documentation section */
.documentation {
  padding: 2rem;
  background: var(--color-base-surface-background);
  border: 2px solid var(--color-base-surface-border);
  border-radius: 0.5rem;
}

.documentation h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: var(--color-foreground);
}

.doc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.doc-grid h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--color-primary-foreground);
  background: var(--color-primary-surface-background);
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.doc-grid code {
  display: block;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  word-break: break-word;
}

.doc-grid .example {
  font-size: 0.875rem;
  opacity: 0.7;
  font-style: italic;
  margin: 0.5rem 0 0 0;
}

.doc-section {
  padding: 1.5rem;
  background: var(--color-primary-surface-background);
  border-radius: 0.5rem;
}

.doc-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: var(--color-primary-foreground);
}

.doc-section ul {
  margin: 0;
  padding-left: 1.5rem;
  list-style: disc;
}

.doc-section li {
  margin: 0.5rem 0;
  color: var(--color-foreground);
}
</style>
