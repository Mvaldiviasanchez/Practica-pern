import { Button, Card, Input, Label, Container } from '../components/ui'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { signup, errors: signupErrors } = useAuth()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    const user = await signup(data)
    if (user) navigate('/tasks')
  })

  return (<Container className="min-h-[calc(100vh-64px)] w-full flex items-start justify-center px-4 py-10">
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.01 }}
    className="w-full max-w-sm sm:max-w-md md:max-w-sm -translate-y-6"
  >
    <Card className="w-full min-h-[360px] flex flex-col justify-center p-6 md:p-8 shadow-lg shadow-black/40">
      {/* errores */}
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-2">Registrarse</h3>

      <form onSubmit={onSubmit}>
        <Label htmlFor="name">Nombre</Label>
        <Input
          placeholder="Ingresa tu nombre"
          {...register('name', { required: true })}
        />
        {errors.name && <p className="text-red-500">El nombre es obligatorio</p>}

        <Label htmlFor="email">Correo</Label>
        <Input
          type="email"
          placeholder="Ingresa tu correo"
          {...register('email', { required: true })}
        />
        {errors.email && <p className="text-red-500">El correo es obligatorio</p>}

        <Label htmlFor="password">Contraseña</Label>
        <Input
          type="password"
          placeholder="Ingresa tu contraseña"
          {...register('password', { required: true })}
        />
        {errors.password && <p className="text-red-500">La contraseña es obligatoria</p>}

        <Button className="w-full">Registrarse</Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 my-4">
          <p className="mr-0 sm:mr-4 text-center sm:text-left">¿Ya tienes una cuenta?</p>
          <Link to="/login" className="font-bold text-center sm:text-right">
            Inicia sesión
          </Link>
        </div>
      </form>
    </Card>
  </motion.div>
</Container>
  )
}

export default RegisterPage
