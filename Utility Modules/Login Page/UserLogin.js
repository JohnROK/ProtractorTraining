/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     08/16/2016       John Armstrong           Initial Version
 *
 *
 * Description: This file contains functions that are used to login to the Mobility site
 *
 */
(function () {
    "use strict";
    module.exports = {
        login: function (userName, userPassword) {
            return new Promise(function (resolve, reject) {
                element(by.id('inputUsername')).sendKeys(userName)
                    .then(function () {
                        return element(by.id('inputPassword')).sendKeys(userPassword)
                    })
                    .then(function () {
                        return element(by.id('buttonLogin')).click()
                    })
                    .then(function () {
                        resolve();
                    })
                    .thenCatch(function (err) {
                        reject('Error logging into client: ' + err);
                    });
            });
        }
    };
})();