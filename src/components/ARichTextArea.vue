<template>
  <div>
    <div :class="['editorWrapper', {hasError: !isValid, focused: editorFocus}]">
      <div
        v-if="editor"
        class="menu-bar"
      >
        <div>
          <v-btn
            small
            :class="['menu-button', {'is-active': editorFocus && editor.isActive('bold')}]"
            title="fett"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <v-icon>{{ boldIcon }}</v-icon>
          </v-btn>

          <v-btn
            small
            :class="['menu-button', {'is-active': editorFocus && editor.isActive('italic')}]"
            title="kursiv"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <v-icon>{{ italicIcon }}</v-icon>
          </v-btn>

          <v-btn
            small
            :class="['menu-button', 'strike', {'is-active': editorFocus && editor.isActive('strike')}]"
            title="durchgestrichen"
            @click="editor.chain().focus().toggleStrike().run()"
          >
            <v-icon>{{ strikeIcon }}</v-icon>
          </v-btn>

          <v-btn
            small
            :class="['menu-button', {'is-active': editorFocus && editor.isActive('bulletList')}]"
            title="punkt-liste"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <v-icon>{{ ulIcon }}</v-icon>
          </v-btn>

          <v-btn
            small
            :class="['menu-button', {'is-active': editorFocus && editor.isActive('orderedList')}]"
            title="nummerierte liste"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <v-icon>{{ olIcon }}</v-icon>
          </v-btn>

          <v-btn
            small
            :class="['menu-button', {'is-active': editorFocus && editor.isActive('blockquote')}]"
            title="zitat"
            @click="editor.chain().focus().toggleBlockquote().run()"
          >
            <v-icon>{{ commentIcon }}</v-icon>
          </v-btn>

          <v-btn
            small
            class="menu-button"
            :class="{ 'is-active': editorFocus && editor.isActive('highlight', { color: '#00FF00' })}"
            title="grün"
            color="green--text"
            @click="editor.chain().focus().toggleHighlight({ color: '#00FF00' }).run()"
          >
            <v-icon>$paletteIcon</v-icon>
          </v-btn>

          <v-btn
            small
            class="menu-button"
            :class="{ 'is-active': editorFocus && editor.isActive('highlight', { color: '#FF0000' })}"
            title="rot"
            color="red--text"
            @click="editor.chain().focus().toggleHighlight({ color: '#FF0000' }).run()"
          >
            <v-icon>$paletteIcon</v-icon>
          </v-btn>

          <v-btn
            small
            class="menu-button"
            :class="{ 'is-active': editorFocus && editor.isActive('highlight', { color: '#FFFF00' })}"
            title="gelb"
            color="yellow--text"
            @click="editor.chain().focus().toggleHighlight({ color: '#FFFF00' }).run()"
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
        :class="['a-rich-text-editor', {editorFocus}]"
      />
    </div>

    <a-text-field
      :value="currentValueStripped"
      class="validationInput"
      :label="label"
      :rules="validationRules"
      :valid.sync="isValid"
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
import Highlight from '@tiptap/extension-highlight'

@Component({
  props: ['value', 'validator', 'focus', 'label'],
  components: {
    EditorContent
  }
})
export default class ARichTextArea extends Vue {
  editor = null
  internalValue = null
  initialValue = null
  editorFocus = false
  isValid = false

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
    this.editorFocus = !!this.focus


    this.editor = new Editor({
      content: this.internalValue,
      autofocus: this.focus ? 'end' : false,
      extensions: [
        StarterKit,
        Highlight.configure({ multicolor: true }),
        Color
      ],
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML())
      },
      onFocus: ({ editor, event }) => {
        this.editorFocus = true
        this.$emit('focus')
      },
      onBlur: ({ editor, event }) => {
        this.editorFocus = false
        this.$emit('blur')
      }
    })
  }

  beforeDestroy () {
    this.editor.destroy()
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
      // witch reusing the editor component, we need to restore the focus state
      if (this.focus && this.focus === true) {
        this.editor.commands.focus('end')
      }
    }
  }

  get validationRules () {
    return (this.validator && this.validator.getRules(this.label)) || []
  }

  get counter () {
    if (!this.validator) {
      return false
    }
    return this.validator.getParam('max') || false
  }

  get currentValueStripped () {
    if (this.editor) {
      const value = this.editor.state.doc.textContent
      return this.getSanitizedValue(value)
    }
  }

  getSanitizedValue (value) {
    if (this.validator) {
      const sanitizers = this.validator.getSanitizers()
      for (const sanitizer of sanitizers) {
        value = sanitizer(value)
      }
    }
    return value
  }
}
</script>


<style lang="scss" scoped>
.editorWrapper {
  padding: .5rem;
  margin: 0 1px;

  border: 1px solid white;
  outline: 1px solid rgb(0 0 0 / 38%);
  border-radius: 4px !important;

  :deep(.ProseMirror-focused) {
    outline: none;
  }

  &.focused {
    border: 1px solid #1975D2;
    outline: 1px solid #1975D2;
  }

  &.hasError {
    border: 1px solid #FF5252;
    outline: 1px solid #FF5252;
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
  margin-right: 2px;

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

.validationInput {
  margin-top: .3rem;

  :deep(.v-input__slot) {
    display: none;
  }
}
</style>
