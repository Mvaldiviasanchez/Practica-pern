import bcrypt from 'bcrypt'
import { pool } from '../db.js'
import { createAccessToken } from '../libs/jwt.js'
import md5 from 'md5'

const isProduction = process.env.NODE_ENV === 'production'

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,                 // en prod: true (https) / en dev: false
    sameSite: isProduction ? 'none' : 'lax', // en dev: lax, funciona en todos
    maxAge: 24 * 60 * 60 * 1000,          // 1 día
  })
}

export const signin = async (req, res) => {
  const { email, password } = req.body

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

  if (result.rowCount === 0) {
    return res.status(400).json({
      message: 'El correo no esta registrado'
    })
  }

  const validPassword = await bcrypt.compare(password, result.rows[0].password)

  if (!validPassword) {
    return res.status(400).json({
      message: 'La contraseña es incorrecta'
    })
  }

  const token = await createAccessToken({ id: result.rows[0].id })

  setAuthCookie(res, token)

  return res.json(result.rows[0])
}

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const gravatar = `https://www.gravatar.com/avatar/${md5(email)}`

    const result = await pool.query(
      'INSERT INTO users (name, email, password, gravatar) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, gravatar]
    )

    const token = await createAccessToken({ id: result.rows[0].id })

    setAuthCookie(res, token)

    return res.json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        message: 'El correo ya esta registrado'
      })
    }
    next(error)
  }
}

export const signout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  })
  res.sendStatus(200)
}

export const profile = async (req, res) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId])
  return res.json(result.rows[0])
}
