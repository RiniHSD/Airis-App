import app from './index.js'
import { PORT } from './config.js'

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})