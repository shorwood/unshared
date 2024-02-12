import { UseFirebaseOptions, useFirebase } from '@hsjm/fireworks'
import { Plugin } from '@nuxt/types'

export default function(nuxtContext) {
  const firebasePublicConfig = nuxtContext.$config.public.hsjmFirebase

  // --- Setup firebase if enabled
  if (firebasePublicConfig) useFirebase(firebasePublicConfig)
} as Plugin

declare module '@nuxt/types' {
  interface NuxtRuntimeConfig {
    hsjm: {
      firebase: UseFirebaseOptions
    }
  }
}
