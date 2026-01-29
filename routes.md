# DEV-TINDER APIs

## authRouter
- POST /signup
- POST /Login
- POST /logout

## profileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
### handle both api in one
- POST /request/send/:status/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
### handle both api in one
- POST /request/review/:status/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed