const CLIENT_ID = 'cf56c38082267ae13bdf';

export default () => {
  const OAUTH_URL = `https://github.com/login/oauth/authorize?scope=repo&client_id=${CLIENT_ID}`

  return (
    <div>
      <p>
        Well, hello there!
      </p>
      <p>
        We're going to now talk to the GitHub API. Ready?
      </p>
      <p>
        <a href={OAUTH_URL}>Click here</a> to begin!
      </p>
    </div>
  )
}
