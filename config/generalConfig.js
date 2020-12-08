
var serverUrl = 'http://localhost:3000';

var jwtSession = { session: false }

// change the table prefix name as per
var table_prefix = 'tablename_';


module.exports = {
    table_prefix: table_prefix,
    serverUrl: serverUrl,
    jwtSession: jwtSession
}