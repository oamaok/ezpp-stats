import Koa from 'koa';
import Router from 'koa-router';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

function TestComponent() {
  return <div>hello</div>;
}

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = ReactDOMServer.renderToStaticMarkup(<TestComponent />)
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8080);
