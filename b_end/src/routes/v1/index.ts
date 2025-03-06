import { Hono } from 'hono'
import googleOAuth from './googleOAuth';

const v1 = new Hono();

v1.route('/google-oauth', googleOAuth);

export default v1
