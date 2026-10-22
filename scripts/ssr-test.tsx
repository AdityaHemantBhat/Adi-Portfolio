import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ProjectProvider } from '../src/context/ProjectContext';
import Layout from '../src/components/layout/Layout';
import Home from '../src/pages/Home';

const html = renderToString(
  <StaticRouter location="/">
    <ProjectProvider>
      <Layout><Home /></Layout>
    </ProjectProvider>
  </StaticRouter>
);
console.log('LEN', html.length);
console.log('HAS_H1', html.includes('Webdesigner'));
console.log('HAS_FOOTER', html.includes('All rights reserved'));
