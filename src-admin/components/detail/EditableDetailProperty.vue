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
        @click="openModal"
      >
        $pencilCircleIcon
      </a-icon>

      <a-icon
        v-if="buttonAdd"
        size="1.3rem"
        class="contextButton mt-n1"
        title="Bearbeiten"
        @click="openModal"
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
        :deleteButton="deleteButton"
        @delete="deleteModel"
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
        :small="buttonSize === 'small'"
        :x-small="buttonSize === 'x-small'"
        icon="$plusIcon"
        :text="label"
        @click="openModal"
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
      deleteButton: false,
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

  deleteModel (model, ignoreChangesOnClose, closeModal) {
    this.$emit('delete', {model, ignoreChangesOnClose, closeModal})
  }

  openModal () {
    this.showForm = true
    this.$emit('open')
  }

  close () {
    this.showForm = false
    this.$emit('close')
  }
}
</script>


<style lang="scss" scoped>
</style>
