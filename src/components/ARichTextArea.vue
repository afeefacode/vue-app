<template>
  <div :class="['a-rich-text-editor a-text-input', {'a-text-input-focused': focus}]">
    <div v-if="editor">
      <a-icon-button
        :class="['menu-button', {'is-active': editor.isActive('bold')}]"
        :icon="boldIcon"
        @click="editor.chain().focus().toggleBold().run()"
      />

      <a-icon-button
        :icon="italicIcon"
        :class="['menu-button', {'is-active': editor.isActive('italic')}]"
        @click="editor.chain().focus().toggleItalic().run()"
      />

      <button
        type="button"
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        strike
      </button>
    </div>

    <editor-content
      :editor="editor"
      :class="['a-rich-text-editor', {focus}]"
    />
  </div>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import { mdiFormatBold, mdiFormatItalic } from '@mdi/js'

@Component({
  props: ['value', 'validator'],
  components: {
    EditorContent
  }
})
export default class ARichTextArea extends Vue {
  editor = null
  internalValue = null
  focus = false

  boldIcon = mdiFormatBold
  italicIcon = mdiFormatItalic

  created () {
    this.internalValue = this.value
  }

  mounted () {
    if (this.validator) {
      this.$refs.input.validate(true)
    }

    this.editor = new Editor({
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit
      ],
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML())
      },
      onFocus: ({ editor, event }) => {
        this.focus = true
      },
      onBlur: ({ editor, event }) => {
        this.focus = false
      }
    })

    this.editor.commands.setContent(this.internalValue, false)
  }

  beforeDestroy () {
    this.editor.destroy()
  }

  @Watch('value')
  valueChanged () {
    this.internalValue = this.value

    const isSame = this.editor.getHTML() === this.internalValue
    if (!isSame) {
      this.editor.commands.setContent(this.internalValue, false)
    }
  }

  get validationRules () {
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
  }

  get counter () {
    if (!this.validator) {
      return false
    }
    return this.validator.getParams().max || false
  }
}
</script>


<style lang="scss" scoped>
.v-input:not(.v-input--is-focused) ::v-deep .v-counter {
  display: none;
}

.a-rich-text-editor {
  ::v-deep .ProseMirror {
    &-focused {
      outline: none;
    }
  }
}

.menu-button {
  padding: 0 !important;
  width: 30px !important;
  min-width: unset !important;
  text-align: center;

  ::v-deep svg {
    width: unset;
  }

  &.is-active {
    background: #CCCCCC !important;
  }
}
</style>
