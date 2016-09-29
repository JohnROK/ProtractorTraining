/**
 * Created By: John Armstrong
 *
 * Change History:     Date             Developer                Description
 *                     09/28/2016       John Armstrong           Initial Version
 *
 *
 * Description: Contains functions that will execute actions against the elements
 *              located on the equipment page.
 */
(function () {
    "use strict";
    var equipmentObj = {};

    module.exports = {
        insertFilterText: function (filterText) {
            return new Promise(function (resolve, reject) {
                element(by.id('inputFilterText')).sendKeys(filterText)
                    .then(function () {
                        resolve('Success:');
                    })
                    .thenCatch(function (err) {
                        reject('Error occurred while entering text into the equipment page filter bar. ' + err);
                    });
            });
        },
        clearFilterBar: function () {
            return new Promise(function (resolve, reject) {
                element(by.id('buttonClearFilter')).click()
                    .then(function () {
                        resolve('Success:');
                    })
                    .thenCatch(function (err) {
                        reject('Error occurred attempting to clear the text from the equipment page filter bar. ' + err);
                    });
            });
        },
        getEquipmentData: function () {
            return new Promise(function (resolve, reject) {
                var equipmentArr = [];
                waitForEquipmentList()
                    .then(function () {
                        return element.all(by.repeater('value in vm.equipmentList | toArray | raItemFilterMatchItems | orderBy:vm.sortFunction'))
                            .each(function (elem) {
                                return elem.getText()
                                    .then(function (elemText) {
                                        equipmentArr = elemText.split("\n");
                                        equipmentCreator(equipmentArr);
                                    })
                            })
                            .thenFinally(function () {
                                resolve(equipmentObj);
                            });
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            });
        }
    };

    function waitForEquipmentList() {
        return new Promise(function (resolve, reject) {
            browser.driver.wait(protractor.until.elementLocated(by.css('.bm-list-group-item')), 20000)
                .then(function () {
                    resolve('Success');
                })
                .thenCatch(function (err) {
                    reject('Error waiting for equipment list to appear. ' + err);
                });
        });

    }

    function equipmentCreator(equipmentData) {
        var arrSize = equipmentData.length;

        if (arrSize === 5) {
            var name = equipmentData[0],
                batch = equipmentData[1],
                unit = equipmentData[2],
                state = equipmentData[3],
                stepIndex = equipmentData[4];

            equipmentObj[name] = {
                'batch': batch,
                'unit': unit,
                'state': state,
                'stepIndex': stepIndex
            };
        }
        else if (arrSize === 4) {
            var name2 = equipmentData[0],
                unit2 = equipmentData[1],
                state2 = equipmentData[2],
                stepIndex2 = equipmentData[3];

            equipmentObj[name2] = {
                'unit': unit2,
                'state': state2,
                'stepIndex': stepIndex2
            };
        }
    }

})();