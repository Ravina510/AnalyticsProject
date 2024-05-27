const sql = require('mssql/msnodesqlv8');

var config = {
    database: "TASAnalytics",
    server: ".",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
    }
};

sql.connect(config, function (err) {

    if (err) {
        //console.log(err);
    }
});

var request = new sql.Request();

module.exports = { request, sql, config };