import GitHub from 'github-api';
import _ from 'underscore';
import Markdown from 'react-markdown';


const RepoItem = ({name, onClickRepo, selectedRepo}) => (
  <li
    onClick={()=>{onClickRepo(name)}}
    style={selectedRepo === name ? {color: 'red'} : {}}>
    <span>{name}</span>
  </li>
)

const ReposList = ({repos, onClickRepo, selectedRepo}) => (
  <ul style={{}}>
    <h1>Repository</h1>
    {
      _.map(repos, (repo) =>
        <RepoItem key={repo.name} {...repo} selectedRepo={selectedRepo} onClickRepo={onClickRepo}/>
      )
    }
  </ul>
)


class GithubRepos extends React.Component {
  // static getInitialState(){
  //   return {repos: [], repo: null};
  // }
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      repo: null,
      files: [],
      file: null,
      fileContent: ''
    };

    this.onClickRepo = this.onClickRepo.bind(this);
    this.onClickFile = this.onClickFile.bind(this);
  }

  componentDidMount(){
    if (localStorage.token){
      this.gh = new GitHub({
        token: JSON.parse(localStorage.token).access_token
      });
      const me = this.gh.getUser()
      me.listRepos()
        .then((result) => {
          if (result.status === 200){
            let repos = _.map(result.data, repo => {
              return _.pick(repo, 'name', 'html_url', 'owner', 'default_branch', 'full_name')
            })
            this.setState({repos})
          }
        })
    }
  }

  onClickRepo(repo){
    this.setState({repo})
    let selectedRepo = _.find(this.state.repos, (r) => r.name == repo)
    this.repository = this.gh.getRepo(selectedRepo.owner.login, repo)
    this.repository.getContents(selectedRepo.default_branch, '', false)
        .then( (result) => {
          if (result.status === 200){
            let files = _.map(result.data, (file) => {
              return {..._.pick(file, 'name', 'sha', 'type'), branch: selectedRepo.default_branch}
            })
            this.setState({files})
          }
        })
  }

  onClickFile(file){
    if (file.type === 'file'){
      this.setState({file})
      this.repository.getContents(file.branch, file.name, false)
          .then( (result) => {
            if (result.status === 200){
              if (result.data.encoding === 'base64'){
                this.setState({fileContent: atob(result.data.content)})
              }
            }
          })
    }
  }

  render(){
    const { file } = this.state
    return (
      <div style={{display: 'flex'}}>
        <ReposList
          repos={this.state.repos}
          onClickRepo={this.onClickRepo}
          selectedRepo={this.state.repo}
        />

        <ul>
          <h1>Files</h1>
          {
            _.map(this.state.files, (f) => (
              f.type === 'dir' ? null : <li
                key={f.name}
                style={f.name === (file && file.name) ? {color: 'red'} : {}}
                onClick={()=>this.onClickFile(f)}
              >
                {f.name}
              </li>
            ))
          }
        </ul>

        <div style={{padding: 30}}>
          {
            (file && file.name || '').match(/\.md$/) ?
              <Markdown source={this.state.fileContent} />
            : <pre>{this.state.fileContent}</pre>
          }
        </div>

      </div>
    )
  }
}

export default GithubRepos
