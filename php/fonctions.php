<?php

	require("connexionBDD.php");

	function newJoueur($bdd, $pseudonyme){
		
		$req=$bdd->prepare('INSERT INTO score (pseudonyme,score) VALUES (:pseudonyme,0);');
		$req->bindValue(':pseudonyme',$pseudonyme);

		
		$req->execute();
		
	}

	//ptt a suppr suivant ce qu'on fait
	function upScore($bdd, $pseudonyme){
		$req=$bdd->prepare('UPDATE score SET score=score+1 where pseudonyme=:pseudonyme;');
		$req->bindValue(':pseudonyme',$pseudonyme);
		
		$req->execute();
	}

	function highscore($bdd){
		$req=$bdd->prepare('SELECT  pseudonyme, score from score order by score desc LIMIT 20 ;');
		$req->execute();

		$reponse="PSEUDONYME|SCORE";
		while($rep=$req->fetch(PDO::FETCH_ASSOC)){
			$reponse=$reponse+"<p>".$rep[pseudonyme]."|".$rep[score]."</p>";
		}
		
		echo json_encode($reponse);
	}


?>