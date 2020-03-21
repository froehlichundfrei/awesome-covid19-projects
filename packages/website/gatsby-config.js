module.exports = {
  siteMetadata: {
    title: `Awesome Covid19 Projects`,
    author: `TBD`,
    // You'd normally use a description like
    // "Advice and answers by the MyCompany-Team"
    description: ``,
    siteUrl: `https://5e75f1746bd87000072e2935--boring-shannon-e5fb24.netlify.com/collections/introduction`,
    language: 'de',
    texts: {
      allCollectionsText: 'All Collections',
      searchPlaceholderText: 'Suche nach Projekten',
      lastModifiedText: 'Zuletzt editiert',
      publishedOnText: 'Veröffentlicht am',
      writtenByText: 'Geschrieben von',
      articlesInCollectionZeroText: 'Projekte in dieser Gruppe',
      articlesInCollectionOneText: 'Projekte in dieser Gruppe',
      articlesInCollectionTwoText: 'Projekte in dieser Gruppe',
      articlesInCollectionMultipleText: 'Projekte in dieser Gruppe',
    },
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': `AuthorsYaml`,
    'MarkdownRemark.frontmatter.collection': `CollectionsYaml`,
  },
  plugins: [
    'gatsby-plugin-theme-ui',
    `gatsby-transformer-yaml`,
    `gatsby-plugin-sitemap`,
    'gatsby-plugin-simple-analytics',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `articles`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data`,
        name: `mappings`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     //trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Help Center`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `assets/favicon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
};
