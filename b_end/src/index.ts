import { Hono } from 'hono'
import v1 from './routes/v1'

const app = new Hono()

app.route('/v1', v1);

export default app