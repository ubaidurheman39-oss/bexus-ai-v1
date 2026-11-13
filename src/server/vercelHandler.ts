import app from '../../server.ts';

export default function handler(req: any, res: any) {
  try {
    const rawUrl = req.url || '/';
    const parsed = new URL(rawUrl, 'http://localhost');
    const routeParam = parsed.searchParams.get('__route');
    if (routeParam !== null) {
      parsed.searchParams.delete('__route');
      const qs = parsed.searchParams.toString();
      req.url = `/api/${routeParam}${qs ? `?${qs}` : ''}`;
    } else if (!rawUrl.startsWith('/api')) {
      req.url = `/api${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
    }
  } catch {
    // Fallback to original URL
  }
  return app(req, res);
}
