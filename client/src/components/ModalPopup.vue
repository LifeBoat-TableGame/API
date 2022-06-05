<template>
  <div name="modal-fade">
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block bg-light-bg opacity-75 align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg leading-6 font-medium"
                  id="modal-headline"
                >
                    Внимание!
                </h3>
                <div class="mt-2">
                  <p class="text-sm">
                    {{ modalMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirm"
              class="btn"
            >
              Нет
            </button>
            <button
              type="button"
              @click="close"
              class="btn"
              >
              Да
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modalMessage: string,
}>();
const emit = defineEmits(['popup:confirmed', 'popup:declined'])
const confirm = () => {emit("popup:declined");
} 
const close = () => {
    emit("popup:confirmed");
};
</script>