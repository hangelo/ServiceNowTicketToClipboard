async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    // "tab" will either be a "tabs.Tab" instance or "undefined".
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

var checkPageButton = document.getElementById('checkPage');
checkPageButton.addEventListener('click', async() => {
    let inputtag = document.getElementById('sys_readonly.incident.number');
    console.log('10');
    console.log(inputtag);
    
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: setBorderColor
    });
});
    
function setBorderColor() {
    // Sometimes the content is shown inside an iframe
    var doc = document.querySelector('iframe[id="gsft_main"]');
    if (doc != null) {
        doc = doc.contentWindow.document;
    }
    else {
        doc = document;
    }

    // Get the values from just the fields we want
    var ticketNumber = doc.getElementById('sys_readonly.incident.number').value;
    var ticketShortDescription = doc.getElementById('incident.short_description').value;
    var ticketDescription = doc.getElementById('incident.description').value;
    var ticketRequester = doc.getElementById('sys_readonly.incident.opened_by.name').value;

    ticketDescription = ticketDescription.replaceAll("\n\n", "\n");

    var textToCopy = '### ' + ticketNumber + "\n" + '> ' + ticketShortDescription + "\n" + '>' + "\n\n" + '> ' + ticketDescription + "\n" + '>' + "\n" + '- Requester: ' + ticketRequester + "\n" + '- ';

    // Copy content to clipboard
    var dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = textToCopy;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}
