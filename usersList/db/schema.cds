using { Currency, cuid, managed, sap} from '@sap/cds/common';

namespace users.Lists;

entity Users : cuid, managed {
    name : String;
    lastname : String;
    age : String;
    phone : String;
    email : String;
}