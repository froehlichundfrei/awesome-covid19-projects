/** @jsx jsx */
import { jsx } from 'theme-ui';
import React from 'react';
import { Link, graphql } from 'gatsby';
import Fuse from 'fuse.js';

import Layout from '../components/layout';
import SEO from '../components/seo';
import * as icons from '../utils/icons';

function concatArticles(node) {
  return [
    ...(Array.isArray(node.articles) ? node.articles : []),
    ...(Array.isArray(node.sections)
      ? node.sections.flatMap(section =>
          Array.isArray(section.articles) ? section.articles : [],
        )
      : []),
  ];
}

const randomNumber = () => Math.floor(Math.random() * 10);

const HelpCenterIndex = props => {
  const { data, location } = props;
  const { projects } = data.hasura;

  const filterProjects = (searchText, areaCodeText) => {
    let filtered = projects;
    if (searchText) {
      filtered = new Fuse(filtered, {
        shouldSort: true,
        tokenize: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: ['title', 'description'],
      }).search(searchText);
    }
    if (areaCodeText) {
      filtered = new Fuse(filtered, {
        shouldSort: true,
        tokenize: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: ['areaCode'],
      }).search(areaCodeText);
    }
    return filtered;
  };

  const areaCodeIcon = jsx(
    icons.FaMapMarker,
    { sx: { color: 'iconColor' }, size: '14px' },
    null,
  );
  const bookmarkIcon = jsx(
    icons.FaBookmark,
    { sx: { color: 'iconColor' }, size: '14px' },
    null,
  );
  const twitterIcon = jsx(
    icons.IoLogoTwitter,
    { sx: { color: 'iconColor' }, size: '14px' },
    null,
  );

  return (
    <Layout
      location={location}
      title={data.site.siteMetadata.title}
      description={data.site.siteMetadata.description}
    >
      {({ searchText, areaCodeText }) => (
        <>
          <SEO title={data.site.siteMetadata.title} skipSuffix />
          {filterProjects(searchText, areaCodeText).map((project, index) => {
            return (
              <Link
                key={project.id}
                sx={{
                  boxShadow: `none`,
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
                to={`/projects/${project.id}`}
              >
                <article
                  sx={{
                    backgroundColor: 'paperBackgroundColor',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'paperBorderColor',
                    borderRadius: 3,
                    py: 0, // 4
                    px: 0, // 2
                    position: 'relative',
                    zIndex: '3',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: ['column', 'row'],
                    outline: 'none',
                    mt: index === 0 ? 5 : 0,
                    mb: index === data.collections.edges.length - 1 ? 5 : 4,
                    boxShadow: '0 3px 8px 0 rgba(0,0,0,0.03)',
                    transition:
                      'border .15s linear, transform .15s linear, background-color .15s linear, box-shadow .15s linear, opacity .15s linear, transform .15s linear, box-shadow .15s linear',
                    color: 'paperHeadingColor',
                    '&:hover': {
                      border: '1px solid rgba(136,149,162,0.2)',
                      backgroundColor: 'paperHoverBackgroundColor',
                      color: 'paperHoverHeadingColor',
                    },
                  }}
                >
                  <div
                    sx={{
                      flex: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: ['flex-start', 'center'],
                      px: [2, 0],
                      // pb: [2, 0],
                    }}
                  >
                    <img
                      sx={{ margin: '0 0 auto 0' }}
                      src={`http://95.217.162.167:8081/${project.id}.png`}
                      alt="Project Site"
                    />
                  </div>
                  <div sx={{ flex: '6', px: [2, 0], ml: 3, mt: 3 }}>
                    <header>
                      <h3
                        sx={{
                          mt: 0,
                          color: 'rgba(0,0,0,.87)',
                          fontFamily: 'Roboto,Helvetica Neue,sans-serif',
                          fontWeight: '500',
                          fontSize: '20px',
                          mb: 2,
                        }}
                      >
                        {project.title || project.id}
                      </h3>
                    </header>
                    <section
                      sx={{
                        color: 'rgba(0,0,0,.54)',
                        paddingRight: '16px',
                        fontSize: '14px',
                      }}
                    >
                      {project.description.length < 300
                        ? project.description
                        : `${project.description.substring(0, 299)}...`}
                    </section>
                  </div>
                  <div
                    sx={{
                      flexWrap: 'nowrap',
                      minWidth: '100%',
                      borderTop: '1px solid rgba(160,160,160,0.2)',
                    }}
                  >
                    <div
                      sx={{
                        flex: '6',
                        px: [2, 0],
                        ml: 3,
                        mt: 3,
                        display: 'inline-flex',
                      }}
                    >
                      <section
                        sx={{
                          color: 'rgba(0,0,0,.54)',
                          paddingRight: '16px',
                          fontSize: '14px',
                        }}
                      >
                        {areaCodeIcon}
                        {project.areaCode ? ` ${project.areaCode}` : ' all'}
                      </section>
                    </div>
                    <div
                      sx={{
                        flex: '6',
                        px: [2, 0],
                        ml: 3,
                        mt: 3,
                        display: 'inline-flex',
                      }}
                    >
                      <section
                        sx={{
                          color: 'rgba(0,0,0,.54)',
                          paddingRight: '16px',
                          fontSize: '14px',
                        }}
                      >
                        {twitterIcon}{' '}
                        {project.twitterActions
                          ? `${project.twitterActions} `
                          : ''}
                      </section>
                    </div>
                    <div
                      sx={{
                        flex: '12',
                        px: [2, 0],
                        ml: 3,
                        mt: 3,
                        display: 'inline-flex',
                      }}
                    >
                      <section
                        sx={{
                          color: 'rgba(0,0,0,.54)',
                          paddingRight: '16px',
                          fontSize: '14px',
                        }}
                      >
                        {bookmarkIcon} {randomNumber()}
                        <img
                          sx={{ width: '14px', height: '14px', mb: 0 }}
                          src="https://randomuser.me/api/portraits/men/93.jpg"
                        />
                      </section>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
          {/* {data.collections.edges.map(({ node }, index) => {
            const articlesOfCollection = concatArticles(node);

            const icon = node.icon
              ? jsx(
                  icons[node.icon],
                  { sx: { color: 'iconColor' }, size: '2rem' },
                  null,
                )
              : null;

            return (
              <Link
                key={node.id}
                sx={{
                  boxShadow: `none`,
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
                to={node.fields.slug}
              >
                <article
                  sx={{
                    backgroundColor: 'paperBackgroundColor',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'paperBorderColor',
                    borderRadius: 3,
                    py: 4,
                    px: 2,
                    position: 'relative',
                    zIndex: '3',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    width: '100%',
                    display: 'flex',
                    flexDirection: ['column', 'row'],
                    outline: 'none',
                    mt: index === 0 ? 5 : 0,
                    mb: index === data.collections.edges.length - 1 ? 5 : 4,
                    boxShadow: '0 3px 8px 0 rgba(0,0,0,0.03)',
                    transition:
                      'border .15s linear, transform .15s linear, background-color .15s linear, box-shadow .15s linear, opacity .15s linear, transform .15s linear, box-shadow .15s linear',
                    color: 'paperHeadingColor',
                    '&:hover': {
                      border: '1px solid rgba(136,149,162,0.2)',
                      backgroundColor: 'paperHoverBackgroundColor',
                      color: 'paperHoverHeadingColor',
                    },
                  }}
                >
                  <div
                    sx={{
                      flex: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: ['flex-start', 'center'],
                      px: [2, 0],
                      pb: [3, 0],
                    }}
                  >
                    {icon}
                  </div>
                  <div sx={{ flex: '6', px: [2, 0] }}>
                    <header>
                      <h3
                        sx={{
                          mt: 0,
                          mb: 2,
                          color: 'inherit',
                        }}
                      >
                        {node.title}
                      </h3>
                    </header>
                    <section
                      sx={{
                        color: 'paperDescriptionColor',
                      }}
                    >
                      {node.description}
                    </section>
                    <small
                      sx={{
                        color: 'paperDescriptionColor',
                      }}
                    >
                      {articlesOfCollection.length}{' '}
                      {(() => {
                        switch (articlesOfCollection.length) {
                          case 0:
                            return data.site.siteMetadata.texts
                              .articlesInCollectionZeroText;
                          case 1:
                            return data.site.siteMetadata.texts
                              .articlesInCollectionOneText;
                          case 2:
                            return data.site.siteMetadata.texts
                              .articlesInCollectionTwoText;
                          default:
                            return data.site.siteMetadata.texts
                              .articlesInCollectionMultipleText;
                        }
                      })()}
                    </small>
                  </div>
                </article>
              </Link>
            );
          })} */}
        </>
      )}
    </Layout>
  );
};

export default HelpCenterIndex;

export const pageQuery = graphql`
  fragment IndexArticleFragment on File {
    childMarkdownRemark {
      id
    }
  }
  query {
    site {
      siteMetadata {
        title
        description
        texts {
          articlesInCollectionZeroText
          articlesInCollectionOneText
          articlesInCollectionTwoText
          articlesInCollectionMultipleText
        }
      }
    }
    collections: allCollectionsYaml {
      edges {
        node {
          id
          title
          icon
          description
          articles {
            file {
              ...IndexArticleFragment
            }
          }
          sections {
            articles {
              file {
                ...IndexArticleFragment
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
    hasura {
      projects(order_by: { twitterActions: desc }) {
        id
        title
        description
        twitterActions
        areaCode
        user_bookmarks {
          user {
            id
            first_name
            last_name
          }
        }
      }
    }
  }
`;
