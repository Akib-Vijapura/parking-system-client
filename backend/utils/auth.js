import { SignJWT, jwtVerify } from 'jose'

export class AuthError extends Error {}


/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(token) {
  //console.log("VERIFY AUTH")
  logger.info("verifyAuth token=",token)

  if (!token) {
    return [0, "Missing user token"]
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    return [1, verified.payload]
  } catch (err) {
    return [0, err]
  }
}

/* PAYLOAD EXAMPLE
{
  "user": {
    "_id": "65b38a07b5875079c66286b3",
    "username": "akibv",
    "isAdmin": true
  },
  "iat": 1706442634,
  "exp": 1706529034
}
*/

/**
 * Generate the user token cookie and return it.
 */
export async function generateUserToken(user) {
  const token = await new SignJWT({ user }) // details to  encode in the token
    .setProtectedHeader({ alg: 'HS256' }) // algorithm
    .setJti()
    .setIssuedAt()  
    .setExpirationTime(process.env.JWT_EXPIRE)    // token expiration time, e.g., "1 day"
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    //console.log("setUserCookie = " , token);

  return token;
}


/**
 * Verifies the user's role is admin type, if not throw eror
 * Returns 0 -> Non Admin
 *         1 -> Admin
 */
export function isAdmin(verifiedTokenPayload) {
  
  if(verifiedTokenPayload && !verifiedTokenPayload.user.isAdmin) {
    //console.log("not admin, so not allowed")
    return 0;
    //throw new AuthError('Only admin allowed')
  } else {
    //console.log("User is admin, hence allow access for this route")
    return 1;
  }

}
