import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { AppProviders } from "./app/AppProviders";
import { prerenderPaths, publicRoutes } from "./routing/publicRoutes";

export { prerenderPaths };

export async function render(url: string) {
  const handler = createStaticHandler(publicRoutes);
  const context = await handler.query(new Request(`http://localhost${url}`));
  if (context instanceof Response)
    throw new Error(`Redirect while prerendering ${url}`);

  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <AppProviders>
      <StaticRouterProvider router={router} context={context} />
    </AppProviders>,
  );
}
