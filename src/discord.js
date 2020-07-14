import store from "@/store";
import DiscordRPC from "discord-rpc";

const clientId = "732213676337266738";
const clientSecret = "jQn0EJm7f1j_3Kd9WF6emUvvGXgL2bMS";
const rpc = new DiscordRPC.Client({ transport: "ipc" });

rpc.on("ready", () => {
    console.log("Connected to DiscordRPC");
  rpc.setActivity(store.state.discordRPC);

  setInterval(() => {
    const currentPlaying = store.state.currentPlaying;

    const timeMs = new Date().getTime();

    if (currentPlaying.index > -1) {                
        store.state.discordRPC.details = currentPlaying.title;
        store.state.discordRPC.state = "by " + currentPlaying.artist;
        store.state.discordRPC.startTimestamp = timeMs;
        store.state.discordRPC.endTimestamp = timeMs + (currentPlaying.lengthSeconds - currentPlaying.currentTimeSeconds) * 1000;
    } else {
        store.state.discordRPC.details = "The better way to enjoy your music";
        store.state.discordRPC.state = "Browsing Songs...";
        store.state.discordRPC.startTimestamp = timeMs;
        store.state.discordRPC.endTimestamp = timeMs;
    }

    rpc.setActivity(store.state.discordRPC);
  }, 15000);
});

export default function setupDiscordRPC() {
    rpc.login({ clientId, clientSecret }).catch(console.log);
}