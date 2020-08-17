import * as fs from 'fs';
import _ from 'lodash';

const dataPath = 'models/users.json';

interface UserDataType {
    refresh_token: string;
}

let listUsers: UserDataType[] = [];

try {
    listUsers = JSON.parse(fs.readFileSync(dataPath).toString()) as UserDataType[];
} catch (e) {
    console.log(e);
}

export const writeUser = (user: UserDataType) => {
    listUsers.push(user);
    fs.writeFileSync(dataPath, JSON.stringify(listUsers, null, 4));
    return user;
};

export const getListUsers = () => {
    return listUsers;
};

export const getUserByEmail = (email: string) => {
    return _.find(listUsers, u => u.email === email);
};
