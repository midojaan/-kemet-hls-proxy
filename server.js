import Fastify from 'fastify';
import fetch from 'node-fetch';

const fastify = Fastify({ logger: false });

fastify.get('/', async (request, reply) => {
  return '✅ KEMET Proxy is running!';
});

fastify.get('/proxy', async (request, reply) => {
  const url = request.query.url;
  if (!url) return reply.code(400).send('Missing url param');

  try {
    const response = await fetch(url, {
      headers: {
        'Referer': 'https://myco.io/',
        'User-Agent': request.headers['user-agent'] || '',
      },
    });

    reply.header('Content-Type', response.headers.get('Content-Type'));
    return response.body;
  } catch (error) {
    return reply.code(500).send('Proxy Failed: ' + error.message);
  }
});

fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
