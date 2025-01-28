<template>
  <detail-property
    :label="label"
    :icon="icon"
  >
    <template #actionButton>
      <a-icon
        v-if="buttonEdit"
        size="1.3rem"
        class="contextButton mt-n1"
        title="Bearbeiten"
        @click="showForm = true"
      >
        $pencilCircleIcon
      </a-icon>

      <a-icon
        v-if="buttonAdd"
        size="1.3rem"
        class="contextButton mt-n1"
        title="Bearbeiten"
        @click="showForm = true"
      >
        $addIcon
      </a-icon>

      <edit-modal
        ref="modal"
        :width="modalWidth"
        :show="showForm"
        :model="model"
        :createModelToEdit="createModelToEdit"
        :title="label"
        :icon="icon"
        @save="save"
        @close="close"
      >
        <template #form="{modelToEdit}">
          <slot
            name="form"
            :modelToEdit="modelToEdit"
          />
        </template>
      </edit-modal>
    </template>

    <template v-if="sectionModel">
      <slot
        name="model"
        :model="model"
      />
    </template>

    <div v-else>
      <a-row
        v-if="labelEmpty"
        gap="1"
      >
        <x-icon :color="xColorEmpty" /> {{ labelEmpty }}
      </a-row>

      <a-icon-button
        v-if="buttonCreate"
        :class="buttonSize === 'small' ? 'mt-4' : 'mt-2'"
        :x-small="buttonSize === 'x-small'"
        icon="$plusIcon"
        :text="label"
        @click="showForm = true"
      />
    </div>
  </detail-property>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [
    'model', 'createModelToEdit',
    'icon',
    'label',
    'labelEmpty', 'xColorEmpty',
    {
      sectionModel: false,
      buttonEdit: false,
      buttonAdd: false,
      buttonCreate: false,
      modalWidth: 'auto',
      buttonSize: 'small'
    }
  ]
})
export default class EditableDetailProperty extends Vue {
  showForm = false

  save (model, ignoreChangesOnClose, closeModal) {
    this.$emit('save', {model, ignoreChangesOnClose, closeModal})
  }

  openModal () {
    this.showForm = true
  }

  close () {
    this.showForm = false
    this.$emit('close')
  }
}
</script>


<style lang="scss" scoped>
</style>
