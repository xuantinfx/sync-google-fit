import {getLeaderBoard} from "../../services/users";

export default async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send({
    data: await getLeaderBoard(),
  });
}
