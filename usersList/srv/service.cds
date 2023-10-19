using { users.Lists as db } from '../db/schema';

service List {
    entity Users as projection on db.Users;
}
