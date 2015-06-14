<?php global $config; ?>
</div>
	<div class="footer">
		<div class="version">Version: <?php echo $config["version"]; ?></div>
		<div class='copyright'>Copyright &copy;<?php echo $config["copyright"]; ?></div>
		<div id='serverTime' t='<?php echo time(); ?>'><?php echo date("H:i:s", time()); ?></div>
		<div class='clear'></div>
	</div>
</div>
<script type="text/javascript"> 
	$(document).ready(function() {
		Timer.init(<?php echo time(); ?>);
	});
</script>
</body>
</html>