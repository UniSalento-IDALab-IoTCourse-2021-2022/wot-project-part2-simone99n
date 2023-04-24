# WoT Project: SarcopeniaApp - Simulatore di sensori -Norberti Simone

L’obiettivo del progetto è la realizzazione di un sistema IoT low-cost e low-power che si occupa della raccolta, elaborazione ed analisi dei dati diagnostici di pazienti affetti da una malattia neurodegenerativa, la Sarcopenia, con la successiva visualizzazione delle informazioni estrapolate. Il punto di forza di questo progetto è che tale processo di monitoraggio e diagnostica viene effettuato direttamente da casa, a domicilio, senza che il paziente debba recarsi fisicamente presso una struttura ospedaliera. Inoltre, il medico ha la possibilità di effettuare monitoraggio e diagnostica direttamente nel suo studio da remoto grazie all’ausilio e al supporto del sistema stesso. La creazione di questo sistema è reso possibile grazie all’utilizzo di tecnologie IoT e di tecniche di Intelligenza Artificiale che, automatizzando il processo di monitoraggio e diagnostica, rendendo il tracciamento della malattia più semplice, accurato, senza mancate misurazioni, a basso costo e a basso consumo energetico.
Simulatore sensori: https://github.com/UniSalento-IDALab-IoTCourse-2021-2022/wot-project-raspberry-SimoneNorberti
App Android paziente: https://github.com/UniSalento-IDALab-IoTCourse-2021-2022/wot-project-androidapp-SimoneNorberti
Back-End (Cloud): https://github.com/UniSalento-IDALab-IoTCourse-2021-2022/wot-project-BackEnd-SimoneNorberti
Front-End (Cloud): https://github.com/UniSalento-IDALab-IoTCourse-2021-2022/wot-project-FrontEnd-SimoneNorberti

## Simulatore di sensori su Raspberry Pi
Installare RaspbianOS sul Raspberry:
https://www.raspberrypi.com/documentation/computers/getting-started.html

Per effettuare la connessione SSH al Raspberry lanciare il seguente comando e inserire la password (default ```raspberry```):
Attenzione: verificare l'indirizzo IP del Raspberry nella propria rete locale!
```
ssh pi@192.168.1.161
```
Installare NodeJS e i pacchetti utilizzati:
```
sudo apt update
sudo apt upgrade
sudo apt install nodejs
npm install mqtt
npm install fs
npm install csv-parse
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
cd wot-project-raspberry-SimoneNorberti/
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
