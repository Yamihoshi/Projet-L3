"use strict";
var dico=[];
var timer=
{
	valeur:8,
	horloge:8
};

function timerEvent()
{	
	if(timer.horloge>0)
	{
		$("#valTimer").text(timer.horloge-1);
		timer.horloge=timer.horloge-1;
	}
	else
		$("#valTimer").trigger("timerChange");

}

function loadDictionnary()
{
     var txtFile = new XMLHttpRequest();
     txtFile.open("GET", "dico.txt", true); //Si ça bug, remettre à false
     txtFile.overrideMimeType('text/plain; charset=iso-8859-1');
     txtFile.onreadystatechange = function () 
     {
	    if (txtFile.readyState === 4) 
	    {  
	        // Makes sure the document is ready to parse.
	        if (txtFile.status === 200) 
	        {  
	             // Makes sure it's found the file.
	            var wordList = txtFile.responseText.split('\n');
	            for(var i=0;i<wordList.length;i++)
	            {
	            	dico[i]=wordList[i].trim();
	            }

	            //console.log(dico);
	        }
	    }
	}

	txtFile.send(null);
}

function getRandomWord(taille)
{
	var sousDico = dico.filter( function( element ) {
  		return breakUTF8Character(element).length == taille;
	});

	var index = Math.floor((Math.random() * sousDico.length-1) );

	return breakUTF8Character(sousDico[index]);
}

function breakUTF8Character(word)
{
	var str = word.toUpperCase();
	str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
    str = str.replace(/[ÈÉÊË]/g,"E");
    str = str.replace(/[ÎÏ]/g,"I");
    str = str.replace(/[ÔÖ]/g,"O");
    str = str.replace(/[ÙÛÜ]/g,"U");
    //.... all the rest
    return str.replace(/[^A-Z]/gi,'');
}

function resetTimer()
{
	/*
		A COPIER D'EN BAS
	*/
}

loadDictionnary();//A placer avant document ready

$(document).ready(function(){

	function load() {
		return new Typo("fr_FR");
	}

	var dictionary = load();

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
			/*else if(this.mot_a_trouver.charAt(0) !== mot_propose.charAt(0))
				return false;*/
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
			//this.mot = new MotCherche("AVION", 1);
			this.mot = new MotCherche(getRandomWord(taille));
			this.tentative = 0;
			this.mot_deja_propose = [];
			this.essai = nombre_essai;
			this.taille = taille;
			this.indiceLettreTrouve = [0];
		}

		letterFind() {
			var line = $("tr").eq(this.tentative);
			for(var indice of this.indiceLettreTrouve){
				var case_motus = line.find('td').eq(indice);
				$(case_motus).html(this.mot.mot_a_trouver.charAt(indice));
			}
		}

		creerTableau(){
			var str ="";
			$('table tbody').html(str);
			for(var j =0; j < this.essai; j++){
				str += "<tr>";
				for(var i = 0; i < this.taille; i++)
					str+='<td class="lettreNormal"></td>';
				str+='</tr>';
			}
			$('table tbody').append(str);
			this.letterFind(); 
		}
		ajouterIndiceLettreFind(indice){
			if(this.indiceLettreTrouve.includes(indice))
				return;
			else
				this.indiceLettreTrouve.push(indice);
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
					this.ajouterIndiceLettreFind(i);
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
			this.ajouterTentative(mot_propose);

			var taille = 100;
			(function(motus){

	        	setTimeout( function(){
	        		motus.letterFind();
	        	}, motus.taille*250);

	    	})(this);

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

	var timerEventHandler;
	
	$('#validerMot').click(function(){

		var win = 0;
		if(motus.victoire($("#mot").val()))
			win=1;

		clearInterval(timerEventHandler);
		motus.proposerMot($("#mot").val());
		$("#mot").val("");
			setTimeout(function()
			{
				timer.horloge=timer.temps;
				$("#valTimer").text(timer.temps);
				timerEventHandler = setInterval(timerEvent, 1000);
			},motus.taille*250+150+win*3150);
	});

	$('#config').on('click', 'button', function(){
		var taille = parseInt($('#taille_mot').val());
		var nombre_essai = parseInt($('#nombre_essai').val());
		motus = new Motus(taille , nombre_essai);
		motus.creerTableau();
		$('#config').hide();
		$('#play').show(250);

		timer.temps=$('#timerSettings').val();
		timer.horloge=timer.temps;
		$("#valTimer").text(timer.temps);

		/*TIMER*/
		timerEventHandler = setInterval(timerEvent, 1000);


		console.log("Mot à trouver :",motus.mot.mot_a_trouver);
		console.log("temps",timer.temps);

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

			var win = 0;
			if(motus.victoire($("#mot").val()))
				win=1;

			clearInterval(timerEventHandler);
			motus.proposerMot($("#mot").val());
			$("#mot").val("");
			setTimeout(function()
			{
				timer.horloge=timer.temps;
				$("#valTimer").text(timer.horloge);
				timerEventHandler = setInterval(timerEvent, 1000);
			},motus.taille*250+150+win*3150);
	});



	console.log(dictionary.check("VOITURE"));

});