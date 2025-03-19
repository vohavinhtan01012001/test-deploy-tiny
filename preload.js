const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("greeting", {
    node: () => process.versions.node,
    ping: () => ipcRenderer.invoke("ping"),
});

contextBridge.exposeInMainWorld("electron", {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});
