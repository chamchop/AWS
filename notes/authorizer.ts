import { APIGatewayTokenAuthorizerEvent, Context, AuthResponse, PolicyDocument, APIGatewaySimpleAuthorizerResult } from 'aws-lambda';

const { CognitoJwtVerifier } = require("aws-jwt-verify");
const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID;

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USERPOOL_ID,
    tokenUse: "id",
    clientId: COGNITO_WEB_CLIENT_ID
})

const generatePolicy = (principalId, effect, resource): AuthResponse => {
    let authResponse = {} as AuthResponse;
    authResponse.principalId = principalId;
    
    if (effect && resource) {
        let policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                Effect: effect,
                Resource: resource,
                Action: "execute-api:Invoke"
                },
        ],
        };
        authResponse.policyDocument = policyDocument
    }

    authResponse.context = {
        foo: "bar"
    }

    console.log(JSON.stringify(authResponse));
    return authResponse;
}

export const handler = async (event: APIGatewayTokenAuthorizerEvent, context: Context, callback: any) => {
    var token = event.authorizationToken;
    switch(token) {
        case "allow":
            callback(null, generatePolicy("user", "Allow", event.methodArn))
            break;
        case "deny":
            callback(null, generatePolicy("user", "Deny", event.methodArn))
            break;
        default:
            callback("Error: Invalid token");
    }
};