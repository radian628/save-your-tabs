// chrome.storage.local.get(["savedText"], function (savedText) {
//     if (!Array.isArray(savedText.savedText)) {
//         chrome.storage.local.set({ savedText: [] }, function () {
//             console.log("saved");
//         });
//     }
// });
chrome.storage.local.get(["savedTabs"], function (savedTabs) {
    if (!Array.isArray(savedTabs.savedTabs)) {
        chrome.storage.local.set({ savedTabs: [] }, function () {
            console.log("saved");
        });
    }
});
// chrome.extension.onRequest.addListener(function (request, sender, callback) {
//     console.log(request.action);
//     if (request.action == "createSaveContextOption") {
//         chrome.contextMenus.create({
//             title: "Save Selected",
//             contexts: ["selection", "link"],
//             id: "save-selected"
//         });
//         chrome.contextMenus.onClicked.addListener(function (info, tab) {
//             chrome.storage.local.get(["savedText"], function (savedText) {
//                 chrome.storage.local.set({ savedText: savedText.savedText.concat([info.selectionText || info.linkUrl]) }, function () {
//                     console.log("saved");
//                 });
//             });
//         });
//     }
// });

chrome.extension.onRequest.addListener(function (request, sender, callback) {
    switch (request.action) {
        case "SaveTabs":
            chrome.tabs.getAllInWindow(function (tabs) {
                let tabUrls = tabs.map(tab => tab.url);
                let urlString = "https://radian628.github.io/multilink/link/index.html?links=" + encodeURIComponent(tabUrls.join("\n"));
                chrome.storage.local.get(["savedTabs"], function (savedTabs) {
                    console.log(savedTabs);
                    chrome.storage.local.set({ savedTabs: savedTabs.savedTabs.concat({ url: urlString, tabName: request.tabName }) }, function () {
                        chrome.extension.sendRequest({ "action": "UpdateTabList" });
                    });
                });
            });
            break;
        case "DeleteTabs":                
            chrome.storage.local.get(["savedTabs"], function (savedTabs) {
                savedTabs.savedTabs.splice(request.index, 1);
                chrome.storage.local.set({ savedTabs: savedTabs.savedTabs }, function () {
                    chrome.extension.sendRequest({ "action": "UpdateTabList" });
                });
            });
            break;
    }
});