# Welcome to Deasy Pages

Deasy è un bot capace di rispondere alle domande più frequenti poste dagli studenti Unitn Disi.



## Features

#### Versione 1.0

Il bot sarà in grado di fornire informazioni base riguardo i dubbi più frequenti degli studenti Disi come:

* Come fare ad andare in erasmus.
* Come funziona il tirocinio.
* Informazioni riguardo la tesi.
* Informazioni riguardo la mensa (costi, tessera unitn, locazioni).
* Come richiedere esonero tasse e borse di studio.
* Informazioni riguardo il sistema di trasporti trentino.
* Quali informazioni può fornire il bot.

Sarà possibile chattare con il bot tramite una pagina web dedicata.

Sarà presente una pagina ad accesso restrittivo dove sarà possibile aggiungere argomenti trattabili dal bot o modificare argomenti esistenti.

#### Versione 2.0

Il bot sarà in grado di fornire informazioni più strutturate riguardo i dubbi più frequenti degli studenti Disi e di offrire servizi come:

* Orari Autobus e Treni.
* Orari aule.
* Voti studente.
* Servizio Meteo.
* Conversare con il bot.
* Pagina web per aggiornare il bot.

Sarà possibile chattare con il bot tramite telegram o altri sistemi di messaggistica.



## Organizzazione

### Front End
Enrico Eggidi, Alberto Bellumat  

Realizzazione di due pagine web hostate su un server node. La prima pagina sarà dedicata ad una chat per comunicare con il bot. La seconda pagina sarà dedicata a l'inserimento di nuovi argomenti che il bot potrà affrontare o la modifica di risposte o domande già esistenti.

### Logica Bot
Gabriele Maurina, Riccardo Facchin, Riccardo Ariotti  

Realizzazione di un bot tramite DialogFlow (bot API) capace di rispondere alle richieste di base dell'utente e di inoltrare le richieste al server node per richieste più complesse.

### Back End
Michele Armellini, Marco Merlin  

Realizzazione del server node capace di rispondere alle richieste della pagina web per comunicare con il bot e alle eventuali richieste del bot (tramite API ad hoc). Relizzazione di un database di supporto all'inserimento di nuovi argomenti.



## Mockup

<img src="https://i.imgur.com/in6eyhv.jpg"/>



## Strategia branching

Verrà utilizzata una strategia di branching gitflow semplificata con un branch master, un branch development e i branch feature.

<img src="https://camo.githubusercontent.com/98627ae5f592cb521b0b441c885a56c574f3ae65/687474703a2f2f6d61726367672e636f6d2f6173736574732f626c6f672f6769742d666c6f772d6265666f72652e6a7067"/>



## Mezzi di comunicazione

Per la comunicazione tra membri viene utilizzato un gruppo telegram, mentre per la gestione delle issue e lo stato del progetto viene utilizzato waffle.
