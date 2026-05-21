import Elysia from 'elysia';

export const blob = new Elysia()
  .get('/blob', () => {
    return new Blob(['Hello, world!'], { type: 'text/plain' });
  })
  .post('/blob', async (ctx) => {
    const blob = await ctx.request.blob();
    const text = await blob.text();
    return `Received blob with content: ${text}`;
  });

export default blob;
