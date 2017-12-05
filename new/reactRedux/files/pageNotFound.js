import React, { Component } from 'react'

class PageNotFound extends Component {
  render() {
    return (
      <div>Error 404: Page Not Found for { location.pathname }</div>
    )
  }
}

export default PageNotFound