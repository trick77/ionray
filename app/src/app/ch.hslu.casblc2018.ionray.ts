import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace ch.hslu.casblc2018.ionray{
   export enum DosimeterTyp {
      GANZKOERPER,
      EXTREMITAET,
   }
   export class LebensDosis {
      dosimeterTyp: DosimeterTyp;
      dosis: number;
   }
   export class JahresDosis {
      dosimeterTyp: DosimeterTyp;
      dosis: number;
      jahr: number;
   }
   export class StrahlenexponiertePerson extends Participant {
      ahvn13: string;
      vorname: string;
      nachname: string;
      geburtsjahr: number;
      lebensDosis: LebensDosis[];
      jahresDosis: JahresDosis[];
      aktuellerArbeitgeber: Unternehmen;
   }
   export class Unternehmen extends Participant {
      uid: string;
      name: string;
      dosimetrieStelle: DosimetrieStelle;
   }
   export class DosimetrieStelle extends Participant {
      bagId: string;
      name: string;
   }
   export class Bundesorgan extends Participant {
      kurzname: string;
      name: string;
   }
   export class Dosimeter extends Participant {
      mac_adresse: string;
      dosimeterTyp: DosimeterTyp;
      dosisMessungen: DosisMessung[];
      person: StrahlenexponiertePerson;
   }
   export class DosisMessung extends Transaction {
      dosis: number;
      messZeitpunkt: Date;
      dosimeter: Dosimeter;
   }
   export class SetupDemo extends Transaction {
   }
   export class NeueDosisMessung extends Event {
      dosisMessung: DosisMessung;
   }
   export class StrahlenEreignis extends Event {
      dosisMessung: DosisMessung;
   }
// }
