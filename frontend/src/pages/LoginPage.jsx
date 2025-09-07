import { Card, Input, Button, Label, Container } from '../components/ui'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'

function LoginPage() {

  const { register, handleSubmit, formState: {
    errors
  } } = useForm()
  const { signin, errors: loginErrors } = useAuth()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data)

    if(user){
      navigate('/tasks')
    }
  })

  return (
    <Container className="h-[calc(100vh-10rem)] flex justify-center items-center">
      <Card>

        {loginErrors && (
            loginErrors.map((err, index) => (
              <p key={index} className='text-red-500 text-center'>
                {err}
              </p>
            ))
          )
        }

        <h1 className='text-4xl font-bold my-2 text-center'>Iniciar sesión</h1>

        <form onSubmit={onSubmit}>
          <Label htmlFor='email'>
            Correo electrónico
          </Label>
          <Input type="email" placeholder="Correo electrónico"
            {...register('email', {
              required: true
            })}
          />
          {
            errors.email && <p className="text-red-500">El correo es obligatorio</p>
          }

          <Label htmlFor='password'>
            Contraseña
          </Label>
          <Input type="password" placeholder="Contraseña"
            {...register('password', {
              required: true
            })}
          />
          {
            errors.password && <p className="text-red-500">La contraseña es obligatoria</p>
          }

          <Button>
            Iniciar sesión
          </Button>

          <div className='flex justify-between my-4'>
            <p className='mr-4'>¿No tienes una cuenta?</p>
            <Link to="/register" className='font-bold'>
              Regístrate
            </Link>

          </div>


        </form>
      </Card>
    </Container>
  )
}

export default LoginPage