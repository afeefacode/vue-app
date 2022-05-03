<template>
  <div :class="['a-rich-text-editor a-text-input', {'a-text-input-focused': focus}]">
    <div
      v-if="editor"
      class="menu-bar"
    >
      <v-btn
        small
        :class="['menu-button', {'is-active': focus && editor.isActive('bold')}]"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <v-icon>{{ boldIcon }}</v-icon>
      </v-btn>

      <v-btn
        small
        :class="['menu-button', {'is-active': focus && editor.isActive('italic')}]"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <v-icon>{{ italicIcon }}</v-icon>
      </v-btn>

      <v-btn
        small
        :class="['menu-button', 'strike', {'is-active': focus && editor.isActive('strike')}]"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <v-icon>{{ strikeIcon }}</v-icon>
      </v-btn>

      <v-btn
        small
        :class="['menu-button', {'is-active': focus && editor.isActive('heading', {level: 1})}]"
        @click="editor.chain().focus().toggleHeading({level: 1}).run()"
      >
        <v-icon>{{ h1Icon }}</v-icon>
      </v-btn>

      <v-btn
        small
        :class="['menu-button', {'is-active': focus && editor.isActive('heading', {level: 2})}]"
        @click="editor.chain().focus().toggleHeading({level: 2}).run()"
      >
        <v-icon>{{ h2Icon }}</v-icon>
      </v-btn>

      <v-btn
        small
        :class="['menu-button', {'is-active': focus && editor.isActive('bulletList')}]"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <v-icon>{{ ulIcon }}</v-icon>
      </v-btn>

      <v-btn
        small
        :class="['menu-button', {'is-active': focus && editor.isActive('orderedList')}]"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <v-icon>{{ olIcon }}</v-icon>
      </v-btn>

      <v-btn
        small
        :class="['menu-button', {'is-active': focus && editor.isActive('blockquote')}]"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <v-icon>{{ commentIcon }}</v-icon>
      </v-btn>

      <v-btn
        small
        class="menu-button"
        @click="editor.chain().focus().undo().run()"
      >
        <v-icon>{{ undoIcon }}</v-icon>
      </v-btn>

      <v-btn
        small
        class="menu-button"
        @click="editor.chain().focus().redo().run()"
      >
        <v-icon>{{ redoIcon }}</v-icon>
      </v-btn>
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
import {
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethroughVariant,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatQuoteClose,
  mdiRotateLeft,
  mdiRotateRight
} from '@mdi/js'

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
  strikeIcon = mdiFormatStrikethroughVariant
  h1Icon = mdiFormatHeader1
  h2Icon = mdiFormatHeader2
  ulIcon = mdiFormatListBulleted
  olIcon = mdiFormatListNumbered
  commentIcon = mdiFormatQuoteClose
  undoIcon = mdiRotateLeft
  redoIcon = mdiRotateRight

  created () {
    this.internalValue = this.value
  }

  mounted () {
    if (this.validator) {
      this.$refs.input.validate(true)
    }

    this.editor = new Editor({
      content: this.internalValue,
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

.menu-bar {
  margin: -.2rem 0 .5rem -.2rem;
}

.menu-button {
  padding: 0 !important;
  width: 30px !important;
  height: 32px !important;
  min-width: unset !important;
  text-align: center;
  font-size: 1rem;
  background: white !important;
  border: none;
  box-shadow: none;
  border-radius: 0;

  ::v-deep .v-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  &.strike {
    ::v-deep .v-icon {
      width: 15px;
    }
  }

  svg {
    width: unset;
  }

  &.is-active {
    background: #ECECEC !important;
  }
}

::v-deep .ProseMirror {
  min-height: 200px;

  > :last-child {
    margin: 0;
  }

  li p {
    margin: 0;
  }

  ul {
    margin: 16px 0;
  }
}
</style>