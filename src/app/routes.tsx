import MainLayout from 'src/layouts/main.layout';
import HomePage from 'src/pages/home/home.page';
import NotFoundPage from 'src/pages/not-found.page';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export default routes;
