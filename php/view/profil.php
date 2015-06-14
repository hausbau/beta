<?php


if($_POST==true){
 $day = $_POST['day'];
        $month = $_POST['month'];
        $year = $_POST['year'];
        $sex = $_POST['sex'];
        $home = $_POST['home'];
        $personal_text = $_POST['personal_text'];

        $date = $day.".".$month.".".$year;

$result =db::query( "UPDATE accounts SET ptext = '".$personal_text."' , sex = '".$sex."' , birthday = '".$date."' , wohnort = '".$home."' WHERE aid = '".$aid."'");}


?>
<form action='#' method="POST" enctype="multipart/form-data">
    <center>
		<tr><th colspan="2">Eigenschaften</th></tr>
		<tr>
			<td>Geburtsdatum:</td>
            <td>
                <input name="day" type="text" size="2" maxlength="2"  />
                    <select name="month">
                        <option value="1" >Januar</option>
                        <option value="2">Februar</option>
                        <option value="3">M&auml;rz</option>
                        <option value="4">April</option>
                        <option value="5">Mai</option>
                        <option value="6">Juni</option>
                        <option value="7">Juli</option>
                        <option value="8">August</option>
                        <option value="9">Sebtember</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Dezember</option>
                    </select>
                <input name="year" type="text" size="4" maxlength="4"  />
			</td>
		</tr>
		<tr>
            <td>Geschlecht:</td>
			<td> <center>
				<label><input type="radio" name="sex" value="w"/> weiblich</label>
                <label><input type="radio" name="sex" value="m"/> m&auml;nnlich</label>
                <label><input type="radio" name="sex" value="x"/> nicht angegeben</label>
			</center></td>
		</tr>
		<tr>
			<td>Wohnort:</td>
			<td><input name="home" type="text" size="40" maxlength="32"  /></td></tr>






		<tr><th colspan="2">Pers&ouml;nlicher Text</th></tr>
		<tr><td colspan="2"><textarea id="message" name="personal_text" cols="67" rows="10"></textarea></td></tr>
		<tr><th colspan="2"><div align="right"><input type="submit" name="send" class="button" value="Ok" /></div></th></tr>
	 </table>
  </center>
</form>
<pre>
	<?php echo print_r ($_POST);?>
</pre>