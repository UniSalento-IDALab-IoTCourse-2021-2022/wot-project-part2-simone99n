# WoT Project: Simulatore di sensori - Norberti Simone

Installare RaspbianOS sul Raspberry:
https://www.raspberrypi.com/documentation/computers/getting-started.html

Per effettuare la connessione SSH al Raspberry lanciare il seguente comando e inserire la password (default ```raspberry```):
Attenzione: verificare l'indirizzo IP del Raspberry nella propria rete locale!
```
ssh pi@192.168.1.161
```
Installare NodeJS:
```
sudo apt update
sudo apt upgrade
sudo apt install nodejs
```
Installare git:
```
sudo apt install git
```
Importare il progetto:
```
mkdir SarcopeniaRasp
cd SarcopeniaRasp
git clone https://github.com/UniSalento-IDALab-IoTCourse-2021-2022/wot-project-raspberry-SimoneNorberti/  
```
Per avviare il simulatore di sensori:
```
node DataGenerator.js 
```
Disponibili più opzioni(due possibili pazienti simulati, 3 livelli di anomalia). Se nessuna opzione è specificata, viene selezionato il paziente 1 con nessun livello di anomalia:
```
--patient1
--patient2
--anonaly1
--anonaly2
--anonaly3
```

Esempi:
```
node DataGenerator.js 
node DataGenerator.js --patient2
node DataGenerator.js --patient2 --anomaly1
node DataGenerator.js --patient1 --anomaly3
```
