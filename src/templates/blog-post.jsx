import React from 'react'
import { graphql } from 'gatsby'

import SEO from '../components/seo'
import Row from '../components/row'
import Header from '../components/header'
import Post from '../components/post'
import Footer from '../components/footer'

const BlogPostTemplate = ({ data }) => {
  const { frontmatter, excerpt, html } = data.markdownRemark

  return (
    <div>
      <Row>
        <Header />
      </Row>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description || excerpt}
      />
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
      }
    }
  }
`
