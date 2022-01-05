# AsteroidsGame_Javascript_Canvas
Proiect Multimedia

Descriere: Realizarea unui joc similar cu Asteroids (https://en.wikipedia.org/wiki/Asteroids_(video_game)) utilizând controlul de tip sau controlul de tip . Exemplu: http://www.raymondhill.net/puzzle-rhill/jigsawpuzzle-rhill.php

1p - implementare asteroizi (reprezentați sub formă de cerc): fiecare asteroid va avea asociată o valoare generată aleator în intervalul 1-4, indicând numărul de rachete necesar pentru distrugerea acestuia. Numărul de rachete necesare va fi afișat în permanență în cadrul desenului utilizat pentru asteroid. Culoarea și dimensiunea asteroidului se vor modifica în funcție de acest număr. Asteroizii se vor deplasa pe traiectorii liniare cu o viteză determinată aleator.

1p - implementare navă spațială desenată sub formă de triunghi; nava va putea fi controlată cu ajutorul următoarelor comenzi din tastatură: săgeți (deplasare navă sus / jos / stânga / dreapta cu o viteză constantă), z – rotire spre stânga, c – rotire spre dreapta, x – lansare rachetă în direcția în care este orientată nava; nava se poate deplasa în toate cele patru direcții indiferent de orientarea curentă.

1p - implementare rachete: se va reprezenta racheta pe parcursul deplasării de la nava spațială la asteroid. Se va asigura detecția coliziunii cu asteroidul și modificarea numărului de rachete necesar pentru distrugerea acestuia. Sunt permise maxim 3 rachete lansate simultan.

0.5p - coliziune între asteroizi: coliziunea dintre doi asteroizi va determina modificarea traiectoriei acestora

1p - coliziune între nava spațială și asteroizi: va determina reducerea numărului de “vieți” și repornirea jocului, până când numărul de vieți devine 0.

1p - regenerare număr vieți: la distrugerea fiecărui asteroid jucătorul va obține un număr de puncte. La atingerea unui număr predefinit de puncte, se va actualiza numărul de ”vieți”.

1p - posibilitate control joc utilizând touchscreen

1p - stocarea celor mai bune 5 scoruri obținute și a numelui jucătorilor cu ajutorul Web Storage API (sau a unui alt API similar)
