import { Toaster, toast } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#0F172A',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          fontSize: '14px',
          padding: '12px 16px',
          maxWidth: '400px',
        },
        success: {
          iconTheme: {
            primary: '#059669',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}

export const showToast = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  dismiss: (id) => toast.dismiss(id),
}

export { toast }
export default ToastProvider
