var canvas = document.getElementById("joc-asteroizi");
var ctx = canvas.getContext("2d");

// ---------------------ASTEROIZI--------------------- //

var nrInitAsteroizi = 4; //nr de asteroizi initial
var dimAsteroid = 120;//dimensiunea initiala a asteroizilor
var vitezaAsteroid = 50;//viteza maxima initiala in pixeli pe secunde
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
        while (distantaPuncte(nava.x, nava.y, x, y) < nava.r + 2* dimAsteroid );

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

function distantaPuncte(xn, yn, xa, ya) {
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
// --------------------- END ASTEROIZI--------------------- //


// ---------------------NAVA--------------------- //

const dimNava = 30;
const accNava = 15; //pixeli pe secunde
const FPS = 30; //frames per second
const fortaDeFrecare = 0.7; //coeficientul de frecare al spatiului 0=nu avem forta de frecare
const vitezaRotire = 360;//in grade pe secunda
const imunitateNava = 3;//cat timp nava nu poate fi omorata de asteroizi cand se reseteaza
const durataExplozieNava = 0.5;//cat dureaza explozia navei
const licaritNava = 0.1;//cat licareste nava cat e imuna
const nrMaxRachete = 3//nr maxim de rachete care pot fi lansate  simultan pe ecran
const distantaRachete = 0.4;//1=canvas.width;
const vitezaRachete = 450;//in pixeli pe secunde

function deseneazaNava(x,y,a,culoare="yellow"){
    //desenez nava in forma de triunghi
    //culoare nava
    ctx.strokeStyle = culoare;
    //dimensiune
    ctx.lineWidth = dimNava / 20;

    //desenez triunghiul
    ctx.beginPath();
    ctx.moveTo(x + 4 / 3 * nava.r * Math.cos(a), y - 4 / 3 * nava.r * Math.sin(a));
    //nava.x reprezinta centrul navei la care adaugam raza * cosinus care reprezinta orizontalul unghiului navei
    ctx.lineTo(x - nava.r * (2 / 3 * Math.cos(a) - Math.sin(a)), y + nava.r * (2 / 3 * Math.sin(a) + Math.cos(a))); //partea din spate din dreapta
    ctx.lineTo(x - nava.r * (2 / 3 * Math.cos(a) + Math.sin(a)), y + nava.r * (2 / 3 * Math.sin(a) - Math.cos(a))); //partea din spate din stanga
    ctx.closePath();
    ctx.stroke();
}

const keyDown = (eveniment) => {
    if(nava.finalJoc){
        return;
    }
    switch (eveniment.keyCode) {
        //sageata sus 
        case 38:
            nava.inainteaza = true;
            break;
        //sageata jos
        case 40:
            nava.inapoi=true;
            break;
        //sageata dreapta
        case 39:
            nava.inainteDreapta=true;
            break;
        //sageata stanga
        case 37:
            nava.inainteStanga=true;
            break;

        //se roteste spre stanga - z 
        case 90:
            nava.rotire = vitezaRotire / 180 * Math.PI / FPS;
            break;
        //se roteste spre dreapta - c 
        case 67:
            nava.rotire = -vitezaRotire / 180 * Math.PI / FPS;
            break;
        //arunca rachete - x
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
        //stop rotire spre stanga - z
        case 90:
            nava.rotire = 0;
            break;
        case 37:
            nava.inainteStanga=false;
            break;

        //stop  inaintare - sageata sus
        case 38:
            nava.inainteaza = false;
            break;
        //stop sageata dreapta
        case 99:
            nava.rotire = 0;
            break;
        case 67:
            nava.rotire = 0;
            break;
        case 39:
            nava.inainteDreapta=false;
            break;

        //stop inapoi - sageata jos
        case 40:
            nava.inapoi=false;
            break;

        //pentru rachete: (x)
        case 88:
            nava.poateLansaRachete = true;
            break;
    }
}

function navaNoua() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        //APARE IN CENTRU
        r: dimNava / 2,
        a: 1 / 2 * Math.PI, //conversie in radius
        rotire: 0,
        timpLicarit: Math.ceil(licaritNava * FPS),
        nrLicarit: Math.ceil(imunitateNava / licaritNava),
        finalJoc:false,
        timpExplozie: 0,
        inaintare: {
            x: 0,
            y: 0
        },
        inainteaza: false,
        inapoi:false,
        inainteDreapta:false,
        inainteStanga:false,
        poateLansaRachete: true,
        rachete: [],
    }
}
//event handlers ca sa rotesc nava
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function aruncaRachete() {
    //
    if (nava.rachete.length <= nrMaxRachete && nava.poateLansaRachete) {
        nava.rachete.push({
            //de la varful navei
            distRachete: 0,
            x: nava.x + 4 / 3 * nava.r * Math.cos(nava.a),
            y: nava.y - 4 / 3 * nava.r * Math.sin(nava.a),
            yv: -vitezaRachete * Math.sin(nava.a) / FPS,
            xv: vitezaRachete * Math.cos(nava.a) / FPS
        })
    }
    nava.poateLansaRachete = false;
}
// ---------------------END NAVA--------------------- //




// ---------------------EXPLOZIE + LOOP--------------------- //IE
//set up the game loop
setInterval(update, 1500 / FPS);


function navaExplodeaza() {
    nava.poateLansaRachete=false;
    nava.timpExplozie = Math.ceil(durataExplozieNava * FPS);

}
function terminareJoc(){
    nava.finalJoc=true;
    text="Joc incheiat!";
    textTransparent=1.0;
    verificareScor();
    salvareNumeJucator();
   
    console.log("Nume jucator:"+jucator+" Scor: "+scor);
}
// ---------------------END EXPLOZIE + LOOP--------------------- //

// ---------------------SCOR--------------------- //

//cheia de salvare pentru a salva cel mai mare scor
const cheieScorJucator1="scormax1";
const cheieScorJucator2="scormax2";
const cheieScorJucator3="scormax3";
const cheieScorJucator4="scormax4";
const cheieScorJucator5="scormax5";
const cheieNumeJucator1="nume jucator1";
const cheieNumeJucator2="nume jucator2";
const cheieNumeJucator3="nume jucator3";
const cheieNumeJucator4="nume jucator4";
const cheieNumeJucator5="nume jucator5";

// ---------------------END SCOR--------------------- //

// ---------------------VIETI SI SCOR--------------------- //
const timpTextFade=1.5; //secunde
const vietiJoc=3;//numarul de vieti la inceperea jocului

var nivel;
var asteroizi;
var text;
var textTransparent;
var vieti;
var nava;
var scor;
var jucator;
var numeJucator1;
var numeJucator2;
var numeJucator3;
var numeJucator4;
var numeJucator5;
var celMaiMareScor1;
var celMaiMareScor2;
var celMaiMareScor3;
var celMaiMareScor4;
var celMaiMareScor5;
var viataPlus=0; //pentru a adauga o noua viata la fiecare 360 de puncte
var viataNoua=100;

jocNou();

function adaugareViata(){
    if(viataPlus==viataNoua){
        viataNoua=viataNoua+100;
        vieti++;
    }
    else{
        viataPlus=scor;
    }
}

function jocNou(){    
    scor=0;
    nivel=0;

    vieti=vietiJoc;
    nava=navaNoua();
    //pentru numele jucatorilor
    var numeJucatorText1=localStorage.getItem(cheieNumeJucator1);
    var numeJucatorText2=localStorage.getItem(cheieNumeJucator2);
    var numeJucatorText3=localStorage.getItem(cheieNumeJucator3);
    var numeJucatorText4=localStorage.getItem(cheieNumeJucator4);
    var numeJucatorText5=localStorage.getItem(cheieNumeJucator5);
    //pentru primele 5 cele mai mari scoruri salvate local
    var scorText1=localStorage.getItem(cheieScorJucator1);
    var scorText2=localStorage.getItem(cheieScorJucator2);
    var scorText3=localStorage.getItem(cheieScorJucator3);
    var scorText4=localStorage.getItem(cheieScorJucator4);
    var scorText5=localStorage.getItem(cheieScorJucator5);

    const faraNume="Fara Nume";

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
        numeJucator1=faraNume;
    }
    else
        numeJucator1=numeJucatorText1;
       
    if(numeJucatorText2==null){
        numeJucator2=faraNume;
        }
    else
        numeJucator2=numeJucatorText2;

    if(numeJucatorText3==null){
        numeJucator3=faraNume;
        }
    else
        numeJucator3=numeJucatorText3;
    
    if(numeJucatorText4==null){
        numeJucator4=faraNume;
        }
    else
        numeJucator4=numeJucatorText4;

    if(numeJucatorText5==null){
        numeJucator5=faraNume;
        }
    else
        numeJucator5=numeJucatorText5;
    nivelNou();
}

function salvareNumeJucator(){
    //introduce de la tastatura
    jucator = prompt("Nume:", "");
    return jucator;
}

function nivelNou(){
    text="Nivelul "+(nivel+1);
    textTransparent=0.5;
    creeazaAsteroizi();
}

function verificareScor(){
    //verifica daca este cel mai mare scor
    if(scor>celMaiMareScor1)
    {
    //primul scor afisat este cel mai mare
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

      localStorage.setItem(cheieNumeJucator1,numeJucator1);
      localStorage.setItem(cheieNumeJucator2,numeJucator2);
      localStorage.setItem(cheieNumeJucator3,numeJucator3);
      localStorage.setItem(cheieNumeJucator4,numeJucator4);
      localStorage.setItem(cheieNumeJucator5,numeJucator5);

      localStorage.setItem(cheieScorJucator1,celMaiMareScor1);
      localStorage.setItem(cheieScorJucator2,celMaiMareScor2);
      localStorage.setItem(cheieScorJucator3,celMaiMareScor3);
      localStorage.setItem(cheieScorJucator4,celMaiMareScor4);
      localStorage.setItem(cheieScorJucator5,celMaiMareScor5);
    }
        else
        if(scor<celMaiMareScor1 && scor>celMaiMareScor2)
        {
          
            celMaiMareScor5=celMaiMareScor4;
            celMaiMareScor4=celMaiMareScor3;
            celMaiMareScor3=celMaiMareScor2;
            numeJucator5=numeJucator4;
            numeJucator4=numeJucator3;
            numeJucator3=numeJucator2;            
            
          celMaiMareScor2=scor;
          numeJucator2=jucator;

          localStorage.setItem(cheieScorJucator2,celMaiMareScor2);
          localStorage.setItem(cheieScorJucator3,celMaiMareScor3);
          localStorage.setItem(cheieScorJucator4,celMaiMareScor4);
          localStorage.setItem(cheieScorJucator5,celMaiMareScor5);
          localStorage.setItem(cheieNumeJucator2,numeJucator2);
          localStorage.setItem(cheieNumeJucator3,numeJucator3);
          localStorage.setItem(cheieNumeJucator4,numeJucator4);
          localStorage.setItem(cheieNumeJucator5,numeJucator5);
        }
            else
            if(scor>celMaiMareScor3 && scor<celMaiMareScor2 && scor<celMaiMareScor1)
            {
                numeJucator5=numeJucator4;
                celMaiMareScor5=celMaiMareScor4;
                numeJucator4=numeJucator3;
                celMaiMareScor4=celMaiMareScor3;
                
                celMaiMareScor3=scor;
                numeJucator3=jucator; 
                
                localStorage.setItem(cheieScorJucator3,celMaiMareScor3);
                localStorage.setItem(cheieNumeJucator3,numeJucator3);
                localStorage.setItem(cheieScorJucator4,celMaiMareScor4);
                localStorage.setItem(cheieNumeJucator4,numeJucator4);
                localStorage.setItem(cheieScorJucator5,celMaiMareScor5);
                localStorage.setItem(cheieNumeJucator5,numeJucator5);
            }
                else
                if(scor>celMaiMareScor4 && scor<celMaiMareScor3 && scor<celMaiMareScor1 && scor<celMaiMareScor2)
                {
                    numeJucator5=numeJucator4;
                    numeJucator4=jucator;
                    celMaiMareScor5=celMaiMareScor4;
                    celMaiMareScor4=scor;

                    localStorage.setItem(cheieNumeJucator4,numeJucator4);
                    localStorage.setItem(cheieScorJucator4,celMaiMareScor4);
                    localStorage.setItem(cheieNumeJucator5,numeJucator5);
                    localStorage.setItem(cheieScorJucator5,celMaiMareScor5);


                }
                    else
                    if(scor>celMaiMareScor5&& scor<celMaiMareScor1 && scor<celMaiMareScor4 && scor<celMaiMareScor2 && scor<celMaiMareScor3)
                    {
                        celMaiMareScor5=scor;
                        numeJucator5=jucator;

                        localStorage.setItem(cheieNumeJucator5,numeJucator5);
                        localStorage.setItem(cheieScorJucator5,celMaiMareScor5);

                    }
   }

// ---------------------END VIETI + SCOR--------------------- //

// ---------------------FUNCTIA UPDATE--------------------- //

function update() {
    //desenez fundalul(spatiul)
    ctx.fillStyle = "#03254c";
    ctx.fillRect(0, 0, canvas.width, canvas.height); //700,700

    // ---------------------EXPLOZIE--------------------- //
    var explozieNava = nava.timpExplozie > 0;
    var licarit = nava.nrLicarit % 2 == 0;

    if (!explozieNava) {
        if (!nava.finalJoc&& licarit) {
            deseneazaNava(nava.x, nava.y, nava.a);
        }
        if (nava.nrLicarit > 0) {
            nava.timpLicarit--;
            if (nava.timpLicarit == 0) {
                nava.timpLicarit = Math.ceil(licaritNava * FPS);
                nava.nrLicarit--;
            }
        }
    }
    else {
        //explozia
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

    }
    // ---------------------END EXPLOZIE--------------------- //
    
    // ---------------------COLIZIUNI--------------------- //

    const margini = false; //margini pentru coliziune - cerc

    if (margini) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.stroke();
        ctx.arc(nava.x, nava.y, nava.r, 0, 2 * Math.PI, false);
    }

    // ---------------------END COLIZIUNI--------------------- //
    
    // ---------------------RACHETE--------------------- //    
    //desen
    for (var i = 0; i < nava.rachete.length; i++) {
        ctx.fillStyle = "#8C0D07";
        ctx.beginPath();
        ctx.arc(nava.rachete[i].x, nava.rachete[i].y, dimNava / 15, 0, 2 * Math.PI, false); 
        ctx.fill();
    }

    //COLIZIUNE RACHETA-ASTEROID
    var xAsteroid;
    var yAsteroid;
    var rAsteroid;
    var xRacheta;
    var yRacheta;
    for (var i = asteroizi.length - 1; i >= 0; i--) {
        rAsteroid = asteroizi[i].r;
        xAsteroid = asteroizi[i].x;
        yAsteroid = asteroizi[i].y;
        
        for (var j = nava.rachete.length - 1; j >= 0; j--) {
            xRacheta = nava.rachete[j].x;
            yRacheta = nava.rachete[j].y;
            if (distantaPuncte(xAsteroid, yAsteroid, xRacheta, yRacheta) < rAsteroid) {
                nava.rachete.splice(j, i);
                distrugeAsteroid(i);
                break;
            }
        }

    }
    // ---------------------END RACHETE--------------------- //

    // ---------------------NAVA--------------------- //
    //miscare nava
    if (!nava.finalJoc&& nava.inainteaza) {
        nava.inaintare.x =  0.8 * accNava * Math.cos(nava.a) +nava.inaintare.x  / FPS;
        nava.inaintare.y = nava.inaintare.y - 0.8 * accNava * Math.sin(nava.a) / FPS;

        if (!explozieNava && licarit) {
            //desen explozie
            ctx.fillStype = "yellow"
            ctx.strokeStyle = dimNava / 10;
            ctx.strokeStyle = "red";
            //desen triunghi
            ctx.beginPath();
            //stanga
            ctx.moveTo(
                nava.x - nava.r * (2 / 3 * Math.cos(nava.a) - 0.5 * Math.sin(nava.a)),
                nava.y + nava.r * (2 / 3 * Math.sin(nava.a) + 0.5 * Math.cos(nava.a)));
            //centru
            ctx.lineTo(
                nava.x - nava.r * 5 / 3 * Math.cos(nava.a),
                nava.y + nava.r * 5 / 3 * Math.sin(nava.a)); 
            //spate - dreapta
            ctx.lineTo(
                nava.x - nava.r * (2 / 3 * Math.cos(nava.a) + 0.5 * Math.sin(nava.a)),
                nava.y + nava.r * (2 / 3 * Math.sin(nava.a) - 0.5 * Math.cos(nava.a))); 
            //spate - stanga
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

    }
    else {
        nava.inaintare.x = nava.inaintare.x - nava.inaintare.x * fortaDeFrecare / FPS;
        nava.inaintare.y = nava.inaintare.y - nava.inaintare.y * fortaDeFrecare / FPS;
    }
    //pentru mers inapoi
    if(nava.inapoi){
        nava.inaintare.x = - 0.7 * accNava * Math.cos(nava.a) + nava.inaintare.x  / FPS;
        nava.inaintare.y = 0.7 * accNava * Math.sin(nava.a) + nava.inaintare.y / FPS;
    }
    else {
        nava.inaintare.x = nava.inaintare.x - nava.inaintare.x * fortaDeFrecare / FPS;
        nava.inaintare.y = nava.inaintare.y - nava.inaintare.y * fortaDeFrecare / FPS;
    }

    //pentru mers stanga
    if(nava.inainteStanga){
        nava.inaintare.x = nava.inaintare.x - 0.8 * accNava * Math.sin(nava.a) / FPS;
        nava.inaintare.y = nava.inaintare.y - 0.8 * accNava * Math.cos(nava.a) / FPS;
    }
    else {
        nava.inaintare.x = nava.inaintare.x - fortaDeFrecare * nava.inaintare.x / FPS;
        nava.inaintare.y = nava.inaintare.y - fortaDeFrecare * nava.inaintare.y / FPS;
    }

    //pentru mers dreapta
    if(nava.inainteDreapta){
        nava.inaintare.x = nava.inaintare.x + 0.8 * accNava * Math.sin(nava.a) / FPS;
        nava.inaintare.y = nava.inaintare.y + 0.8 * accNava * Math.cos(nava.a) / FPS;
    }
    else {
        nava.inaintare.x = nava.inaintare.x - fortaDeFrecare * nava.inaintare.x / FPS;
        nava.inaintare.y = nava.inaintare.y - fortaDeFrecare * nava.inaintare.y / FPS;
    }

    //miscare rachete
    for (var i = nava.rachete.length - 1; i >= 0; i--) {
        if (nava.rachete[i].distRachete > distantaRachete * canvas.width) {
            nava.rachete.splice(i, 1);
            continue; 
        }
        nava.rachete[i].x = nava.rachete[i].x + nava.rachete[i].xv;
        nava.rachete[i].y = nava.rachete[i].y + nava.rachete[i].yv;
        nava.rachete[i].distRachete = nava.rachete[i].distRachete + Math.sqrt(Math.pow(nava.rachete[i].xv, 2) + Math.pow(nava.rachete[i].yv, 2));

    }
    // ---------------------END NAVA--------------------- //

    // ---------------------VIETI--------------------- //
    //desenez vietile
    var culoareVieti;
    for(var i=0; i<vieti;i++){
        culoareVieti=explozieNava&&i==vieti-1?"red":"yellow"
        if(explozieNava && i==vieti-1)         
            culoareVieti="red";
        else
        culoareVieti="yellow";
        deseneazaNava(dimNava+i*dimNava*1.2,canvas.height-dimNava,0.5*Math.PI, culoareVieti);
    }

    // ---------------------END VIETI--------------------- //
       
       
    // ---------------------EXPLOZIE--------------------- //
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
            terminareJoc();
        
        }
        else
            nava = navaNoua();
     }
     
    }
    //a nu iesi din ecran:
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

    // ---------------------END NAVA--------------------- //


    // ---------------------ASTEROIZI--------------------- //ID

    //desenez asterorizii
    var x;
    var y;
    var r;
    var a;
    var varf;
    ctx.lineWidth = dimNava / 20;
    for (var i = 0; i < asteroizi.length; i++) {
        //ia proprietatile asteroizilor de mai sus
        x = asteroizi[i].x;
        y = asteroizi[i].y;
        r = asteroizi[i].r;
        a = asteroizi[i].a;
        varf = asteroizi[i].varf;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);

        if(asteroizi[i].r>70){
            ctx.fillStyle="#DFEAE2";
            ctx.fill();
            }
            else
                if(asteroizi[i].r>58)
                {
                    ctx.fillStyle="#8DC3A7";
                    ctx.fill();
                }
                else
                    if(asteroizi[i].r>40)
                    {
                        ctx.fillStyle="#358873";
                        ctx.fill();
                    }
                    else    
                        if(asteroizi[i].r>0)
                        {
                            ctx.fillStyle="#207567";
                            ctx.fill();
                        }
        ctx.font='25px Impact,Charcoal,sans-serif';
        ctx.textAlign='center';
        ctx.fillStyle='#36454F';
    
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
                
        
        if(textTransparent>=0){
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.fillStyle="rgba(128, 128, 128, "+textTransparent+")";
            ctx.font="small-caps 50px Impact,Charcoal,sans-serif";
            ctx.fillText(text,canvas.width/2,canvas.height/3);
            textTransparent=textTransparent-(1.0/timpTextFade/FPS);
        }
        else
            if(nava.finalJoc){
                jocNou();
            }

        const culoareText="#C51D34";
        
    // ---------------------END SCOR--------------------- //
        //desenez scorul
        ctx.textAlign="right";
        ctx.textBaseline="middle";
        ctx.fillStyle=culoareText;
        ctx.font="50px Lucida Console,sans-serif";
        ctx.fillText(scor,canvas.width/2,dimNava);
        
        //titlu scoruri
         ctx.textAlign="center";
         ctx.textBaseline="middle";
         ctx.fillStyle=culoareText;
         ctx.font="20px Lucida Console,sans-serif";
         ctx.fillText("Top scoruri:",canvas.width-dimNava-80,canvas.height-dimNava*7.3);

        //desenez numele jucatorilor
        const fontTextScor="15px Lucida Console,sans-serif";
          
        //desenez numele jucatorului cu cel mai mare scor 1
          ctx.textAlign="center";
          ctx.fillStyle=culoareText;
          ctx.font=fontTextScor;
          ctx.textBaseline="middle";
          ctx.fillText(numeJucator1,canvas.width-dimNava-50,canvas.height-dimNava*6.1);
        //desenez numele jucatorului cu cel mai mare scor 2
          ctx.textAlign="center";
          ctx.fillStyle=culoareText;
          ctx.font=fontTextScor;
          ctx.textBaseline="middle";
          ctx.fillText(numeJucator2,canvas.width-dimNava-50,canvas.height-dimNava*4.8);
        //desenez numele jucatorului cu cel mai mare scor 3
          ctx.textAlign="center";
          ctx.fillStyle=culoareText;
          ctx.font=fontTextScor;
          ctx.textBaseline="middle";
          ctx.fillText(numeJucator3,canvas.width-dimNava-50,canvas.height-dimNava*3.6);
        //desenez numele jucatorului cu cel mai mare scor 4
          ctx.textAlign="center";
          ctx.fillStyle=culoareText;
          ctx.font=fontTextScor;
          ctx.textBaseline="middle";
          ctx.fillText(numeJucator4,canvas.width-dimNava-50,canvas.height-dimNava*2.4);
        //desenez numele jucatorului cu cel mai mare scor 5
          ctx.textAlign="center";
          ctx.fillStyle=culoareText;
          ctx.font=fontTextScor;
          ctx.textBaseline="middle";
          ctx.fillText(numeJucator5,canvas.width-dimNava-50,canvas.height-dimNava*1.2);

        //cel mai mare scor 1
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle=culoareText;
        ctx.font=fontTextScor;
        ctx.fillText(celMaiMareScor1,canvas.width-dimNava-150,canvas.height-dimNava*6.1);
        //Cel mai mare scor 2
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle=culoareText;
        ctx.font=fontTextScor;
        ctx.fillText(celMaiMareScor2,canvas.width-dimNava-150,canvas.height-dimNava*4.8);
        //cel mai mare scor 3
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle=culoareText;
        ctx.font=fontTextScor;
        ctx.fillText(celMaiMareScor3,canvas.width-dimNava-150,canvas.height-dimNava*3.6);
        //cel mai mare scor 4
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle=culoareText;
        ctx.font=fontTextScor;
        ctx.fillText(celMaiMareScor4,canvas.width-dimNava-150,canvas.height-dimNava*2.4);
        //cel mai mare scor 5
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle=culoareText;
        ctx.font=fontTextScor;
        ctx.fillText(celMaiMareScor5,canvas.width-dimNava-150,canvas.height-dimNava*1.2);
          
    // ---------------------END SCOR--------------------- //

    // ---------------------COLIZIUNI--------------------- //
        //cerc pentru coliziuni
        if (margini) {
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();
        }     
    }
    // ---------------------END COLIZIUNI--------------------- //

    // ---------------------ASTEROID--------------------- //
    //mut asteroidul
    for (var i = 0; i < asteroizi.length; i++) {
        asteroizi[i].x = asteroizi[i].xv + asteroizi[i].x;
        asteroizi[i].y = asteroizi[i].yv + asteroizi[i].y;

        //pentru a nu iesi din ecran
        if (asteroizi[i].x < 0 - asteroizi[i].r) {
            //stanga
            asteroizi[i].x = asteroizi[i].r + canvas.width;
        }
        else
            if (asteroizi[i].x > asteroizi[i].r + canvas.width) {
                asteroizi[i].x = 0 - asteroizi[i].r;
            }

        if (asteroizi[i].y < 0 - asteroizi[i].r) {
            asteroizi[i].y = asteroizi[i].r+canvas.height;
        }
        else
            if (asteroizi[i].y > canvas.height + asteroizi[i].r) {
                asteroizi[i].y = 0 - asteroizi[i].r;
            }
    }

    // ---------------------END ASTEROID--------------------- //


    // ---------------------COLIZIUNI--------------------- //
    if (!explozieNava) {
        //verific daca exista coliziuni cu asteroizii
        if ( !nava.finalJoc&&nava.nrLicarit == 0 ) {
            for (var i = 0; i < asteroizi.length; i++) {
                if (distantaPuncte(nava.x, nava.y, asteroizi[i].x, asteroizi[i].y) < asteroizi[i].r + nava.r){
                    navaExplodeaza();
                    }
               
            }
        }
    }
     //coliziune intre asteroizi
     for (var i=0;i<asteroizi.length;i++){
        for(var j=i+1; j<asteroizi.length;j++)
        {
            if(distantaPuncte(asteroizi[i].x, asteroizi[i].y, asteroizi[j].x, asteroizi[j].y)<asteroizi[i].r+asteroizi[j].r){
                //le schimb directia pe ox si pe oy
                asteroizi[i].xv=asteroizi[i].xv*(-1);
                asteroizi[i].yv=asteroizi[i].yv*(-1);
                asteroizi[j].xv=asteroizi[j].xv*(-1);
                asteroizi[j].yv=asteroizi[j].yv*(-1);
                asteroizi[j].x=-1+asteroizi[j].x;
                asteroizi[j].y=-1+asteroizi[j].y;
                asteroizi[i].x=1+asteroizi[i].x;
                asteroizi[i].y=1+asteroizi[i].y;
            }
        }
    }
   
    // ---------------------END COLIZIUNI--------------------- //
    
    //dupa scorul de 100 * x puncte se adauga viata
    adaugareViata();
}