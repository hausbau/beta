<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?>
<html>
	<head>
		<title>Hallo</title>
		<link rel="stylesheet" type="text/css" href="css/reset.css">
		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script type="text/javascript" src='js/jquery.js'></script>
		<script type="text/javascript" src='js/bootstrap.min.js'></script>
		<script type="text/javascript" src='js/script.js'></script>
	</head>

<body onload="startTimer();">
<div class='wrapper'>
<div class="header">
	<nav class="navbar navbar-inverse" role="navigation">
		<div class="container-fluid">
			<?php
			if(!$logged) {
				echo 
				"
				<form class='navbar-form navbar-left' method='POST'>
					<div class='form-group'>
						<input type='text' name='name' class='form-control' placeholder='Benutzername'>
						<input type='password' name='pass' class='form-control' placeholder='Passwort'>
					</div>
					<input type='submit' name='login' class='btn btn-default' value='Einloggen' />
				</form>
				";
			} else {
				echo "<a class='navbar-brand' href='#'>Willkommen $account[name]</a>";
			}
			?>
			<p class="navbar-text"><?php echo $error; ?></p>
			<ul class="nav navbar-nav navbar-right">
				<li><a href='./?p=home'>Startseite</a></li>
				<?php
				if (!$logged) { echo "<li><a href='./?p=register'>Anmelden</a></li>";}
				else {
					echo "<li><a href='./?p=worlds'>Welt einloggen</a></li>";
				}
				?>
				<li><a href='./?p=impress'>Impressum</a></li>
			</ul>
		</div>
	</nav>
</div>
<div class="content">