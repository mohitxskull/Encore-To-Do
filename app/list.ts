import { api } from 'encore.dev/api';

interface RouteRes {
  apps: {
    name: string;
    id: string;
  }[];
}

// List All the Apps for the user
export const list = api(
  { expose: true, method: 'GET', path: '/app/list', auth: true },
  async (): Promise<RouteRes> => {
    return {
      apps: [
        { name: 'App1', id: '1' },
        { name: 'App2', id: '2' },
        { name: 'App3', id: '3' },
      ],
    };
  }
);
