<?php

	require("fonctions.php");

	if(!empty($_POST["Pseudo"]) && !empty($_POST["User"]))
	{
		newJoueur($db, $_POST["Pseudo"],$_POST['score'],$_POST['longueur_mot']);
	
	}
	
	else if(!empty($_GET["highScore"]))
	{
		highscore($db);
	}
		

?>