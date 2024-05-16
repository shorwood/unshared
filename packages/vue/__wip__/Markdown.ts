import MarkdownIt from 'markdown-it'
import { PropType, computed, defineComponent, h, markRaw, mergeProps } from 'vue-demi'
import { exposeToDevtool } from '../utils'

export default defineComponent({
  name: 'Markdown',
  inheritAttrs: false,
  props: {
    content: { type: String, default: '' },
    options: { type: Object as PropType<MarkdownIt.Options>, default: () => ({}) },
  },
  setup: (props, { attrs }) => {
    // --- Initialize
    const markdownIt = markRaw(computed(() => new MarkdownIt(props.options)))
    const contentHtml = computed(() => markdownIt.value.render(props.content))

    // --- Expose the contentMarkdown to the devtool.
    exposeToDevtool({
      markdownIt,
      contentHtml,
    })

    // --- Return rendered HTML.
    return () => h('div', mergeProps(attrs, {
      innerHTML: contentHtml.value,
    }))
  },
})
