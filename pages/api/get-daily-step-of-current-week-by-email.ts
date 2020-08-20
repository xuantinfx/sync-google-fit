import {getDailyStepOfCurrentWeekByEmail} from "../../services/users";
import _ from 'lodash';

export default async (req, res) => {
    const {
        query: { email },
    } = req;
    if (email) {
        const dailyStepByEmail = await getDailyStepOfCurrentWeekByEmail(email);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send({
            data: _.orderBy(dailyStepByEmail, 'startDate', 'asc'),
        });
    } else {
        res.send({
            error: 'Email cannot empty',
        });
    }
}
