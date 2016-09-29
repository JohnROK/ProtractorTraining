/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     08/16/2016       John Armstrong           Initial Version
 *
 *
 * Description: This is the configuration file for the Mode test suite.
 *
 */
var loginPage = require('./../../Utility Modules/Login Page/UserLogin'),
    batchSvrAPI = require('./../../Utility Modules/Batch Server/BatchServerInterface')();

exports.config = {
    //seleniumAddress: 'http://10.85.66.77:4444/wd/hub', enable and update selenium address if running remotely

    capabilities: {
        browserName: 'chrome',
        count: 1
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 432000000,
        isVerbose: true,
        includeStackTrace: true
    },
    suites: {
        SFC_Commands: 'Test Cases/*.js'
    },
    framework: 'jasmine2',
    onPrepare: function () {
        var host = 'localhost:443';
        var username = 'sup1';
        var password = 'password';

        //Setup Jasmine reports
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: 'testResults',
            filePrefix: 'Test_Results'
        }));

        //Establish connection with BatchServer interface & log into Batch View client
        return batchSvrAPI.connect(host, username, password)
            .then(function () {
                //Open FT Batch View in browser and login
                browser.get('https://' + host);
                loginPage.login(username, password);
            })
            .catch(function(err){
                console.log('This is an error from BatchServerInterface connect() ' + err);
            })
    }
};
