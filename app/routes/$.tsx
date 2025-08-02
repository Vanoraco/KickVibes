import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {NotFoundPage} from '~/components/NotFoundPage';

export const meta: MetaFunction = () => {
  return [
    {title: 'Page Not Found | KickVibes'},
    {name: 'description', content: 'The page you are looking for could not be found.'},
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return <NotFoundPage />;
}
