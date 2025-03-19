import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from "../axios";
import axiosTiny from '../axiosTiny';

export const useServerStore = defineStore('server', () => {
    const serverList = ref([]);
    const vipServerList = ref([]);
    const serverListToken = ref("");
    const machineId = ref("");
    const encryptedLoginInfo = ref("");
    const selectedServer = ref(null);
    const isConnected = ref(false);
    const isChoosingServer = ref(false);
    const cacheTimer = ref(0);
    const toastStatus = ref("");

    //1. Get encrypted server list
    function initialServerList() {
        return new Promise((resolve, reject) => {
            axios.get("/api/end-user/server/list").then((response) => {
                serverListToken.value = response.data;
                resolve(response.data);
            }).catch((error) => {
                reject(error)
            })
        })
    }
    //2. Ping tiny core and get machine id
    function pingTinyCore() {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'POST',
                url: '/ping',
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: serverListToken.value.data
            };
            axiosTiny(config).then((response) => {
                machineId.value = response.data;
                resolve(response.data);
            }).catch((error) => { reject(error) });
        });
    }
    //3. Get server list with ping from backend
    function getServerList() {
        if (!serverListToken.value || serverListToken.value == "") {
            try {
                initialServerList();
            } catch {
                console.log("get server list token again")
            }
        }
        if (!machineId.value || machineId.value == "") {
            try {
                pingTinyCore();
            } catch {
                console.log("ping tiny core again")
            }
        }
        cacheTimer.value = cacheTimer.value - 1;
        if (isChoosingServer.value && serverList.value.length > 1) {
            return;
        }
        if (cacheTimer.value > 0) {
            return;
        }
        if (isConnected.value) {
            return;
        }
        return new Promise((resolve, reject) => {
            setToastStatus("ping");
            axios.post("/api/end-user/server/show", { "machine_id": machineId.value }).then((response) => {
                setToastStatus("");
                if (Array.isArray(response.data.data) && response.data.data.length > 1) {
                    serverList.value = response.data.data;
                }
                cacheTimer.value = 6;
                resolve(response.data.data);
            }).catch((error) => {
                setToastStatus("");
                reject(error);
            });
        });
    }
    //4. Select server
    function selectServer(server) {
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/server/submit", { "machine_id": machineId.value, "server": server.id }).then((response) => {
                // serverList.value = response.data.data;
                // selectedServer.value = server;
                setSelectedServer(server);
                encryptedLoginInfo.value = response.data.data;
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    //5. Login tiny core
    function loginTinyCore() {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'POST',
                url: '/login',
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: encryptedLoginInfo.value
            };
            axiosTiny(config).then((response) => {
                isConnected.value = true;
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    // Connect server
    function connectServer(server) {
        return new Promise(async (resolve) => {
            try {
                await selectServer(server);
                await loginTinyCore();
                setConnectStatus(true);
                resolve();
            } catch (error) {
                setConnectStatus(false);
                console.log("Error: ", error);
                reject(error);
            }
        });
    }

    function updateFavoriteServer(data) {
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/server/update-favorite", data).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    function getVipServerList() {
        return new Promise((resolve, reject) => {
            axios.get("/api/end-user/server/vip-server").then((response) => {
                vipServerList.value = response?.data?.data || [];
                resolve(vipServerList.value);
            }).catch((error) => {
                vipServerList.value = [];
                reject(error);
            });
        });
    }

    function isJSONString(str) {
        if (typeof str !== "string") return false;
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }

    function setSelectedServer(server) {
        selectedServer.value = server;
        localStorage.removeItem("selectedServer");
        if (server) {
            localStorage.setItem("selectedServer", JSON.stringify(server));
        }
    }

    function getSelectedServerFromStorage() {
        let server = localStorage.getItem("selectedServer");
        selectedServer.value = isJSONString(server) ? JSON.parse(server) : null;
    }

    function setConnectStatus(value) {
        isConnected.value = value;
        if (value) {
            setToastStatus("connected");
        } else {
            setToastStatus("");
        }
    }

    function setChoosingServerOpen(value) {
        isChoosingServer.value = value;
    }

    function setToastStatus(status) {
        toastStatus.value = status;
    }

    return {
        initialServerList,
        pingTinyCore,
        getServerList,
        selectServer,
        loginTinyCore,
        connectServer,
        setConnectStatus,
        setChoosingServerOpen,
        setSelectedServer,
        getSelectedServerFromStorage,
        setToastStatus,
        updateFavoriteServer,
        getVipServerList,
        serverList,
        vipServerList,
        selectedServer,
        isConnected,
        isChoosingServer,
        machineId,
        toastStatus
    }
})
