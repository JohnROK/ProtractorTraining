/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     08/18/2016       John Armstrong           Initial Version
 *                     09/21/2016       John Armstrong           Added selectBreadCrumb()
 *                     09/22/2016       John Armstrong           Added recursive function to drillIntoStep()
 *                                                               and highlightStep()
 *
 * Description: This file contains functions for the Detail Page in the Batches Page
 *
 */
(function () {
    "use strict";

    module.exports = {
        drillIntoStep: function (stepName) {
            return new Promise(function (resolve, reject) {
                var drillAttempts = 0;
                function drill(step) {
                    var query = "return angular.element(document.querySelector('#mySFCDiagram')).scope().raTestDrillIn('" + stepName + "')";
                    browser.executeScript(query)
                        .then(function (response) {
                                if (response) {
                                    console.log('drillIntoStep(' + stepName + '): Success');
                                    resolve();
                                }
                                else {
                                    if (drillAttempts <= 20) {
                                        drillAttempts++;
                                        browser.driver.sleep(500)
                                            .then(function () {
                                                drill(step);
                                            });
                                    }
                                    else{
                                        reject('Failed to drill into step ' + step);
                                    }
                                }
                            },
                            function (error) {
                                reject('ERROR: Utility Modules/Batches Page/Detail-View.js; Function: drillIntoStep() ' + error);
                            });
                }
                drill(stepName);
            });
        },
        highlightStep: function (stepName) {
            return new Promise(function (resolve, reject) {
                var highlightAttempts = 0;
                function highlight(step) {
                    var query = "return angular.element(document.querySelector('#mySFCDiagram')).scope().raTestViewStepDetails('" + step + "')";
                    browser.executeScript(query)
                        .then(function (response) {
                                if (response) {
                                    console.log('highlightStep(' + step + '): Success');
                                    resolve();
                                }
                                else {
                                    if (highlightAttempts <= 20) {
                                        highlightAttempts++;
                                        browser.driver.sleep(500)
                                            .then(function () {
                                                highlight(step);
                                            });
                                    }
                                    else {
                                        reject('Failed to highlight step ' + step);
                                    }
                                }
                            },
                            function (error) {
                                reject('ERROR: Utility Modules/Batches Page/Detail-View.js; Function: highlightStep() ' + error);
                            });
                }
                highlight(stepName);
            });
        },
        selectBreadCrumb: function (stepName) {
            return new Promise(function (resolve, reject) {
                var targetBreadcrumb = null;
                element.all(by.className('ra-h-breadcrumb-item'))
                    .each(function (breadcrumb) {
                        breadcrumb.getText()
                            .then(function (text) {
                                if (stepName === text) {
                                    targetBreadcrumb = breadcrumb;
                                }
                            });
                    })
                    .thenFinally(function () {
                        targetBreadcrumb.click();
                        resolve();
                    });
            });
        }
    };

})();