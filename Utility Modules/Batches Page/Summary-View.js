/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     08/18/2016       John Armstrong           Initial Version
 *
 * Description: This file contains functions for the Summary Page in the Batches Page
 *
 */
(function () {
    "use strict";

    function compareModes(baseArray, objArray) {
        if (baseArray.length !== objArray.length) {
            return false;
        }
        var isEqual = true;
        for (var i = 0; i < objArray.length; i++) {
            if (baseArray[i] !== objArray[i].mode) {
                isEqual = false;
            }
        }
        return isEqual;
    }

    module.exports = {
        verifyAllModes: function (baseArray) {
            return new Promise(function (resolve, reject) {
                //Need to find a better method for this wait, for now will sleep
                //browser.driver.wait(protractor.until.elementLocated(by.css('.ui-grid-tree-header-row')), 10000)
                    browser.driver.sleep(5000)
                    .then(function(){
                        var script = "return angular.element(document.querySelector('#procedureSummaryGrid')).scope().$parent.$parent.vm.batchStepHierOptions.data";
                        browser.executeScript(script).then(
                            function (result) {
                                var determinant = true;
                                if (compareModes(baseArray, result)) {
                                    //If the Mode arrays match - PASS
                                    console.log('Batch Summary Page Modes: Success');
                                    expect(determinant).toBe(true);
                                    resolve();
                                }
                                else {
                                    //If the Mode arrays don't match - FAIL
                                    expect(determinant).toBe(false);
                                    console.log('FAIL: Mode Arrays were not equal.');
                                    resolve();
                                }
                            },
                            function (error) {
                                reject('ERROR: Utility Modules/Batches Page/Summary-View.js; Function: verifyAllModes() ' + error);
                            });
                    });
            });
        }
    }
})();