/* eslint-disable unicorn/no-null */
import { IconifyIconCustomisations } from '@iconify/iconify'
import { debounce, noop, throttle } from '@unshared/functions'
import { useVModel } from '@vueuse/core'
import { PropType, computed, defineComponent, h, mergeProps, resolveComponent } from 'vue-demi'
import { RouteLocationRaw } from 'vue-router'
import { exposeToDevtool, resolveComponentType } from '../utils'
import Icon from './Icon'

export default defineComponent({
  name: 'Button',
  inheritAttrs: false,
  props: {
    // --- Options.
    as: { type: String as PropType<keyof HTMLElementTagNameMap>, default: 'button' },
    label: String,

    // --- State.
    disabled: Boolean,
    readonly: Boolean,
    loading: Boolean,
    error: String,

    // --- Icon
    icon: String,
    iconAppend: String,
    iconPrepend: String,
    iconOptions: Object as PropType<IconifyIconCustomisations>,

    // --- Routing
    to: [String, Object] as PropType<RouteLocationRaw>,
    replace: Boolean,
    newtab: Boolean,

    // --- Interaction
    onClick: { type: Function, default: noop },
    debounce: { type: Number, default: 0 },
    throttle: { type: Number, default: 0 },

    // --- Classes.
    classActive: {} as PropType<unknown>,
    classActiveExact: {} as PropType<unknown>,
    classIcon: {} as PropType<any>,
  },
  emits: [
    'update:disabled',
    'update:readonly',
    'update:loading',
    'update:error',
  ],
  setup: (props, { attrs, emit, slots }) => {
    // --- Compute states variables.
    const modelLoading = useVModel(props, 'loading', emit, { passive: true })
    const modelError = useVModel(props, 'error', emit, { passive: true })

    // --- Compute routing variables.
    const isLink = computed(() => props.to !== undefined)
    const isExternalLink = computed(() => isLink.value && typeof props.to === 'string' && !props.to?.startsWith('/'))
    const isInternalLink = computed(() => isLink.value && !isExternalLink.value)

    // --- Compute component type.
    const is = computed(() => {
      if (isInternalLink.value) return resolveComponent('RouterLink')
      if (isExternalLink.value) return 'a'
      return resolveComponentType(props.as)
    })

    // --- Wrap function to handle loading state & catch error.
    const onClickWrapped = computed(() => {
      const onClick = () => {
        const result = props.onClick()
        if (result instanceof Promise) {
          modelLoading.value = true
          result
            .catch(error => modelError.value = error)
            .finally(() => modelLoading.value = false)
        }
      }

      // --- Return wrapped function.
      if (props.throttle > 0) return throttle(onClick, props.throttle)
      if (props.debounce > 0) return debounce(onClick, props.debounce)
      return onClick
    })

    // --- Expose to Vue Devtools for debugging.
    const slotProperties = exposeToDevtool({
      is,
      isExternalLink,
      isInternalLink,
      isLink,
      modelError,
      modelLoading,
      onClickWrapped,
    })

    // --- Return virtual DOM node.
    // eslint-disable-next-line sonarjs/cognitive-complexity
    return () => {
      // --- Decompose icon props.
      const iconAppend = props.iconAppend
      const iconPrepend = props.icon ?? props.iconPrepend
      const iconProperties = { options: props.iconOptions, class: props.classIcon }

      // --- Create child nodes.
      const vNodeContent = slots.default?.(slotProperties) ?? (props.label && h('span', props.label))
      const vNodeAppend = slots.append?.(slotProperties) ?? (iconAppend && h(Icon, { icon: iconAppend, ...iconProperties }))
      const vNodePrepend = slots.prepend?.(slotProperties) ?? (iconPrepend && h(Icon, { icon: iconPrepend, ...iconProperties }))

      // --- Compute internal link props.
      const isInternalLinkProperties = isInternalLink.value ? {
        'to': props.to,
        'active-class': props.classActive,
        'exact-active-class': props.classActiveExact,
      } : {}

      // --- Compute external link props.
      const isExternalLinkProperties = isExternalLink.value ? {
        href: props.to,
        rel: props.newtab ? 'noreferrer' : attrs.rel,
      } : {}

      // --- Compute button props.
      const isLinkProperties = isLink.value ? {
        target: props.newtab ? '_blank' : attrs.target,
      } : {}

      const buttonProperties = mergeProps(attrs, {
        'disabled': props.disabled || null,
        'readonly': props.readonly || null,
        'aria-disabled': props.disabled || null,
        'aria-readonly': props.readonly || null,
        'aria-busy': modelLoading.value || null,
        'aria-labelledby': props.label,
        'onClick': onClickWrapped.value,
        ...isInternalLinkProperties,
        ...isExternalLinkProperties,
        ...isLinkProperties,
      })

      // --- Create and return VNode.
      return h(
        is.value,
        buttonProperties,
        { default: () => [vNodePrepend, vNodeContent, vNodeAppend] },
      )
    }
  },
})
