const User = require('../DB/user')
const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client(CLIENT_ID);

const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload.sub;
    const name = payload.name;
    const email = payload.email;
    return { userId, name, email };
};

const google_cred  = async (token) =>{

    const token = token;

    try
    {
        const{userId,name,email} = await verifyGoogleToken(token);
        const user = User.findOne({googleID:userId});

        if(!user)
        {
            user = new User({googleId: userId,name,email})
        }
        user.googleAccessToken = token;
        await user.save();
        const token = await user.generateToken();

        res.send({ token });
    }
    catch (e){
        res.status(400).send({ error: 'Invalid token' });
    }
}

module.exports = google_cred