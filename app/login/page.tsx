import AuthForm from '../components/AuthForm'

/**
 * Vista principal de autenticación.
 */
export default function LoginPage() {
  return (
     /* Contenedor principal con fondo degradado y soporte para modo oscuro */
     <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 p-4 sm:p-6 lg:p-8">
       {/* Tarjeta contenedora centrada para el formulario */}
       <div className="w-full max-w-md">
         <AuthForm />
       </div>
     </main>
   )
 }
