import { authClient } from '../../libs/oauth2';
import { writeUser } from '../../services/users';
import {collections, getDb} from "../../db/mongodb";
import { syncDailyDataForOnlyUser } from "../../jobs/syncDailyData";

export default async (req, res) => {
    const {
        query: { code },
    } = req;
    const { refresh_token, userInfo, id_token } = await authClient(code);

    await writeUser({
        ...userInfo,
        id_token,
        refresh_token,
    });

    const db = await getDb();
    const userCollection = await db.collection(collections.users);
    const currentUser = await userCollection.findOne({ email: userInfo.email });
    await syncDailyDataForOnlyUser(currentUser);

    res.redirect(`/?id_token=${id_token}`);
}
