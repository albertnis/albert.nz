import React from 'react'
import { graphql } from 'gatsby'

import Seo from '../components/seo'
import Row from '../components/row'
import Header from '../components/header'
import Post from '../components/post'
import Footer from '../components/footer'
import Hero from '../components/hero'

// prismjs plugin is NOT COOL and doesn't wrap highlighted lines properly
// Relying on display: block is bad for accessibility and for reading without original CSS
// The "fix" that broke this is https://github.com/gatsbyjs/gatsby/pull/10209
// and the docs are out of date https://github.com/gatsbyjs/gatsby/blame/104f2cc980a019e4d0234d6aad4248341ccfd3ec/packages/gatsby-remark-prismjs/README.md#L520

const BlogPostTemplate = ({ data }) => {
  const { frontmatter, excerpt, html } = data.markdownRemark

  return (
    <div>
      <Seo
        title={frontmatter.title}
        description={frontmatter.description || excerpt}
      />
      {frontmatter.hero ? (
        <Hero
          title={frontmatter.title}
          imgSrc={frontmatter.hero.childImageSharp.fluid.src}
        >
          <Row>
            <Header />
          </Row>
        </Hero>
      ) : (
        <Row>
          <Header />
        </Row>
      )}

      <Row>
        <Post frontmatter={frontmatter} html={html} />
      </Row>
      <Row
        styles={{
          backgroundColor: 'var(--color-background-popout)',
        }}
      >
        <Footer />
      </Row>
    </div>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        accent
        links
        hero {
          publicURL
          childImageSharp {
            fluid(maxWidth: 2560, quality: 75) {
              src
            }
          }
        }
      }
    }
  }
`
