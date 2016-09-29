/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     08/16/2016       John Armstrong           Initial Version
 *
 * Description: This file contains functions that are used to select a batch from
 *              the batch list.
 */
(function () {
    "use strict";

    module.exports = {
        byCreateID: function (createId) {
            return new Promise(function(resolve){
            waitForBatchList();
            //Click on a batch based on its CreateID
            element(by.id('BatchItem' + createId)).click().then(
                function(){resolve();}
            )
            });
        },
        byName: function (targetBatch) {
            waitForBatchList();
            getBatchIdTags(targetBatch);
        }
    };

    function waitForBatchList() {
        //Wait for the batch list to populate
        browser.driver.wait(protractor.until.elementLocated(by.css('.bm-list-group-item')), 10000);
    }

    function getBatchIdTags(targetBatch) {
        var elemArray = [];
        element.all(by.css('.bm-list-title'))//Get all batches on the batch list
            .each(function (elem) {
                elem.getAttribute('id')
                    .then(function (idResult) {
                        elemArray.push(idResult);//For each batch on the batch list, get all the element ids
                    })
                    .thenCatch(function (error) {
                        console.log('ERROR: selecting batch ' + targetBatch + ' ' + error);
                    });
            })
            .thenFinally(function () {
            var idArray = [];
            for (var i = 0; i < elemArray.length; i++) {
                if (i % 2 === 0) {//Extract the id elements that contain the BatchId text
                    idArray.push(elemArray[i]);
                }
            }
            clickBatch(idArray, targetBatch);
        });
    }

    function clickBatch(arr, targetBatch){
            for (var i = 0; i < arr.length; i++) {
                //Check each batch by its BatchId
                (function (j) {
                    var batchElementId = arr[j];
                    element(by.id(batchElementId)).getText()
                        .then(function (currentId) {
                            if (currentId === targetBatch) {
                                element(by.id(batchElementId)).click();
                            }
                        })
                        .thenCatch (function(error) {
                                console.log();//this error is being ignored for now.
                        });
                }(i));
            }
    }

})();