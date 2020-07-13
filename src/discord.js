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

    if (currentPlaying.index > -1) {
        const song = currentPlaying.artist + " - " + currentPlaying.title;
                
        store.state.discordRPC.details = "Listening to";
        store.state.discordRPC.state = song;
    } else {
        store.state.discordRPC.details = "The better way to enjoy your music";
        store.state.discordRPC.state = "Browsing Songs...";
    }

    rpc.setActivity(store.state.discordRPC);
  }, 15000);
});

export default function setupDiscordRPC() {
    rpc.login({ clientId, clientSecret }).catch(console.log);
}