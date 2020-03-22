import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = props => {
  const { data, location } = props;
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      {() => (
        <>
          <SEO title="404: Not Found" />
          <h1>Not Found</h1>
          <p>Du bist auf einer Seite gelandet die leider nicht existiert...</p>
        </>
      )}
    </Layout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
