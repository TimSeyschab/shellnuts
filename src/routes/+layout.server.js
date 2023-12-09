import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';
export const prerender = 'auto';

inject({ mode: dev ? 'development' : 'production' });


