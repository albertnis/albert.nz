module.exports = {
  siteMetadata: {
    title: `Albert Nisbet`,
    author: {
      name: `Albert Nisbet`,
      summary: `who lives and works in Wellington building useful things.`,
    },
    description: `The blog of Albert Nisbet`,
    siteUrl: `https://albert.nz/`,
    social: {
      twitter: `albertnis`,
      email: `albert@albert.nz`,
      github: `albertnis`,
      linkedin: `albertnis`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
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
              maxWidth: 900,
              quality: 80,
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-45382817-3`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge =>
                Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [
                    {
                      'content:encoded': `${
                        edge.node.frontmatter.links
                          ? `<p>${edge.node.frontmatter.links.join(' | ')}</p>`
                          : ''
                      }${edge.node.html}`,
                    },
                  ],
                })
              ),
            query: `
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      date
                      links
                    }
                  }
                }
              }
            }
            `,
            output: '/rss.xml',
            title: 'Albert Nisbet - RSS Feed',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Albert Nisbet`,
        short_name: `albert.nz`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#161616`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Fira code`,
          `PT Sans`,
          `Didact Gothic`,
          `Raleway\:400,500,600,700,800`,
        ],
        display: 'swap',
      },
    },
  ],
}
