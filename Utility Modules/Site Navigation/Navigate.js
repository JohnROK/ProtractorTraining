/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     08/16/2016       John Armstrong           Initial Version
 *
 *
 * Description: This file contains functions that are used to navigate the Mobility
 *              sites various pages.
 *
 */
(function () {
    'use strict';
    module.exports = {
        toPage: function (pageName) {
            return new Promise(function (resolve, reject) {
                var pageToSelect = 'raNavItem_batches';
                pageName = pageName.toLowerCase();
                //Determine page to navigate to
                switch (pageName) {
                    case 'batches':
                        pageToSelect = 'raNavItem_batches';
                        break;
                    case 'prompts':
                        pageToSelect = 'raNavItem_prompts';
                        break;
                    case 'equipment':
                        pageToSelect = 'raNavItem_equipment';
                        break;
                    case 'diagnostics':
                        pageToSelect = 'raNavItem_diagnostics';
                        break;
                    default:
                        break;
                }
                element(by.id(pageToSelect)).click().then(
                    function () {
                        resolve();
                    },
                    function (error) {
                        reject('navigate toPage(' + pageName + ') failed! ' + error);
                    });
            });
        },
        toInnerPage: function (childPage) {
            return new Promise(function (resolve, reject) {
                childPage = childPage.toLowerCase();
                switch (childPage) {
                    case 'summary':
                        childPage = 'tabitem_summary';
                        break;
                    case 'detail':
                        childPage = 'tabitem_detail';
                        break;
                    case 'general':
                        childPage = 'tabitem_general';
                        break;
                    case 'server':
                        childPage = 'tabitemLargeserver';
                        break;
                    case 'statistics':
                        childPage = 'tabitemLargeserver';
                        break;
                    default:
                        break;
                }
                element(by.id(childPage)).click()
                    .then(function () {
                            resolve();
                        },
                        function (error) {
                            reject('navigate toInnerPage(' + childPage + ') failed! ' + error);
                        });
            });
        }
    };
})();