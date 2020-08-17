import { authClient } from '../../libs/oauth2';
import { writeUser } from '../../services/users';

export default async (req, res) => {
    const {
        query: { code },
    } = req;
    const { refresh_token, userInfo, id_token } = await authClient(code);

    writeUser({
        ...userInfo,
        id_token,
        refresh_token,
    });

    res.redirect(`/?id_token=${id_token}`);
}
