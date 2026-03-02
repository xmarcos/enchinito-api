import { router } from './index';

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request, event));
});
