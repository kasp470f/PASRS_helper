import { Game } from "../showdown/game";

function updateSessionGames(roomId: string, roomURL: string) {
    var sessionStorage = window.sessionStorage;
    if (sessionStorage) {
        // Retrieve existing games from session storage
        var storageGames = sessionStorage.getItem("pasrs_games");
        if (storageGames) {
            try {
                var games: Game[] = JSON.parse(storageGames);
                games.push({ Id: roomId, URL: roomURL });

                // Save the updated list back to session storage
                sessionStorage.setItem("pasrs_games", JSON.stringify(games));
            } catch (e) {
                console.error("Failed to parse session storage games:", e);
            }
        }
        else {
            // If no games exist, create a new array with the current game
            var games: Game[] = [{ Id: roomId, URL: roomURL }];
            sessionStorage.setItem("pasrs_games", JSON.stringify(games));
        }
    }
}

export { updateSessionGames };