### Where to get pem file

```
If the token in question is signed with RS256 then you can quickly obtain the public key to use for validation by downloading it from https://[your_domain].auth0.com/pem. Have in mind this is just a quick shortcut to get to the key and be able to validate tokens in jwt.io. For applications and resource servers that need to validate JWT's that they receive they should obtain the keys from https://[your_domain].auth0.com/.well-known/jwks.json as the response to that endpoint follows a certain schema that is already supported in many libraries.
```

From: https://community.auth0.com/questions/10087/using-jwtio-to-read-an-auth0-generated-token-where

For Offical doc on JWKS see: https://auth0.com/docs/jwks