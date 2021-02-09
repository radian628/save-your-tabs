document.getElementById("save-button").onclick = function () {
    chrome.extension.sendRequest({ action: "SaveTabs", tabName: document.getElementById("tab-name").value });
}

let tabList = document.getElementById("tab-list");

function generateTabList() {
    while (tabList.firstChild) {
        tabList.removeChild(tabList.firstChild);
    }
    chrome.storage.local.get(["savedTabs"], function (data) {
        data.savedTabs.forEach(function (tabs, i) {
            let tabContainer = document.createElement("div");
            tabContainer.className = "tab-container";

            let openTabs = document.createElement("a");
            openTabs.innerText = tabs.tabName;
            openTabs.href = tabs.url;
            openTabs.target = "_blank";

            let deleteTabs = document.createElement("button");
            deleteTabs.innerText = "Delete"
            deleteTabs.dataset.index = i;
            deleteTabs.onclick = function (event) {
                chrome.extension.sendRequest({ action: "DeleteTabs", index: event.currentTarget.dataset.index });
            }

            tabContainer.appendChild(openTabs);
            tabContainer.appendChild(deleteTabs);

            tabList.appendChild(tabContainer);
        });
    });
}


generateTabList();

chrome.extension.onRequest.addListener(function (request, sender, callback) {
    switch (request.action) {
        case "UpdateTabList":
            generateTabList();
            break;
    }
});