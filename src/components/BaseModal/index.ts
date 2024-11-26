import { createVNode, render } from 'vue'

export { default as BaseModal } from './src/BaseModal.vue'
export { default as BaseModalForm } from './src/BaseModalForm.vue'
export { useModalForm } from './hooks/useModalForm'

export function createBaseModal(component: any, props: any = {}) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('span')
    const instance = createVNode(component, { ...props, resolve, reject })
    render(instance, container)
    document.body.appendChild(instance.el as HTMLElement)
  })
}
