function log(message) {
  chrome.runtime.sendMessage({ action: "log", data: message });
}

function createGroup(name, color, urls) {
  chrome.runtime.sendMessage({
    action: "createGroup",
    data: { title: name, urls, color },
  });
}

const colors = [
  "grey",
  "blue",
  "red",
  "yellow",
  "green",
  "pink",
  "purple",
  "cyan",
];

async function buildGroupOptions() {
  const groupNode = (
    await new Promise((r) => chrome.bookmarks.search({ title: "Groups" }, r))
  )[0];
  const groups = await new Promise((r) =>
    chrome.bookmarks.getChildren(groupNode.id, r)
  );
  const list = document.getElementById("groups");
  const items = groups.forEach(async (g, i) => {
    const children = await new Promise((r) =>
      chrome.bookmarks.getChildren(g.id, r)
    );
    const li = document.createElement("li");
    const text = document.createTextNode(g.title);
    const button = document.createElement("button");
    const color = colors[i % colors.length];

    button.textContent = "Open";
    li.append(text);
    li.append(button);
    list.append(li);
    button.addEventListener("click", () => {
      createGroup(
        g.title,
        color,
        children.map((c) => c.url)
      );
    });
  });
}

function closeUngrouped() {
  chrome.runtime.sendMessage({ action: "closeUngrouped" });
}

buildGroupOptions();
document
  .getElementById("closeUngrouped")
  .addEventListener("click", closeUngrouped);
