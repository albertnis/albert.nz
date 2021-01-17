import React from 'react'
import { graphql, Link } from 'gatsby'

import SEO from '../components/seo'
import Header from '../components/header'
import Row from '../components/row'
import Zone from '../components/zone'

const ContactPage = ({ data }) => (
  <div>
    <Row>
      <Header />
    </Row>
    <Row>
      <Zone className="markdown-body">
        <h5>Personal contact information</h5>
        <p>
          Email me at{' '}
          <a href="mailto:albertnis@gmail.com">albertnis@gmail.com</a> or text
          me at <a href="tel:+64226018037">022 601 8037</a>.
        </p>
      </Zone>
    </Row>
  </div>
)

export default ContactPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
