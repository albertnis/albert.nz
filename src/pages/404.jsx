import React from 'react'
import { graphql, Link } from 'gatsby'

import Seo from '../components/seo'
import Header from '../components/header'
import Row from '../components/row'
import Zone from '../components/zone'

const NotFoundPage = ({ data }) => (
  <div>
    <Row>
      <Header />
    </Row>
    <Seo title="404: Not Found" />
    <Row>
      <Zone className="markdown-body">
        <h5>Page not found</h5>
        <p>The page you requested does not exist.</p>
        <Link to="/">Back to homepage</Link>
      </Zone>
    </Row>
  </div>
)

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
