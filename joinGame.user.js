// ==UserScript==
// @name        Join Game in Steam Monster Game
// @namespace   https://github.com/bountygiver/steamSummerGameJoin
// @description Join Game
// @include     http://steamcommunity.com/minigame/
// @version     1
// @grant       none
// @updateURL https://github.com/bountygiver/steamSummerGameJoin/raw/master/joinGame.user.js
// @downloadURL https://github.com/bountygiver/steamSummerGameJoin/raw/master/joinGame.user.js
// ==/UserScript==

(function(w) {
    var defaultNum = 0;
    var startLoop = false;
    
    var play_container = document.querySelector( '.section_play' );
    var join_row = document.createElement("div");
    var join_button = document.createElement("span");
    var join_label = document.createElement("span");

    join_label.innerHTML = "Join Game";

    join_button.className = "main_btn";
    join_button.onclick = JG;
    
    var join_auto_button = document.createElement("span");
    var join_auto_label = document.createElement("span");

    join_auto_label.innerHTML = "Automatically Join Game";

    join_auto_button.className = "main_btn";
    join_auto_button.onclick = AG;
    join_auto_button.style.marginTop = '6px';
    
    join_button.appendChild(join_label);
    join_auto_button.appendChild(join_auto_label);
    join_row.appendChild(join_button);
    join_row.appendChild(join_auto_button);
    play_container.appendChild(join_row);
    
    var play_button = document.querySelector( '.new_game' );
    if (play_button) play_button.style.marginTop = '0px';
    else {
        play_button = document.querySelector( '.current_game' );
        if (play_button) play_button.style.marginTop = '0px';
    }
    
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
    
    function ShowBlockingWaitDialogWithDismiss( strTitle, strDescription )
    {
      var deferred = new jQuery.Deferred();
      var fnOK = function() { deferred.resolve(); };

      var container = $J('<div/>', {'class': 'waiting_dialog_container'} );
      var throbber = $J('<div/>', {'class': 'waiting_dialog_throbber'} );
        
	var elButtonLabel = $J( '<span/>' ).text( "Cancel" );
      var $OKButton = $J('<button/>', {type: 'submit', 'class': 'btn_green_white_innerfade btn_medium' } ).append( elButtonLabel );
      $OKButton.click( fnOK );
      container.append( throbber );
      container.append( strDescription );

      var Modal = _BuildDialog( strTitle, container, [ $OKButton ], fnOK, { bExplicitDismissalOnly: true } );
      deferred.always( function() { Modal.Dismiss(); } );
      Modal.Show();

      // attach the deferred's events to the modal
      deferred.promise( Modal );

      return Modal;
    }
    
    function JoinLoop(room) {
        if (startLoop) {
            try {
        $J.post('http://steamcommunity.com/minigame/ajaxjoingame/', { 'gameid' : room, 'sessionid' : w.g_sessionID })
			.done(
				function( json ) {
					if ( json.success == '1' ) {
						console.log('Success! Joining room now');
						top.location.href = 'http://steamcommunity.com/minigame/towerattack/';
					} else {
						console.log('Not successful to join game ' + room);
            setTimeout(JoinLoop(room), 1500);
					}
				}).fail(
				function( jqXHR ) {
					console.log('Failed to join game ' + room);
          setTimeout(JoinLoop(room), 1500);
				}
			);
		}
		catch(e)	// 3.3 catch other errors (timeout, etc) that aren't handled by JSON
			{
				console.log(e);
        setTimeout(JoinLoop(room), 1500);
			}
    }
    }
    
    function AJ(k) {
        startLoop = true;
        setTimeout(JoinLoop(k), 1500);
        ShowBlockingWaitDialogWithDismiss("Joining game", "Attempting to join " + k + "..."
                                          ).done(function() {
            startLoop = false;
        });
    }
    
    function AG() {
        ShowPromptDialog("Enter room number", "Enter room number you want to join automatically:"
           ).done( function(room) {
            if (room > 0) {
                defaultNum = room;
                AJ(room);
            }
            else {
                ShowAlertDialog("Error", "Invalid number!");
            }
        });
    }

})(window);
