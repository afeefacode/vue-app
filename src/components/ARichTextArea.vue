<template>
  <div :class="['a-rich-text-editor a-text-input', {'a-text-input-focused': focus}]">
    <div
      v-if="editor"
      class="menu-bar"
    >
      <div>
        <v-btn
          small
          :class="['menu-button', {'is-active': focus && editor.isActive('bold')}]"
          title="fett"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <v-icon>{{ boldIcon }}</v-icon>
        </v-btn>

        <v-btn
          small
          :class="['menu-button', {'is-active': focus && editor.isActive('italic')}]"
          title="kursiv"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <v-icon>{{ italicIcon }}</v-icon>
        </v-btn>

        <v-btn
          small
          :class="['menu-button', 'strike', {'is-active': focus && editor.isActive('strike')}]"
          title="durchgestrichen"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <v-icon>{{ strikeIcon }}</v-icon>
        </v-btn>

        <v-btn
          small
          :class="['menu-button', {'is-active': focus && editor.isActive('heading', {level: 1})}]"
          title="überschrift 1"
          @click="editor.chain().focus().toggleHeading({level: 1}).run()"
        >
          <v-icon>{{ h1Icon }}</v-icon>
        </v-btn>

        <v-btn
          small
          :class="['menu-button', {'is-active': focus && editor.isActive('heading', {level: 2})}]"
          title="pberschrift 2"
          @click="editor.chain().focus().toggleHeading({level: 2}).run()"
        >
          <v-icon>{{ h2Icon }}</v-icon>
        </v-btn>

        <v-btn
          small
          :class="['menu-button', {'is-active': focus && editor.isActive('bulletList')}]"
          title="punkt-liste"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <v-icon>{{ ulIcon }}</v-icon>
        </v-btn>

        <v-btn
          small
          :class="['menu-button', {'is-active': focus && editor.isActive('orderedList')}]"
          title="nummerierte liste"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <v-icon>{{ olIcon }}</v-icon>
        </v-btn>

        <v-btn
          small
          :class="['menu-button', {'is-active': focus && editor.isActive('blockquote')}]"
          title="zitat"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <v-icon>{{ commentIcon }}</v-icon>
        </v-btn>

        <v-btn
          small
          class="menu-button"
          :class="{ 'is-active': editorSelectionIs('#0000FF')}"
          title="blau"
          color="blue--text"
          @click="editorSelectionIs('#0000FF') ? editor.chain().focus().unsetColor().run() : editor.chain().focus().setColor('#0000FF').run()"
        >
          <v-icon>$paletteIcon</v-icon>
        </v-btn>

        <v-btn
          small
          class="menu-button"
          :class="{ 'is-active': editorSelectionIs('#FF0000')}"
          title="rot"
          color="red--text"
          @click="editorSelectionIs('#FF0000') ? editor.chain().focus().unsetColor().run() : editor.chain().focus().setColor('#FF0000').run()"
        >
          <v-icon>$paletteIcon</v-icon>
        </v-btn>

        <v-btn
          small
          class="menu-button undo-button"
          :disabled="initialValue === editor.getHTML()"
          title="rückgängig"
          @click="editor.chain().focus().undo().run()"
        >
          <v-icon>{{ undoIcon }}</v-icon>
        </v-btn>
      </div>


      <div>
        <slot name="buttons" />
      </div>
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
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

@Component({
  props: ['value', 'validator'],
  components: {
    EditorContent
  }
})
export default class ARichTextArea extends Vue {
  editor = null
  internalValue = null
  initialValue = null
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
    this.initialValue = this.value
    this.internalValue = this.value
  }

  mounted () {
    if (this.validator) {
      this.$refs.input.validate(true)
    }

    this.editor = new Editor({
      content: this.internalValue,
      extensions: [
        StarterKit,
        TextStyle,
        Color
      ],
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML())
      },
      onFocus: ({ editor, event }) => {
        this.focus = true
        this.$emit('focus')
      },
      onBlur: ({ editor, event }) => {
        this.focus = false
        this.$emit('blur')
      }
    })
  }

  beforeDestroy () {
    this.editor.destroy()
  }

  editorSelectionIs (color) {
    return this.editor.isActive('textStyle', { color: color })
  }

  /**
   * reset the text area to disable the undo button
   * e.g. after saving the form while keeping it open
   */
  reset () {
    this.initialValue = this.value
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
.a-rich-text-editor {
  :deep(.ProseMirror-focused) {
      outline: none;
  }
}

.menu-bar {
  display: flex;
  justify-content: space-between;
  margin: -.2rem 0 .5rem -.2rem;
}

.menu-bar .v-btn,
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

  :deep(.v-icon) {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  &.strike {
    :deep(.v-icon) {
      width: 15px;
    }
  }

  svg {
    width: unset;
  }

  &:disabled {
    background: none !important;
    :deep(*) {
      color: #CCCCCC !important;
    }
  }

  &.is-active {
    background: #ECECEC !important;
  }

  &.menu-button:disabled {
    background: none !important;
  }
}

:deep(.ProseMirror) {
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
