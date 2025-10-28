import toast from 'react-hot-toast'

/**
 * Show success toast
 */
export function showSuccess(message: string) {
  toast.success(message, {
    duration: 4000,
  })
}

/**
 * Show error toast
 */
export function showError(message: string) {
  toast.error(message, {
    duration: 5000,
  })
}

/**
 * Show loading toast
 */
export function showLoading(message: string) {
  return toast.loading(message)
}

/**
 * Show info toast
 */
export function showInfo(message: string) {
  toast(message, {
    icon: 'ℹ️',
    duration: 4000,
  })
}

/**
 * Dismiss toast
 */
export function dismissToast(toastId: string) {
  toast.dismiss(toastId)
}

/**
 * Show promise toast (for async operations)
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  }
) {
  return toast.promise(promise, messages)
}
