const ven = require('../DB/vendor')
const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client(CLIENT_ID); // CLIENT_ID IS MISSING NEED TO BE IN ENV

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

const google_cred_ven  = async (token) =>{

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
        const token = await user.generateToken();
        user.token = token;
        await user.save();
       

        res.send({ token });
    }
    catch (e){
        res.status(400).send({ error: 'Invalid token' });
    }
}

module.exports = google_cred_ven