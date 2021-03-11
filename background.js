chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log({ message });
  if (message.action === "log") {
    console.log({ message });
  } else if (message.action === "createGroup") {
    const { urls, title, color } = message.data;
    const tabs = await Promise.all(
      urls.map(async (url) => chrome.tabs.create({ url }))
    );
    console.log({ tabs });
    const groupOptions = { tabIds: tabs.map((t) => t.id) };
    chrome.tabs.group(groupOptions, (groupId) => {
      console.log(groupId);
      chrome.tabGroups.update(groupId, { title, color });
    });
  } else if (message.action === "getBookmarkGroups") {
    sendResponse(groups);
  } else if (message.action === "closeUngrouped") {
    const tabs = await new Promise((r) =>
      chrome.tabs.query(
        {
          currentWindow: true,
        },
        r
      )
    );
    chrome.tabs.remove(
      tabs
        .filter(
          (t) =>
            t.groupId == chrome.tabGroups.TAB_GROUP_ID_NONE && t.pinned == false
        )
        .map((t) => t.id)
    );
  }
});

async function getBookMarkGroups() {}
