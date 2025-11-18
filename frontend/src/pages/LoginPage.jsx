import { Card, Input, Button, Label, Container } from '../components/ui'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { signin, errors: loginErrors } = useAuth()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data)
    if (user) navigate('/tasks')
  })

  return (
    <Container className="min-h-[calc(100vh-64px)] w-full flex items-start justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-sm -translate-y-6"
      >
        <Card className="w-full min-h-[360px] flex flex-col justify-center p-6 md:p-8 shadow-lg shadow-black/40">

          {/* errores del backend */}
          {loginErrors && loginErrors.map((error, i) => (
            <p key={i} className="text-red-500 mb-2 text-center">
              {error}
            </p>
          ))}

          <h1 className="text-3xl md:text-4xl font-bold my-2 text-center">Iniciar sesión</h1>

          <form onSubmit={onSubmit}>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              type="email"
              placeholder="Correo electrónico"
              {...register('email', { required: true })}
            />
            {errors.email && <p className="text-red-500">El correo es obligatorio</p>}

            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              placeholder="Contraseña"
              {...register('password', { required: true })}
            />
            {errors.password && <p className="text-red-500">La contraseña es obligatoria</p>}

            <Button className="w-full">Iniciar sesión</Button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 my-4">
              <p className="mr-0 sm:mr-4 text-center sm:text-left">¿No tienes una cuenta?</p>
              <Link to="/register" className="font-bold text-center sm:text-right">
                Regístrate
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </Container>
  )
}

export default LoginPage
