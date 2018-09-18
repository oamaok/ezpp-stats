import Koa from 'koa';
import Router from 'koa-router';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { google } from 'googleapis';
import { getCredentials, setTokens, getTokens } from './credentials';

import AppFrame from './components/AppFrame';

const credentials = getCredentials();

const oauth2Client = new google.auth.OAuth2(
  credentials.clientId,
  credentials.clientSecret,
  'http://localhost:8800/oauth',
);

const analytics = google.analyticsreporting({
  version: 'v4',
  auth: oauth2Client,
});

const app = new Koa();
const router = new Router();

let gTokens = getTokens();

if (gTokens) {
  oauth2Client.setCredentials(gTokens);
}

router
  .get('/', async (ctx, next) => {
    if (!gTokens) {
      const url = oauth2Client.generateAuthUrl({ scope: 'https://www.googleapis.com/auth/analytics' });
      ctx.body = <a href={url}>Authenticate!</a>;
      next();
      return;
    }

    const res = await analytics.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: '136405367',
            dateRanges: [
              {
                endDate: 'today',
                startDate: '14daysAgo',
              },
            ],
            metrics: [{
              expression: 'ga:uniqueEvents',
            }, {
              expression: 'ga:totalEvents',
            }],
            dimensions: [
              {
                name: 'ga:eventAction',
              },
            ],
            dimensionFilterClauses: [{
              filters: [{
                dimensionName: 'ga:eventCategory',
                operator: 'EXACT',
                expressions: ['calculate'],
              }],
            }],
          },
        ],
      },
    });

    ctx.body = <pre>{JSON.stringify(res.data)}</pre>;
    next();
  })
  .get('/oauth', async (ctx, next) => {
    const [, code] = ctx.request.url.match(/\?code=(.+)$/);

    const { tokens } = await oauth2Client.getToken(code);
    setTokens(tokens);
    gTokens = tokens;
    oauth2Client.setCredentials(tokens);

    ctx.redirect('/');
    next();
  });

app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx, next) => {
  if (React.isValidElement(ctx.body)) {
    ctx.type = 'html';
    ctx.body = ReactDOMServer.renderToStaticMarkup(<AppFrame>{ctx.body}</AppFrame>);
  }

  next();
});

app.listen(8800);
