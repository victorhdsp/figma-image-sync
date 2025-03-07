import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  KV: KVNamespace
}

const googleOAuth = new Hono<{ Bindings: Bindings }>();

googleOAuth.use('/*', cors())

googleOAuth.get('/', async (c) => {
    const { id } = c.req.queries();
    const token = await c.env.KV.get(`${id}`);
    if (!token) {
        return c.json({ message: 'not found' })
    }
    return c.json({ token })
})

googleOAuth.delete('/', async (c) => {
    const { id } = c.req.queries();
    await c.env.KV.delete(`${id}`);
    return c.json({ message: 'deleted' })
})

googleOAuth.get('/callback', async (c) => {
    const { state, access_token } = c.req.queries();
    await c.env.KV.put(`${state}`, `${access_token}`);
    return c.json({ message: 'finished' })
})

googleOAuth.get('/redirect', async (c) => {
    const html = `<script>
        const uriHashed = window.location.href;
        const uriQuerie = uriHashed.replace('redirect#', 'callback?');
        window.location.href = uriQuerie;
    </script>`;
    return c.html(html);
})

export default googleOAuth
