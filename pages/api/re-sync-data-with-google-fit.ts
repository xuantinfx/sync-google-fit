import {collections, getDb} from "../../db/mongodb";
import { syncDailyDataForOnlyUser } from "../../jobs/syncDailyData";

export default async (req, res) => {
    const {
        query: { email },
    } = req;
    if (!email) {
        res.send({
            error: 'Email cannot empty',
        });
        return ;
    }
    try {
        const db = await getDb();
        const userCollection = await db.collection(collections.users);
        const currentUser = await userCollection.findOne({ email });
        await syncDailyDataForOnlyUser(currentUser);
        res.end();
    } catch (e) {
        res.send({
            error: 'Cannot re sync with Google Fit',
        });
    }
}
