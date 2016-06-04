<?php

	require("fonctions.php");
	require("connexionBDD.php");

	$pseudo=$_POST["Pseudo"];
	$newUser=$_POST["User"];
	$up=$_GET["Up"];
	$affiche=$_GET["highScore"];

	if(isset($pseudo) and trim($pseudo)!='' and isset($newUser)){
		newJoueur($bdd, $pseudo, $val);
	
	}else if (isset($up)){
		upScore($bdd, $pseudo);
	
	}else if(isset($affiche)){
		highscore($bdd);
	}
		

?>