"use strict";


function timerEvent()
{
	var temps = parseInt($("#valTimer").text());
	if(temps>0)
		$("#valTimer").text(temps-1).trigger("timerChange");

}


$(document).ready(function(){

	class MotCherche{
		constructor(mot){
			this.mot_a_trouver = mot || "AVION";
		}

		initialisation(){
			// ajax pour trouver un mot
			this.mot = "AVION";
		}

		verificationMot(mot_propose){
			console.log(mot_propose+ this.mot_a_trouver);
			if(this.mot_a_trouver.length !== mot_propose.length)
				return false;
			else if(this.mot_a_trouver.charAt(0) !== mot_propose.charAt(0))
				return false;
			//ajouter vérification ortho taln
			else 
				return true; 
		}

		traitementMot(mot_propose){
			if(!verificationMot(this.mot_a_trouver, mot_propose))
				return mot_propose;
		}

		motTrouve(mot_propose){
			if(this.mot_a_trouver === mot_propose)
				return true;
			else
				return false;
	}
}
	//Class motus
	var Motus = class Motus{

		constructor(taille, nombre_essai){
			this.mot = new MotCherche("AVION", 1);
			this.tentative = 0;
			this.mot_deja_propose = [];
			this.essai = nombre_essai;
			this.taille = taille;
		}

		first_letter(letter) {
			var letter = letter.toUpperCase();
			var first_case_by_line = $('tr td:nth-child(1)');
			$(first_case_by_line).addClass('lettreCorrect');
			$(first_case_by_line).html(letter); 
		}

		creerTableau(){
			var str ="";
			$('table tbody').html(str);
			for(var j =0; j < this.essai; j++){
				str += "<tr>";
				for(var i = 0; i < this.taille; i++)
					str+='<td class="lettreNnormal"></td>';
				str+='</tr>';
			}
			$('table tbody').append(str);
			this.first_letter(this.mot.mot_a_trouver.charAt(0)); 
		}

 
		ajouterTentative(mot_propose){
			this.tentative++;
			this.mot_deja_propose.push(mot_propose);
		}

		ajouterMotTableau(mot_propose){
			var tmp = this.mot.mot_a_trouver;
			var audio;
			var delay=225;
			for(var i = 0; i < this.taille; i++){
				if(this.mot.mot_a_trouver.charAt(i) === mot_propose.charAt(i)){
					tmp = tmp.replace(mot_propose.charAt(i));
				}
			}
			for(var i = 0; i < this.taille; i++ ){

				var present_dans_le_mot = tmp.indexOf(mot_propose.charAt(i));
				var caseARemplir=$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')');
				var classLettre ='lettreNormal';

				$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')').html(mot_propose.charAt(i));
				if(this.mot.mot_a_trouver.charAt(i) === mot_propose.charAt(i))
				{
					audio = new Audio("sound/bienPlacee.wav");
					classLettre='lettreCorrect';
				}
				else if(present_dans_le_mot !== -1){
					console.log(" 2. " + this.mot.mot_a_trouver.charAt(i) + " 20. "+  mot_propose.charAt(i))
					audio = new Audio("sound/malPlacee.wav");
					classLettre='lettreMalPlacee';
					tmp = tmp.replace(mot_propose.charAt(i));
				}
				else
				{
					classLettre='';
					audio = new Audio("sound/mauvaiseLettre.wav");
				}

				delay=225*(i+1);
				(function(delayTime,myCase,myClass,audioToPlay){
	        		setTimeout( function(){audioToPlay.load();myCase.addClass(myClass);audioToPlay.play();}, delayTime);
	    		})(delay,caseARemplir,classLettre,audio);

			}
			if(this.victoire(mot_propose)){
				this.gestionVictoire();
			}
		}

		ajouterMauvaisMot()
		{
			for(var i = 1; i < this.taille; i++ ){
				$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')').addClass("wrongWord");
			}
		}

		proposerMot(mot_propose){
			mot_propose = mot_propose.toUpperCase();
			if(this.mot.motTrouve(mot_propose))
				console.log("victory"); // Add gestion
			if(this.mot_deja_propose.indexOf(mot_propose) !== -1){
			 // gestion erreur
			 console.log("lost");
			 this.ajouterMauvaisMot(); /* ????*/
			}
			else{
				if(this.mot.verificationMot(mot_propose)){
					this.ajouterMotTableau(mot_propose);
				}

				else
				{
					this.ajouterMauvaisMot();
				}
			}
			this.ajouterTentative(mot_propose)
		}
		victoire(mot_propose){
			return this.mot.motTrouve(mot_propose.toUpperCase());
		}

		gestionVictoire(){
			
			var audio = new Audio("sound/sonVictoire.wav");
			audio.volume = 0.4;

			setTimeout(function(){
				audio.play();
				}, this.taille*250);

			setTimeout(function()
			{
				$('#play').hide();
				$('#config').show(250);
			},this.taille*250+3150) //taille*250 pour laisser le son des lettres + 3s pour jouer le son victoire
		}
	}

	$("#mot").val("");

	var motus;
	var timer;
	
	$('#validerMot').click(function(){

		var win = 0;
		if(motus.victoire($("#mot").val()))
			win=1;

		clearInterval(timer);
		motus.proposerMot($("#mot").val());
			setTimeout(function()
			{
				$("#mot").val("");
				$("#valTimer").text(8);
				timer = setInterval(timerEvent, 1000);
			},motus.taille*250+150+win*3150);
	});

	//var keyPressed=false; //pour stopper l'appui consécutif

	$('#config').on('click', 'button', function(){
		var taille = parseInt($('#taille_mot').val());
		var nombre_essai = parseInt($('#nombre_essai').val());
		motus = new Motus(taille , nombre_essai);
		motus.creerTableau();
		$('#config').hide();
		$('#play').show(250);


		/*TIMER*/
		timer = setInterval(timerEvent, 1000);

	});

	$("body").keydown(function(event)
	{
		if(event.keyCode>=65 && event.keyCode<=90 && !$("#mot").is(":focus"))
		{
			//$("#mot").val($("#mot").val()+event.key.toUpperCase());
			$("#mot").focus();
		}
	});

	/*$("body").keydown(function(event)
	{
		if(event.keyCode>=65 && event.keyCode<=90 && !keyPressed)
		{
			//keyPressed=true;
			console.log(event.key.toUpperCase());

			$("#mot").append(event.key.toUpperCase()); //TEST, à ajouter dans le carré courrant
		}

		else if(event.keyCode == 8 ) //Supp
		{
			var mot=$("#mot").text();
			$("#mot").text(mot.substr(0,mot.length-1));
		}
	});*/

	$("#valTimer").bind("timerChange", function() {

		if(parseInt($(this).text())==0)
		{

			var win = 0;
			if(motus.victoire($("#mot").val()))
				win=1;

			clearInterval(timer);
			motus.proposerMot($("#mot").val());
			console.log(win,$("#mot").val(),motus.mot.mot_a_trouver);
			setTimeout(function()
			{
				$("#mot").val("");
				$("#valTimer").text(8);
				timer = setInterval(timerEvent, 1000);
			},motus.taille*250+150+win*3150);

		}
	});

	/*$("body").keyup(function(event)
	{

		keyPressed=false;
	});*/

});