// ==UserScript==
// @name        Join Game in Steam Monster Game
// @namespace   http://www.github.com/bountygiver
// @description Join Game
// @include     http://steamcommunity.com/minigame/
// @version     1
// @grant       none
// ==/UserScript==

(function(w) {
    var defaultNum = 0;
    
    var play_container = document.querySelector( '.section_play' );
    var join_row = document.createElement("div");
    var join_button = document.createElement("span");
    var join_label = document.createElement("span");

    join_label.innerHTML = "Join Game";

    join_button.className = "main_btn";
    join_button.onclick = JG;
    join_button.appendChild(join_label);
    join_row.appendChild(join_button);
    play_container.appendChild(join_row);
    
    function JG() {
        ShowPromptDialog("Enter room number", "Enter room number you want to join:"
           ).done( function(room) {
            if (room > 0) {
                defaultNum = room;
                JoinGame(room);
            }
            else {
                ShowAlertDialog("Error", "Invalid number!");
            }
        });
    }

})(window);
