import React from 'react';
import _ from 'underscore';
import Router from 'next/router';


import { getGithubToken } from '../../utils/github.js';


class GithubOauth extends React.Component {
  static async getInitialProps ({query}) {
    let token = await getGithubToken(query.code)
    if (token.error){
      token = {}
    }
    return {query, token}
  }

  componentDidMount(){
    if (!_.isEmpty(this.props.token)){
      localStorage.setItem('token', JSON.stringify(this.props.token))
      Router.push('/github/repos')
    }
  }

  render(){
    return (
      <div>Welcome to Github Pages!</div>
    )
  }
}

export default GithubOauth
