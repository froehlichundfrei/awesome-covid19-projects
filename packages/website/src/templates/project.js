/** @jsx jsx */
import { jsx } from 'theme-ui';
import React from 'react';
import { Link, graphql } from 'gatsby';
import slug from 'slug';
import Image from 'gatsby-image';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';

class ProjectTemplate extends React.Component {
  render() {
    const { project } = this.props.data.hasura;
    const siteTitle = this.props.data.site.siteMetadata.title;
    // const { collection } = article.fields;
    // const { section } = article.fields;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={project.title} description={project.description} />
        <p sx={{ mt: 1, mb: 2, py: 0 }}>
          <Link
            to="/"
            sx={{
              color: 'breadcrumbLinkTextColor',
              boxShadow: 'none',
              fontSize: 1,
              '&:hover': {
                color: 'breadcrumbHoverLinkTextColor',
              },
            }}
          >
            {this.props.data.site.siteMetadata.texts.allCollectionsText}
          </Link>{' '}
          <span sx={{ color: 'breadcrumbTextColor', fontSize: 1 }}>
            &rsaquo;
          </span>{' '}
          <span sx={{ color: 'breadcrumbTextColor', fontSize: 1 }}>
            {project.title}
          </span>
        </p>
        <article
          sx={{
            backgroundColor: 'paperBackgroundColor',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'paperBorderColor',
            borderRadius: 3,
            px: [2, 4],
            py: 2,
            mb: 6,
            position: 'relative',
            zIndex: '3',
            textDecoration: 'none',
            overflow: 'hidden',
            width: '100%',
            display: 'block',
            outline: 'none',
            boxShadow: '0 3px 8px 0 rgba(0,0,0,0.03)',
            transition:
              'border .15s linear, transform .15s linear, background-color .15s linear, box-shadow .15s linear, opacity .15s linear, transform .15s linear, box-shadow .15s linear',
            color: 'articleTextColor',
          }}
        >
          <header sx={{ mb: 3 }}>
            <h2 sx={{ mt: 4, mb: 1 }}>{project.title}</h2>
            <p sx={{ my: 3, color: 'articleDescriptionColor' }}>
              {project.description}
            </p>
            <h4 sx={{ m4: 3, mb: 3 }}>Website Preview</h4>
            <img
              src={`http://95.217.162.167:8081/${project.id}.png`}
              alt="Project Site"
            />
            ;
            {/* {article.frontmatter.author && (
              <div sx={{ mt: 2, mb: 4, display: 'flex' }}>
                <div sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image
                    fixed={
                      article.frontmatter.author.avatar.childImageSharp.fixed
                    }
                    alt={article.frontmatter.author.name}
                    style={{
                      marginRight: rhythm(1 / 2),
                      marginBottom: 0,
                      width: 40,
                      height: 40,
                      borderRadius: `100%`,
                    }}
                    imgStyle={{
                      borderRadius: `50%`,
                    }}
                  />
                </div>
                <div
                  sx={{
                    color: 'muted',
                    fontSize: 1,
                    lineHeight: 'small',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div>
                      {this.props.data.site.siteMetadata.texts.writtenByText}{' '}
                      <span sx={{ color: 'breadcrumbLinkTextColor' }}>
                        {article.frontmatter.author.name}
                      </span>
                    </div>
                    {article.frontmatter.modifiedDate ? (
                      <div
                        sx={{
                          display: `block`,
                        }}
                      >
                        <span
                          title={new Date(
                            article.frontmatter.modifiedDate,
                          ).toLocaleString(
                            this.props.data.site.siteMetadata.language,
                          )}
                        >
                          {
                            this.props.data.site.siteMetadata.texts
                              .lastModifiedText
                          }{' '}
                          {new Date(
                            article.frontmatter.modifiedDate,
                          ).toLocaleDateString(
                            this.props.data.site.siteMetadata.language,
                          )}
                        </span>
                      </div>
                    ) : article.frontmatter.date ? (
                      <div
                        sx={{
                          display: `block`,
                        }}
                      >
                        <span
                          title={new Date(
                            article.frontmatter.date,
                          ).toLocaleString(
                            this.props.data.site.siteMetadata.language,
                          )}
                        >
                          {
                            this.props.data.site.siteMetadata.texts
                              .publishedOnText
                          }{' '}
                          {new Date(
                            article.frontmatter.date,
                          ).toLocaleDateString(
                            this.props.data.site.siteMetadata.language,
                          )}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )} */}
          </header>
          <hr sx={{ background: 'hsla(0,0%,0%,0.05)' }} />
          <a href={project.url} rel="noopener noreferrer" target="_blank">
            {project.url}
          </a>
          {/* <section
            sx={{ pb: 4 }}
            dangerouslySetInnerHTML={{ __html: article.html }}
          /> */}
        </article>
      </Layout>
    );
  }
}

export default ProjectTemplate;

export const pageQuery = graphql`
  query ProjectById($id: Int!) {
    site {
      siteMetadata {
        title
        texts {
          writtenByText
          allCollectionsText
          lastModifiedText
          publishedOnText
        }
        language
      }
    }
    hasura {
      project: projects_by_pk(id: $id) {
        id
        title
        description
        url
        created_at
      }
    }
  }
`;
