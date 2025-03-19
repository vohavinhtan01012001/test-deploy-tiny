import { useLoadingStore } from "@/stores/loading";
import { useServerStore } from "@/stores/server";
import { useSnackbarStore } from "@/stores/snackbar";
import Flag from "@/assets/images/flag.png";

export const getServerFlag = (server) => {
    if(server?.country_code && server?.country_code != 'EU' && server?.country_code != 'UK') {
        return {
            src: 'https://flagsapi.com/' + server?.country_code + '/flat/64.png',
            alt: server.country_code
        };
    }
    return {
        src: Flag,
        alt: "Server Flag"
    };
}

export const getServerPingStyle = (ping) => {
    if (ping) {
        if (ping <= 90) {
            return 'ping-low';
        } else if (ping <= 150) {
            return 'ping-medium';
        }
    }
    return 'ping';
}

export const connectServer = async (server) => {
    const loadingStore = useLoadingStore();
    const serverStore = useServerStore();
    try {
        loadingStore.open();
        await serverStore.connectServer(server);
    } finally {
        loadingStore.close();
    }
}

export const connectGameServer = async (game) => {
    const loadingStore = useLoadingStore();
    const serverStore = useServerStore();
    const snackbarStore = useSnackbarStore();
    const serverList = [...serverStore.serverList, ...serverStore.vipServerList];
    if (!game.server_id) {
        snackbarStore.add({ message: "Invalid game config", type: "danger" });
        return;
    }
    if (!serverList?.length){
        snackbarStore.add({ message: "Server is not loaded, please try again", type: "danger" });
        return;
    }
    let server = serverList.find((server => server.id == game.server_id));
    if(!server) {
        snackbarStore.add({ message: "Server is not found", type: "danger" });
        return;
    }
    try {
        loadingStore.open();
        await serverStore.connectServer(server);
    } finally {
        loadingStore.close();
    }
}