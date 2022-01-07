var canvas = document.getElementById("joc-asteroizi");
var ctx = canvas.getContext("2d");

// ---------------------ASTEROIZI--------------------- //

var nrInitAsteroizi = 4; //nr de asteroizi initial
var vitezaAsteroid = 50;//viteza maxima initiala in pixeli pe secunde
var dimAsteroid = 120;//dimensiunea initiala a asteroizilor
var varfuriAsteroizi = 12;//nr mediu de varfuri ale asteroizilor
var pctAsteroid1=5;
var pctAsteroid2=5;
var pctAsteroid3=5;
var pctAsteroid4=5;

function creeazaAsteroizi() {
    asteroizi = [];
    var x;
    var y;
    var r;
    for (var i = 0; i < nrInitAsteroizi + nivel; i++) {
        do {
            x = Math.floor(canvas.width * Math.random()); 
            y = Math.floor(canvas.height* Math.random());
            r = Math.floor(60*Math.random())+40;
            //console.log(r)
        }
        while (distantaDintrePuncte(nava.x, nava.y, x, y) < nava.r + 2* dimAsteroid );

        asteroizi.push(asteroidNou(x, y, r ));
    }

}

function asteroidNou(x, y, r) {
    var vitezaDupaNivel=1+0.1*nivel;
    var asteroid = {
        x: x,
        y: y,
        xv: Math.random() * vitezaAsteroid  * vitezaDupaNivel / FPS * (Math.random() < 0.5 ? 1 : -1), //viteza aseroid pe ox
        yv: Math.random() * vitezaAsteroid  * vitezaDupaNivel / FPS * (Math.random() < 0.5 ? 1 : -1), //viteza aseroid pe oy
        r: r,
        a: Math.random() * 2 * Math.PI, //in radiani
        varf: Math.floor(Math.random() * (varfuriAsteroizi + 1) + varfuriAsteroizi / 2) //+1 ca sa nu fie 0
    };
    return asteroid;
}

function distantaDintrePuncte(xn, yn, xa, ya) {
    return Math.sqrt(Math.pow(xa - xn, 2) + Math.pow(ya - yn, 2));
}


function distrugeAsteroid(i) {
    var x = asteroizi[i].x;
    var y = asteroizi[i].y;
    var r = asteroizi[i].r;

    //impartim asteroidul intr-un asteroid de dimensiune 60
    if (r > 70) {
        asteroizi.push(asteroidNou(x, y, 60));
        scor=scor+pctAsteroid4;
        //asteroizi.push(asteroidNou(x, y, Math.ceil(dimAsteroid / 4)));
    }
    else
        if (r<=70 && r >58) {
            asteroizi.push(asteroidNou(x, y, 45));
            scor=scor+pctAsteroid3;
            //asteroizi.push(asteroidNou(x, y, Math.ceil(dimAsteroid / 8)));
        }
        else
            if(r<=58 && r>40){
                asteroizi.push(asteroidNou(x, y, 30));
                scor=scor+pctAsteroid2;
            }
                else
                    scor=scor+pctAsteroid1;
                

    //distrug asteroidul
    asteroizi.splice(i, 1);

    //pentru nivel nou
    if(asteroizi.length==0)
    {
        nivel++;
        nivelNou();
    }
}
// ---------------------------------------------------------------------- ASTEROID


// ---------------------------------------------------------------------- NAVA

const dimNava = 25;
const accNava = 15; //pixeli pe secunde
const FPS = 30; //frames per second
const vitezaIntoarcere = 360;//in grade pe secunda
const fortaFrecare = 0.7; //coeficientul de frecare al spatiului 0=nu avem forta de frecare
const durataExplozieNava = 0.5;//cat dureaza explozia navei
const imunitateNava = 2;//cat timp nava nu poate fi omorata de asteroizi cand se reseteaza
const durataLicaritNava = 0.1;//cat licareste nava cat e imuna
const nrMaximRachete = 2;//nr maxim de rachete care pot fi lansate  simultan pe ecran
const vitezaRachete = 450;//in pixeli pe secunde
const distantaRachete = 0.4;//1=canvas.width;

function deseneazaNava(x,y,a,culoare="yellow"){
    //desenez nava in forma de triunghi
    ctx.strokeStyle = culoare;
    ctx.lineWidth = dimNava / 20;

    //incep sa desenez triunghiul
    ctx.beginPath();
    ctx.moveTo(x + 4 / 3 * nava.r * Math.cos(a), y - 4 / 3 * nava.r * Math.sin(a));
    //nava.x reprezinta centrul navei la care adaugam raza * cosinus care reprezinta orizontalul unghiului navei
    ctx.lineTo(x - nava.r * (2 / 3 * Math.cos(a) - Math.sin(a)), y + nava.r * (2 / 3 * Math.sin(a) + Math.cos(a))); //partea din spate din dreapta
    ctx.lineTo(x - nava.r * (2 / 3 * Math.cos(a) + Math.sin(a)), y + nava.r * (2 / 3 * Math.sin(a) - Math.cos(a))); //partea din spate din stanga
    ctx.closePath();
    ctx.stroke();
}

function navaNoua() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        //sa apara la mijloc
        r: dimNava / 2,
        a: 90 / 180 * Math.PI, //conversie in radius; angle - directia navei
        rotire: 0,
        finalJoc:false,
        timpExplozie: 0,
        timpLicarit: Math.ceil(durataLicaritNava * FPS),
        nrLicarit: Math.ceil(imunitateNava / durataLicaritNava),
        //pentru mers:
        inainteaza: false,
        inainteazaInapoi:false,
        inainteazaStanga:false,
        inainteazaDreapta:false,
        inaintare: {
            x: 0,
            y: 0
        },
        poateDeclansaRachete: true,
        rachete: [],
    }
}
const keyDown = (eveniment) => {
    if(nava.finalJoc){
        return;
    }
    switch (eveniment.keyCode) {
        //pentru rotit la stanga folosind z si Z
        case 122:
            nava.rotire = vitezaIntoarcere / 180 * Math.PI / FPS;
        case 90:
            nava.rotire = vitezaIntoarcere / 180 * Math.PI / FPS;
            break;
        //sagetica stanga
        case 37:
            nava.inainteazaStanga=true;
            break;
        //sus -> merge drept
        case 38:
            nava.inainteaza = true;
            break;

        //dreapta c/C
        case 99:
            nava.rotire = -vitezaIntoarcere / 180 * Math.PI / FPS;
            break;
        case 67:
            nava.rotire = -vitezaIntoarcere / 180 * Math.PI / FPS;
            break;
        //sageata dreapta
        case 39:
            nava.inainteazaDreapta=true;
            break;

        //sagetica jos
        case 40:
            nava.inainteazaInapoi=true;
            break;

        //pentru rachete: (x)
        case 88:
            aruncaRachete();
            break;
    }
}
const keyUp = (eveniment) => {
    if(nava.finalJoc){
        return;
    }
    switch (eveniment.keyCode) {
        //stop rotit la stanga
        case 122:
            nava.rotire = 0;
            break;
        case 90:
            nava.rotire = 0;
            break;
        case 37:
            nava.inainteazaStanga=false;
            break;

        //stop  mers drept
        case 38:
            nava.inainteaza = false;
            break;
        //dreapta
        case 99:
            nava.rotire = 0;
            break;
        case 67:
            nava.rotire = 0;
            break;
        case 39:
            nava.inainteazaDreapta=false;
            break;

        //pentru inapoi
        case 40:
            nava.inainteazaInapoi=false;
            break;

        //pentru rachete: (x)
        case 88:
            nava.poateDeclansaRachete = true;
            break;
    }
}

function aruncaRachete() {
    //
    if (nava.poateDeclansaRachete && nava.rachete.length <= nrMaximRachete) {
        nava.rachete.push({
            //de la varful navei
            x: nava.x + 4 / 3 * nava.r * Math.cos(nava.a),
            y: nava.y - 4 / 3 * nava.r * Math.sin(nava.a),
            xv: vitezaRachete * Math.cos(nava.a) / FPS,
            yv: -vitezaRachete * Math.sin(nava.a) / FPS,
            distRachete: 0
        })
    }
    nava.poateDeclansaRachete = false;
}
//event handlers ca sa rotesc nava
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// ---------------------------------------------------------------------- NAVA

// ---------------------------------------------------------------------- COLIZIUNI
const margini = false; //margini pentru coliziune folosind cerc
// ---------------------------------------------------------------------- COLIZIUNI


// ---------------------------------------------------------------------- LOOP SI EXPLOZIE
//set up the game loop
setInterval(update, 1000 / FPS);


function explodeazaNava() {
    nava.timpExplozie = Math.ceil(durataExplozieNava * FPS);
    nava.poateDeclansaRachete=false;
}
function sfarsitJoc(){
    nava.finalJoc=true;
    text="Sfarsit joc!";
    textTransparent=1.0;
    iaNumeJucator();
    verificaScor();
   
    console.log("Nume jucator anterior:"+jucator+" Scor: "+scor);
}
// ---------------------------------------------------------------------- LOOP SI EXPLOZIE


// ---------------------------------------------------------------------- SCOR
const cheieScor1="scormaxim1";//cheia de salvare pentru a salva cel mai mare scor
const cheieScor2="scormaxim2";
const cheieScor3="scormaxim3";
const cheieScor4="scormaxim4";
const cheieScor5="scormaxim5";
const cheieNumeJucator1="Nume Jucator1";
const cheieNumeJucator2="Nume Jucator2";
const cheieNumeJucator3="Nume Jucator3";
const cheieNumeJucator4="Nume Jucator4";
const cheieNumeJucator5="Nume Jucator5";

// ---------------------------------------------------------------------- SCOR

// ---------------------------------------------------------------------- vieti, scor
const timpFadeText=1.5; //in secunde
const dimensiuneText=100;//in pixeli
const vietiJoc=3;//numarul de vieti la inceput

var nivel;
var asteroizi;
var text;
var textTransparent;
var vieti;
var nava;
var scor;
var celMaiMareScor1;
var celMaiMareScor2;
var celMaiMareScor3;
var celMaiMareScor4;
var celMaiMareScor5;
var numeJucator1;
var numeJucator2;
var numeJucator3;
var numeJucator4;
var numeJucator5;
var viataPlus=0; //pentru a adauga o noua viata la fiecare 360 de puncte
var viataNoua=100;
var jucator;

jocNou();

function adaugaViata(){
    if(viataPlus==viataNoua){
       // console.log(viataNoua);
       // console.log(viataPlus);

        vieti++;
        viataNoua=viataNoua+100;
    }
    else{
        viataPlus=scor;
    }
}
function jocNou(){
    nivel=0;
    scor=0;
    
    vieti=vietiJoc;
    nava=navaNoua();
    //pentru primele 5 cele mai mari scoruri salvate local
    var scorText1=localStorage.getItem(cheieScor1);
    var scorText2=localStorage.getItem(cheieScor2);
    var scorText3=localStorage.getItem(cheieScor3);
    var scorText4=localStorage.getItem(cheieScor4);
    var scorText5=localStorage.getItem(cheieScor5);
    //pentru numele jucatorilor
    var numeJucatorText1=localStorage.getItem(cheieNumeJucator1);
    var numeJucatorText2=localStorage.getItem(cheieNumeJucator2);
    var numeJucatorText3=localStorage.getItem(cheieNumeJucator3);
    var numeJucatorText4=localStorage.getItem(cheieNumeJucator4);
    var numeJucatorText5=localStorage.getItem(cheieNumeJucator5);

    if(scorText1==null)
    {
        celMaiMareScor1=0;
    }
    else
    celMaiMareScor1=parseInt(scorText1);

    if(scorText2==null)
    {
        celMaiMareScor2=0;
    }
    else
    celMaiMareScor2=parseInt(scorText2);

    if(scorText3==null)
    {
        celMaiMareScor3=0;
    }
    else
    celMaiMareScor3=parseInt(scorText3);

    if(scorText4==null)
    {
        celMaiMareScor4=0;
    }
    else
    celMaiMareScor4=parseInt(scorText4);

    if(scorText5==null)
    {
        celMaiMareScor5=0;
    }
    else
    celMaiMareScor5=parseInt(scorText5);
    //------------------
    if(numeJucatorText1==null){
        numeJucator1="N/A";
    }
    else
        numeJucator1=numeJucatorText1;
       
    if(numeJucatorText2==null){
        numeJucator2="N/A";
        }
    else
        numeJucator2=numeJucatorText2;

    if(numeJucatorText3==null){
        numeJucator3="N/A";
        }
    else
        numeJucator3=numeJucatorText3;
    
    if(numeJucatorText4==null){
        numeJucator4="N/A";
        }
    else
        numeJucator4=numeJucatorText4;

    if(numeJucatorText5==null){
        numeJucator5="N/A";
        }
    else
        numeJucator5=numeJucatorText5;


    nivelNou();
}

function iaNumeJucator(){
    //pentru a introduce de la tastatura
    jucator = prompt("Introdu numele:", "");
    return jucator;
}

function nivelNou(){
    text="Nivel "+(nivel+1);
    textTransparent=1.0;//e opac
    creeazaAsteroizi();
}

function verificaScor(){
    //verifica daca este cel mai mare scor
    if(scor>celMaiMareScor1)
    {
    //am schimb clasamentul scorurilor, pun pe prima pozitie noul scor cel mai mare si apoi le salvez pe toate local
      celMaiMareScor5=celMaiMareScor4;
      celMaiMareScor4=celMaiMareScor3;
      celMaiMareScor3=celMaiMareScor2;
      celMaiMareScor2=celMaiMareScor1;
      numeJucator5=numeJucator4;
      numeJucator4=numeJucator3;
      numeJucator3=numeJucator2;
      numeJucator2=numeJucator1;
         
      celMaiMareScor1=scor;
      numeJucator1=jucator;

      localStorage.setItem(cheieScor1,celMaiMareScor1);
      localStorage.setItem(cheieScor2,celMaiMareScor2);
      localStorage.setItem(cheieScor3,celMaiMareScor3);
      localStorage.setItem(cheieScor4,celMaiMareScor4);
      localStorage.setItem(cheieScor5,celMaiMareScor5);

      localStorage.setItem(cheieNumeJucator1,numeJucator1);
      localStorage.setItem(cheieNumeJucator2,numeJucator2);
      localStorage.setItem(cheieNumeJucator3,numeJucator3);
      localStorage.setItem(cheieNumeJucator4,numeJucator4);
      localStorage.setItem(cheieNumeJucator5,numeJucator5);
    }
        else
        if(scor>celMaiMareScor2 && scor<celMaiMareScor1)
        {
          
            celMaiMareScor5=celMaiMareScor4;
            celMaiMareScor4=celMaiMareScor3;
            celMaiMareScor3=celMaiMareScor2;
            numeJucator5=numeJucator4;
            numeJucator4=numeJucator3;
            numeJucator3=numeJucator2;            
            
          celMaiMareScor2=scor;
          numeJucator2=jucator;

          localStorage.setItem(cheieScor2,celMaiMareScor2);
          localStorage.setItem(cheieScor3,celMaiMareScor3);
          localStorage.setItem(cheieScor4,celMaiMareScor4);
          localStorage.setItem(cheieScor5,celMaiMareScor5);
          localStorage.setItem(cheieNumeJucator2,numeJucator2);
          localStorage.setItem(cheieNumeJucator3,numeJucator3);
          localStorage.setItem(cheieNumeJucator4,numeJucator4);
          localStorage.setItem(cheieNumeJucator5,numeJucator5);
        }
            else
            if(scor>celMaiMareScor3 && scor<celMaiMareScor1 && scor<celMaiMareScor2)
            {
                celMaiMareScor5=celMaiMareScor4;
                celMaiMareScor4=celMaiMareScor3;
                numeJucator5=numeJucator4;
                numeJucator4=numeJucator3;
                
                celMaiMareScor3=scor;
                numeJucator3=jucator; 
                
                localStorage.setItem(cheieScor3,celMaiMareScor3);
                localStorage.setItem(cheieScor4,celMaiMareScor4);
                localStorage.setItem(cheieScor5,celMaiMareScor5);
                localStorage.setItem(cheieNumeJucator3,numeJucator3);
                localStorage.setItem(cheieNumeJucator4,numeJucator4);
                localStorage.setItem(cheieNumeJucator5,numeJucator5);
            }
                else
                if(scor>celMaiMareScor4 && scor<celMaiMareScor1 && scor<celMaiMareScor2 && scor<celMaiMareScor3)
                {
                    celMaiMareScor5=celMaiMareScor4;
                    celMaiMareScor4=scor;

                    numeJucator5=numeJucator4;
                    numeJucator4=jucator;

                    localStorage.setItem(cheieScor4,celMaiMareScor4);
                    localStorage.setItem(cheieScor5,celMaiMareScor5);
                    localStorage.setItem(cheieNumeJucator4,numeJucator4);
                    localStorage.setItem(cheieNumeJucator5,numeJucator5);
                }
                    else
                    if(scor>celMaiMareScor5&& scor<celMaiMareScor1 && scor<celMaiMareScor2 && scor<celMaiMareScor3 && scor<celMaiMareScor4)
                    {
                        celMaiMareScor5=scor;
                        numeJucator5=jucator;

                        localStorage.setItem(cheieScor5,celMaiMareScor5);
                        localStorage.setItem(cheieNumeJucator5,numeJucator5);
                    }
   }

// ---------------------------------------------------------------------- vieti, scor

function update() {
    // ---------------------------------------------------------------------- EXPLOZIE
    var explozieNava = nava.timpExplozie > 0;
    var licarit = nava.nrLicarit % 2 == 0;
    // ---------------------------------------------------------------------- EXPLOZIE

    //desenez fundalul(spatiul)
    ctx.fillStyle = "#071425";
    ctx.fillRect(0, 0, canvas.width, canvas.height); //700,700

     
    // ---------------------------------------------------------------------- NAVA
    if (!explozieNava) {
        if (licarit && !nava.finalJoc) {
            deseneazaNava(nava.x, nava.y, nava.a);
        }
        //ma ocup de licarit
        if (nava.nrLicarit > 0) {
            //scad trimpul de licarit
            nava.timpLicarit--;

            // scad nr de licariri
            if (nava.timpLicarit == 0) {
                nava.timpLicarit = Math.ceil(durataLicaritNava * FPS);
                nava.nrLicarit--;
            }
        }
    }
    else {
        //desenez explozia

        ctx.fillStyle = "#7F0000";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 1.9, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 1.4, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#f2af0f";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 1.1, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#f5f63d";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 0.8, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.fillStyle = "#fdfdfd";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r * 0.4, 0, 2 * Math.PI, false);
        ctx.fill();


    }

    // ---------------------------------------------------------------------- COLIZIUNI - margine
    if (margini) {
        ctx.strokeStyle = "pink";
        ctx.beginPath();
        ctx.arc(nava.x, nava.y, nava.r, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    // ---------------------------------------------------------------------- COLIZIUNI - margine
    // ---------------------------------------------------------------------- NAVA - RACHETE    
    //desenez rachetele
    for (var i = 0; i < nava.rachete.length; i++) {

        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(nava.rachete[i].x, nava.rachete[i].y, dimNava / 15, 0, 2 * Math.PI, false);
        //x,             y,                   raza,            ungi inceput, unghi final;  
        ctx.fill();

        ctx.fillStyle = "#f5f63d";
        ctx.beginPath();
        ctx.arc(nava.rachete[i].x, nava.rachete[i].y, dimNava / 30, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    //cand rachetele ating un asteroid:
    var xAsteroid;
    var yAsteroid;
    var rAsteroid;
    var xRacheta;
    var yRacheta;
    for (var i = asteroizi.length - 1; i >= 0; i--) {
        xAsteroid = asteroizi[i].x;
        yAsteroid = asteroizi[i].y;
        rAsteroid = asteroizi[i].r;

        for (var j = nava.rachete.length - 1; j >= 0; j--) {
            xRacheta = nava.rachete[j].x;
            yRacheta = nava.rachete[j].y;

            //verificam daca atinge asteroizii
            if (distantaDintrePuncte(xAsteroid, yAsteroid, xRacheta, yRacheta) < rAsteroid) {
                //stergem racheta
                nava.rachete.splice(j, i);

                //stergem astertoidul
                distrugeAsteroid(i);

                break;
            }
        }

    }
    // ---------------------------------------------------------------------- NAVA - RACHETE
    // ---------------------------------------------------------------------- NAVA 
    //mut nava
    if (nava.inainteaza && !nava.finalJoc) {
        nava.inaintare.x = nava.inaintare.x + 0.8 * accNava * Math.cos(nava.a) / FPS;
        nava.inaintare.y = nava.inaintare.y - 0.8 * accNava * Math.sin(nava.a) / FPS;

        if (!explozieNava && licarit) {
            //ii desenez "focul"
            ctx.fillStype = "yellow"
            ctx.strokeStyle = dimNava / 10;
            ctx.strokeStyle = "red";
            //incep sa desenez triunghiul
            ctx.beginPath();
            //spate stanga
            ctx.moveTo(
                nava.x - nava.r * (2 / 3 * Math.cos(nava.a) - 0.5 * Math.sin(nava.a)),
                nava.y + nava.r * (2 / 3 * Math.sin(nava.a) + 0.5 * Math.cos(nava.a)));
            //centru(in spatele navei)
            ctx.lineTo(
                nava.x - nava.r * 5 / 3 * Math.cos(nava.a),
                nava.y + nava.r * 5 / 3 * Math.sin(nava.a)); //partea din spate din dreapta
            ctx.lineTo(
                nava.x - nava.r * (2 / 3 * Math.cos(nava.a) + 0.5 * Math.sin(nava.a)),
                nava.y + nava.r * (2 / 3 * Math.sin(nava.a) - 0.5 * Math.cos(nava.a))); //partea din spate din stanga
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

    }
    else {
        nava.inaintare.x = nava.inaintare.x - fortaFrecare * nava.inaintare.x / FPS;
        nava.inaintare.y = nava.inaintare.y - fortaFrecare * nava.inaintare.y / FPS;
    }
    //pentru mers inapoi
    if(nava.inainteazaInapoi){
        nava.inaintare.x = nava.inaintare.x - 0.8 * accNava * Math.cos(nava.a) / FPS;
        nava.inaintare.y = nava.inaintare.y + 0.8 * accNava * Math.sin(nava.a) / FPS;
    }
    else {
        nava.inaintare.x = nava.inaintare.x - fortaFrecare * nava.inaintare.x / FPS;
        nava.inaintare.y = nava.inaintare.y - fortaFrecare * nava.inaintare.y / FPS;
    }

    //pentru mers dreapta
    if(nava.inainteazaDreapta){
        nava.inaintare.x = nava.inaintare.x + 0.8 * accNava * Math.sin(nava.a) / FPS;
        nava.inaintare.y = nava.inaintare.y + 0.8 * accNava * Math.cos(nava.a) / FPS;
    }
    else {
        nava.inaintare.x = nava.inaintare.x - fortaFrecare * nava.inaintare.x / FPS;
        nava.inaintare.y = nava.inaintare.y - fortaFrecare * nava.inaintare.y / FPS;
    }

    //pentru mers stanga
    if(nava.inainteazaStanga){
        nava.inaintare.x = nava.inaintare.x - 0.8 * accNava * Math.sin(nava.a) / FPS;
        nava.inaintare.y = nava.inaintare.y - 0.8 * accNava * Math.cos(nava.a) / FPS;
    }
    else {
        nava.inaintare.x = nava.inaintare.x - fortaFrecare * nava.inaintare.x / FPS;
        nava.inaintare.y = nava.inaintare.y - fortaFrecare * nava.inaintare.y / FPS;
    }


    
    // ---------------------------------------------------------------------- NAVA - RACHETE
    //mut rachetele
    for (var i = nava.rachete.length - 1; i >= 0; i--) {
        //verific distanta parcursa de rachete
        if (nava.rachete[i].distRachete > distantaRachete * canvas.width) {
            //le ffacem sa dispara(stergem)
            nava.rachete.splice(i, 1); //ne va schimba marimea vectorului asa ca for-ul trebuie parcurs invers
            continue; //pentru a nu se opri la randul anterior si a merge mai departe in for
        }

        //mut rachetele
        nava.rachete[i].x = nava.rachete[i].x + nava.rachete[i].xv;
        nava.rachete[i].y = nava.rachete[i].y + nava.rachete[i].yv;

        //calculez distanta parcursa de rachete
        nava.rachete[i].distRachete = nava.rachete[i].distRachete + Math.sqrt(Math.pow(nava.rachete[i].xv, 2) + Math.pow(nava.rachete[i].yv, 2));

    }
    // ---------------------------------------------------------------------- NAVA - RACHETE
     // ---------------------------------------------------------------------- VIETI
        //desenez vietile
        var culoareVieti;
        for(var i=0; i<vieti;i++){
            culoareVieti=explozieNava&&i==vieti-1?"red":"yellow"
            if(explozieNava && i==vieti-1)         
                culoareVieti="red";
            else
                culoareVieti="yellow";
              // console.log(i)
            deseneazaNava(dimNava+i*dimNava*1.2,canvas.height-dimNava,0.5*Math.PI, culoareVieti);
        }

    // ---------------------------------------------------------------------- VIETI
       
       
    // ---------------------------------------------------------------------- NAVA
    if (!explozieNava) {
        //mut nava 
        nava.x = nava.x + nava.inaintare.x;
        nava.y = nava.y + nava.inaintare.y;
        //rotesc nava
        nava.a += nava.rotire;
    }
    else {
        nava.timpExplozie--;
    if (nava.timpExplozie == 0) {
        vieti--;
        if(vieti==0){
            sfarsitJoc();
        
        }
        else
            nava = navaNoua();
     }
     
    }

    //pentru a nu iesi din ecran:
    if (nava.x < 0 - nava.r)
        nava.x = canvas.width + nava.r;
    else
        if (nava.x > canvas.width + nava.r)
            nava.x = 0 - nava.r;
    if (nava.y < 0 - nava.r)
        nava.y = canvas.height + nava.r;
    else
        if (nava.y > canvas.height + nava.r)
            nava.y = 0 - nava.r;

    // ---------------------------------------------------------------------- NAVA


    // ---------------------------------------------------------------------- ASTEROID

    //desenez asterorizii

    var x;
    var y;
    var r;
    var a;
    var varf;
    ctx.lineWidth = dimNava / 20;
    for (var i = 0; i < asteroizi.length; i++) {
        //ctx.strokeStyle = "#D3D3D3";
      
        //ia proprietatile asteroizilor
        x = asteroizi[i].x;
        y = asteroizi[i].y;
        r = asteroizi[i].r;
        a = asteroizi[i].a;
        varf = asteroizi[i].varf;

        //ctx.save()
        //desenez un drum
        ctx.beginPath();
        // ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));

        //forma de cerc/poligon

        //ctx.translate(x, y);
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        // ctx.stroke();
        //ctx.restore();
        if(asteroizi[i].r>70){
            ctx.fillStyle="#502688";
            ctx.fill();
            }
            else
                if(asteroizi[i].r>58)
                {
                    ctx.fillStyle="#2E36AA";
                    ctx.fill();
                }
                else
                    if(asteroizi[i].r>40)
                    {
                        ctx.fillStyle="#401E42";
                        ctx.fill();
                    }
                    else    
                        if(asteroizi[i].r>0)
                        {
                            ctx.fillStyle="#281759";
                            ctx.fill();
                        }
        ctx.textAlign='center';
        ctx.fillStyle='white';
        ctx.font='25px bahnschrift semiLight';
        ctx.beginPath();
        if(asteroizi[i].r>70){
            ctx.fillText("4",x,y);        
            }
            else
                if(asteroizi[i].r>58)
                {
                    ctx.fillText("3",x,y);
                }
                else
                    if(asteroizi[i].r>40)
                    {
                        ctx.fillText("2",x,y);
                    }
                    else    
                        if(asteroizi[i].r>0)
                        {
                            ctx.fillText("1",x,y);
                        }
                
        
        // ---------------------------------------------------------------------- TEXT
        if(textTransparent>=0){
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.fillStyle="rgba(255, 255, 255, "+textTransparent+")";
            ctx.font="small-caps"+dimensiuneText+"px bahnschrift semiLight";
            ctx.fillText(text,canvas.width/2,canvas.height/3);
            textTransparent=textTransparent-(1.0/timpFadeText/FPS);
        }
        else
            if(nava.finalJoc){
                jocNou();
            }


        // ---------------------------------------------------------------------- TEXT
        
        // ---------------------------------------------------------------------- SCOR
        //desenez scorul
        ctx.textAlign="right";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.font=dimensiuneText/2+"px bahnschrift semiLight";
        ctx.fillText(scor,canvas.width-dimNava/2,dimNava);
        
        //titlu scoruri
         ctx.textAlign="center";
         ctx.textBaseline="middle";
         ctx.fillStyle="white";
         ctx.font=(dimensiuneText*0.2)+"px bahnschrift semiLight";
         ctx.fillText("Top cele mai bune scoruri:",canvas.width-dimNava-85,canvas.height-dimNava*7.3);

        //desenez cel mai mare scor 1
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.font=(dimensiuneText*0.4)+"px bahnschrift semiLight";
        ctx.fillText(celMaiMareScor1,canvas.width-dimNava-150,canvas.height-dimNava*6.1);
        //desenez cel mai mare scor 2
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.font=(dimensiuneText*0.4)+"px bahnschrift semiLight";
        ctx.fillText(celMaiMareScor2,canvas.width-dimNava-150,canvas.height-dimNava*4.8);
        //desenez cel mai mare scor 3
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.font=(dimensiuneText*0.4)+"px bahnschrift semiLight";
        ctx.fillText(celMaiMareScor3,canvas.width-dimNava-150,canvas.height-dimNava*3.6);
        //desenez cel mai mare scor 4
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.font=(dimensiuneText*0.4)+"px bahnschrift semiLight";
        ctx.fillText(celMaiMareScor4,canvas.width-dimNava-150,canvas.height-dimNava*2.4);
        //desenez cel mai mare scor 5
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="white";
        ctx.font=(dimensiuneText*0.4)+"px bahnschrift semiLight";
        ctx.fillText(celMaiMareScor5,canvas.width-dimNava-150,canvas.height-dimNava*1.2);
          //desenez numele jucatorilor
  
          //desenez numele jucatorului cu cel mai mare scor 1
          ctx.textAlign="center";
          ctx.textBaseline="middle";
          ctx.fillStyle="white";
          ctx.font=(dimensiuneText*0.35)+"px bahnschrift semiLight";
          ctx.fillText(numeJucator1,canvas.width-dimNava-50,canvas.height-dimNava*6.1);
          //desenez numele jucatorului cu cel mai mare scor 2
          ctx.textAlign="center";
          ctx.textBaseline="middle";
          ctx.fillStyle="white";
          ctx.font=(dimensiuneText*0.35)+"px bahnschrift semiLight";
          ctx.fillText(numeJucator2,canvas.width-dimNava-50,canvas.height-dimNava*4.8);
         //desenez numele jucatorului cu cel mai mare scor 3
          ctx.textAlign="center";
          ctx.textBaseline="middle";
          ctx.fillStyle="white";
          ctx.font=(dimensiuneText*0.35)+"px bahnschrift semiLight";
          ctx.fillText(numeJucator3,canvas.width-dimNava-50,canvas.height-dimNava*3.6);
          //desenez numele jucatorului cu cel mai mare scor 4
          ctx.textAlign="center";
          ctx.textBaseline="middle";
          ctx.fillStyle="white";
          ctx.font=(dimensiuneText*0.35)+"px bahnschrift semiLight";
          ctx.fillText(numeJucator4,canvas.width-dimNava-50,canvas.height-dimNava*2.4);
          //desenez numele jucatorului cu cel mai mare scor 5
          ctx.textAlign="center";
          ctx.textBaseline="middle";
          ctx.fillStyle="white";
          ctx.font=(dimensiuneText*0.35)+"px bahnschrift semiLight";
          ctx.fillText(numeJucator5,canvas.width-dimNava-50,canvas.height-dimNava*1.2);

        // ---------------------------------------------------------------------- SCOR

        // ---------------------------------------------------------------------- COLIZIUNI
        //cerc pentru coliziuni
        if (margini) {
            ctx.strokeStyle = "pink";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
        // ---------------------------------------------------------------------- COLIZIUNI       
    }

    // ---------------------------------------------------------------------- ASTEROID
    //mut asteroidul
    for (var i = 0; i < asteroizi.length; i++) {
        asteroizi[i].x = asteroizi[i].x + asteroizi[i].xv;
        asteroizi[i].y = asteroizi[i].y + asteroizi[i].yv;

        //pentru a nu iesi din ecran
        if (asteroizi[i].x < 0 - asteroizi[i].r) {
            //stanga
            asteroizi[i].x = canvas.width + asteroizi[i].r;
        }
        else
            if (asteroizi[i].x > canvas.width + asteroizi[i].r) {
                asteroizi[i].x = 0 - asteroizi[i].r;
            }

        if (asteroizi[i].y < 0 - asteroizi[i].r) {
            asteroizi[i].y = canvas.height + asteroizi[i].r;
        }
        else
            if (asteroizi[i].y > canvas.height + asteroizi[i].r) {
                asteroizi[i].y = 0 - asteroizi[i].r;
            }
    }

    // ---------------------------------------------------------------------- ASTEROID


    // ---------------------------------------------------------------------- COLIZIUNI
    if (!explozieNava) {
        //verific daca exista coliziuni cu asteroizii
        if (nava.nrLicarit == 0 && !nava.finalJoc) {
            for (var i = 0; i < asteroizi.length; i++) {
                if (distantaDintrePuncte(nava.x, nava.y, asteroizi[i].x, asteroizi[i].y) < nava.r + asteroizi[i].r){
                    explodeazaNava();
                    }
               
            }
        }
    }
     //coliziune intre asteroizi
     for (var i=0;i<asteroizi.length;i++){
        for(var j=i+1; j<asteroizi.length;j++)
        {
            if(distantaDintrePuncte(asteroizi[i].x, asteroizi[i].y, asteroizi[j].x, asteroizi[j].y)<asteroizi[i].r+asteroizi[j].r){
                //le schimb directia pe ox si pe oy
                asteroizi[i].xv=-1*asteroizi[i].xv;
                asteroizi[i].yv=-1*asteroizi[i].yv;
                asteroizi[j].xv=-1*asteroizi[j].xv;
                asteroizi[j].yv=-1*asteroizi[j].yv;
                asteroizi[j].x=asteroizi[j].x-1;
                asteroizi[j].y=asteroizi[j].y-1;
                asteroizi[i].x=asteroizi[i].x+1;
                asteroizi[i].y=asteroizi[i].y+1;
            }
        }
    }
   
    // ---------------------------------------------------------------------- COLIZIUNI
    //adaugare viata dupa atingerea a 100 * x puncte
    adaugaViata();

}