/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     08/30/2016       John Armstrong           Initial Version
 *                     09/22/2016       John Armstrong           Added recursive function to clickMenuButton
 *
 *
 * Description: Contains functions that will execute actions against the menu buttons
 *              on the left side of the screen of the Batches page. When a new button is
 *              added to the menu, add it to the 'switch' in getButtonElementID().
 *
 */
(function () {
    "use strict";
    var batchPolicies = require('./../Batch Server/BatchPolicies');

    function getButtonElementID(buttonName) {
        buttonName = buttonName.toLowerCase();
        switch (buttonName) {
            case 'auto':
                buttonName = 'command_AUTO-MODE';
                break;
            case 'semi-auto':
                buttonName = 'command_SEMIAUTO-MODE';
                break;
            case 'manual':
                buttonName = 'command_MAN-MODE';
                break;
            case 'start':
                buttonName = 'command_START';
                break;
            case 'stop':
                buttonName = 'command_STOP';
                break;
            case 'hold':
                buttonName = 'command_HOLD';
                break;
            case 'abort':
                buttonName = 'command_ABORT';
                break;
            case 'restart':
                buttonName = 'command_RESTART';
                break;
            case 'resume':
                buttonName = 'command_RESUME';
                break;
            case 'remove':
                buttonName = 'command_REMOVE';
                break;
            case 'timer-reset':
                buttonName = 'command_TIMER-RESET';
                break;
            case 'timer-complete':
                buttonName = 'command_TIMER-COMPLETE';
                break;
            case 'comment':
                buttonName = 'command_COMMENT';
                break;
            default:
                break;
        }
        return buttonName;
    }

    module.exports = {
        clickMenuButton: function (button) {
            return new Promise(function (resolve, reject) {
                var clickAttempts = 0;
                button = getButtonElementID(button);
                function buttonClick(button) {
                    element(by.id(button)).click()
                        .then(function () {
                                batchPolicies.getConfirmMask()
                                    .then(function (confirmEnabled) {
                                        if (confirmEnabled || button === 'command_STOP' || button === 'command_ABORT') {
                                            //Click the 'Yes' button in the confirmation modal that appears after clicking a command button
                                            element.all(by.css('.flex-message-button')).first().click()
                                                .then(function () {
                                                        console.log('button clicked: ' + button);
                                                        resolve();
                                                    },
                                                    function (err) {
                                                        if (clickAttempts <= 5) {
                                                            clickAttempts++;
                                                            browser.driver.sleep(500)
                                                                .then(function () {
                                                                    console.log('Button click failed, attempting again for ' + button);
                                                                    buttonClick(button);
                                                                });
                                                        }
                                                        else{
                                                            reject('Failed to click on button ' + button);
                                                        }
                                                    });
                                        }
                                        else {
                                            resolve();
                                            console.log('button clicked: ' + button);
                                        }
                                    })
                            },
                            function (err) {
                                if (clickAttempts <= 5) {
                                    clickAttempts++;
                                    browser.driver.sleep(500)
                                        .then(function () {
                                            console.log('Button click failed, attempting again for ' + button);
                                            buttonClick(button);
                                        });
                                }else{
                                    reject('Failed to click on button ' + button);
                                }
                            });
                }
                buttonClick(button);
            });
        },
        isVisible: function (button, visible) {
            return new Promise(function (resolve, reject) {
                var attempts = 0;
                button = getButtonElementID(button);
                function checkVisibility() {
                    browser.driver.sleep(500)
                        .then(function () {//**********************************debugging this**************************************************
                            browser.findElement(by.id(button)).isDisplayed()
                                .then(function (result) {
                                        if (result) {
                                            if (visible) {
                                                //Element is visible - We want it visible - PASS
                                                expect(result).toBe(true);
                                                resolve();
                                            }
                                            else {
                                                //Element is visible - We don't want it visible - FAIL
                                                console.log('This is the first else ! Is visible, dont want it to be' + button);
                                                if (attempts <= 3) {
                                                    attempts++;
                                                    checkVisibility();
                                                }
                                                else {
                                                    expect(result).toBe(false);
                                                    reject('Error: ' + button + ' is visible when is should not be!');
                                                }
                                            }
                                        }
                                        else {
                                            if (!visible) {
                                                //Element is NOT visible - We don't want it visible - PASS
                                                expect(result).toBe(false);
                                                resolve();
                                            }
                                            else {
                                                //Element is NOT visible - We want it visible - FAIL
                                                console.log('This is second else, Not visibile want it to be' + button);
                                                if (attempts <= 3) {
                                                    attempts++;
                                                    checkVisibility();
                                                }
                                                else {
                                                    expect(result).toBe(true);
                                                    reject('Error: ' + button + ' is NOT visible when is should not be!');
                                                }
                                            }
                                        }
                                    },
                                    function (err) {
                                        reject('ERROR: Utility Modules/Batches Page/ActionBarButtons.js; Function: isVisible(' + button + ') ' + err)
                                    });
                        });
                }

                checkVisibility();
            });
        }
    }
})();