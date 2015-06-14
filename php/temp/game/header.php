<?php
$report = "<li><a href='$link?w=$wid&v=$vid&p=report'>Berichte</a></li>";
$mail = "<li><a href='$link?w=$wid&v=$vid&p=mails&a=mail'>Nachrichten</a></li>";
if ($user["newreport"] > 0) { $report = "<li><a href='$link?w=$wid&v=$vid&p=report'>Berichte <img src='css/img/new_report.gif'></a></li>"; }
if ($user["newmsg"] == 1) { $mail = "<li><a href='$link?w=$wid&v=$vid&p=mails&a=mail'>Nachrichten <img src='css/img/new_mail.gif'></a></li>"; }
?>
<html>
	<head>
		<title>TEST das Browsergame</title>
		<link rel="stylesheet" type="text/css" href="css/reset.css">
		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="css/game.css">
		<script type="text/javascript" src='js/jquery.js'></script>
		<script type="text/javascript" src='js/bootstrap.min.js'></script>
		<script type="text/javascript" src='js/script.js'></script>
		<script type="text/javascript">var gamedata = <?php echo $gamedata; ?>;</script>
		<script type='text/javascript'> $(document).ready(function() { borders.init(); });</script>
		<script type='text/javascript'> $(document).ready(function() { uorders.init(); });</script>
	</head>

<body>
	<div class='wrapper'>
	<div class="header">
		<nav class="navbar navbar-inverse" role="navigation">
			<div class="container-fluid">
				<p class="navbar-text"><?php echo $error; ?></p>
				<ul class="nav navbar-nav navbar-left">
					<li><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=overview'>Übersicht</a></li>
					<li><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=map'>Karte</a></li>
					<?php echo $report; ?>
					<?php echo $mail; ?>
					<li><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=profil'>Profil</a></li>
			        <li><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=ranking'>Rangliste(<?php echo $user["rang"];?>.|<?php echo $user["points"];?>p)</a></li>
			        <li><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=ally'>Stamm</a></li>

			        <li><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=settings'>Einstellungen</a></li>
				</ul>

				<ul class="nav navbar-nav navbar-right">
					<li><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=logout'>Ausloggen</a></li>
				</ul>
			</div>
		</nav>
	</div>

	<div class='left vinfol'><a href='<?php echo $link."?w=$wid&v=$vid";?>&p=overview'><?php echo $village["vname"]; ?></a> ( <?php echo $village["x"]; ?> | <?php echo $village["y"]; ?> )</div>
	<div class='right vinfor'>
		<span>H:</span><span id='rwood' class='res' title='<?php echo ($resshour["wood"]/3600); ?>' l='<?php echo($village["lastupdate"]); ?>'><?php echo $village["rwood"]; ?></span>
		<span>S:</span><span id='rstone' class='res 'title='<?php echo ($resshour["stone"]/3600); ?>' l='<?php echo($village["lastupdate"]); ?>'><?php echo $village["rstone"]; ?></span>
		<span>E:</span><span id='riron' class='res' title='<?php echo ($resshour["iron"]/3600); ?>' l='<?php echo($village["lastupdate"]); ?>'><?php echo $village["riron"]; ?></span>
		<span>MAX:</span><span id='storage' class='resmax'><?php echo game::getStorage($village["storage"]); ?></span>
	</div>
	<div class=" clear"></div>
	<div class="content">