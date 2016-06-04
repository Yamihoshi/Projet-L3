<?php

	require("fonctions.php");

	if(!empty($_POST["Pseudo"]) && !empty($_POST["User"]))
	{
		newJoueur($db, $_POST["Pseudo"],0);
	
	}
	
	else if(!empty($_GET["highScore"]))
	{
		highscore($db);
	}
		

?>