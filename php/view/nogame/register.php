<?php
$error2 = null;
global $post;
if (isset($post["register"])) {
	if (empty($_POST["name"]) || empty($_POST["pass"]) || empty($_POST["pass2"]) || empty($_POST["email"])) {

	} else {
		$name = db::ci($_POST["name"]);
		$pass = db::ci($_POST["pass"]);
		$pass2 = db::ci($_POST["pass2"]);
		$email = db::ci($_POST["email"]);
		if (user::validateuser($name)) {
			if (!user::exists($name)) {
				if (user::validatemail($email)) {
					if ($pass == $pass2) {
						$pass = md5($pass);
						$time = time();
						$sql = "INSERT INTO `".dbprefix."accounts` (`name`,`pass`,`email`,`registertime`) VALUES ('$name','$pass','$email','$time');";
						if (db::query($sql)) {
							$error2 = func::text("Erfolgreich registriert!");
						} else {
							$error2 = func::text("Bei der Registration ist ein Fehler aufgetretten!", "error");
						}
					} else {
						$error2 = func::text("Passwörter stimmen nicht überein!", "error");
					}
				} else {
					$error2 = func::text("E-Mail ist ungültig!", "error");
				}
			} else {
				$error2 = func::text("Benutzer exestiert schon!", "error");
			}
		} else {
			$error2 = func::text("Benutzername ist ungültig!", "error");	
		}
	}
}
?>
<form method="POST">
	<table class="table table-bordered">
		<tr><th colspan='2'><h3>Registration</h3></th></tr>
		<tr><td><label>Benutzername: </label></td><td><input name='name' type='text' value=''></td></tr>
		<tr><td><label>Passwort: </label></td><td><input name='pass' type='password' value=''></td></tr>
		<tr><td><label>Passwort widh.: </label></td><td><input name='pass2' type='password' value=''></td></tr>
		<tr><td><label>E-Mail: </label></td><td><input name='email' type='text' value=''></td></tr>
		<tr><td colspan='2' align="center"><input name='register' class='btn btn-success' type='submit' value='Registrieren'></td></tr>
	</table>
</form>
<?php
echo $error2;
?>