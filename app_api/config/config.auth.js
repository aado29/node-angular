let authConfig = {

  facebookAuth: {
    clientID: '504159539780594',
    clientSecret: 'c3cd20204625170b718f6e5fb374cf4e',
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback'
  },
  twitterAuth: {
    consumerKey: 'your-consumer-key-here',
    consumerSecret: 'your-client-secret-here',
    callbackURL: 'http://localhost:8080/auth/twitter/callback'
  },
  googleAuth: {
    clientID: 'your-secret-clientID-here',
    clientSecret: 'your-client-secret-here',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  }

}

export default authConfig
