import express from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(`Listening on port:${PORT}`))