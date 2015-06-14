<?php
$account2 = db::query("SELECT * FROM `accounts` WHERE (`aid`='$aid');");
$account2 = db::fetch_assoc($account2);

if(isset($_POST['senden'])) {
	$an      = db::ci($_POST['an']);
	$from    = db::ci($account2["name"]);
	$betreff = db::ci($_POST['betreff']);
	$text    = db::ci($_POST['UserKommentar']);
	$time    = time();

	if (user::exists($an)) {
		db::query("INSERT INTO mail VALUES ('','$wid','$an','$from','$betreff','$text','$time')");
		db::query("UPDATE worldusers set newmsg='1' WHERE (`aid`='$aid');");
		echo"Nachricht An:  $an gesendet";
	} 
	else {
		echo "<div class='alert alert-danger'>User nicht gefunden</div>";
	}
}
?>
<div class="mail">
	<form method="post">
		An: <input type="text" float="center" size="50" name="an"></br>
		Betreff: <input type="text" size="50" name="betreff"></br>
		<div id="bb_bar" style="text-align:left; overflow:visible; " data-target="message">
			<a id="bb_button_bold" title="Fett" href="#" onclick="BBCodes.insert('[b]', '[/b]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat 0px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_italic" title="Kursiv" href="#" onclick="BBCodes.insert('[i]', '[/i]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -20px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_underline" title="Unterstrichen" href="#" onclick="BBCodes.insert('[u]', '[/u]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -40px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_strikethrough" title="Durchgestrichen" href="#" onclick="BBCodes.insert('[s]', '[/s]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -60px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_quote" title="Zitieren" href="#" onclick="BBCodes.insert('[quote=Author]\n', '\n[/quote]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -140px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_spoiler" title="Spoiler" href="#" onclick="BBCodes.insert('[spoiler=Spoiler]', '[/spoiler]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -260px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_url" title="Adresse" href="#" onclick="BBCodes.insert('[url]', '[/url]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -160px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_player" title="Spieler" href="#" onclick="BBCodes.insert('[player]', '[/player]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -80px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_tribe" title="Stamm" href="#" onclick="BBCodes.insert('[ally]', '[/ally]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -100px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_coord" title="Koordinate" href="#" onclick="BBCodes.insert('[coord]', '[/coord]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -120px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_report_display" title="Bericht" href="#" onclick="BBCodes.insert('[report_display]', '[/report_display]');return false;">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -240px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_color" title="Farbe" href="#" onclick="BBCodes.colorPickerToggle(); BBCodes.placePopups(); return false">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -200px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_units" title="Einheiten" href="#" onclick="BBCodes.unitPickerToggle(event); return false">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -300px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
			<a id="bb_button_building" title="Gebäude" href="#" onclick="BBCodes.buildingPickerToggle(event); return false">
				<span style="display:inline-block; zoom:1; *display:inline; background:url(http://dsde.innogamescdn.com/8.33.3/25675/graphic//bbcodes/bbcodes.png?1) no-repeat -320px 0px; padding-left: 0px; padding-bottom:0px; margin-right: 2px; margin-bottom:3px; width: 20px; height: 20px">&nbsp;</span>
			</a>
		</div>
		<textarea name="UserKommentar" rows="11" cols="60"></textarea><br></br>
		<input type="submit" name="senden" value="senden"></br>
	</form>
</div>