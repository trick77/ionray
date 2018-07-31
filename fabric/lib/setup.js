/**
 * Hyperledger Composer Transaktonslogik für Projektarbeit HSLU CAS Blockchain 2018.
 */

'use strict';

/**
 * Fuer Demozwecke benoetigte Participants/Assets initialisieren.
 * @param {ch.hslu.casblc2018.ionray.SetupDemo} setupDemo - die SetupDemo Transaktion
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const NS = 'ch.hslu.casblc2018.ionray';
    const factory = getFactory();

    // Die Dosimetriestelle Suva erzeugen.
    const dosimetrieStelleBagId = 'suva';
    const dosimetrieStelle = factory.newResource(NS, 'DosimetrieStelle', dosimetrieStelleBagId);
    dosimetrieStelle.name = "Suva";

    // Ein Unternehmen erzeugen und die Dosimetriestelle Suva zuordnen.
    const unternehmen1Id = 'CHE-123.456.789';
    const unternehmen1 = factory.newResource(NS, 'Unternehmen', unternehmen1Id);
    unternehmen1.name = 'Kantonsspital Luzern';
    unternehmen1.dosimetrieStelle = factory.newRelationship(NS, 'DosimetrieStelle', dosimetrieStelleBagId);

    // Ein weiteres Unternehmen erzeugen und die Dosimetriestelle Suva zuordnen.
    const unternehmen2Id = 'CHE-789.654.321';
    const unternehmen2 = factory.newResource(NS, 'Unternehmen', unternehmen2Id);
    unternehmen2.name = 'Radiologie Luzern AG';
    unternehmen2.dosimetrieStelle = factory.newRelationship(NS, 'DosimetrieStelle', dosimetrieStelleBagId);
 
    // Eine strahlenexponierte Person erzeugen und einem Unternehmen zuordnen.
    const ahvn13_1 = '1566523572010';
    const person1 = factory.newResource(NS, 'StrahlenexponiertePerson', ahvn13_1);
    person1.nachname = 'Muster';
    person1.vorname = 'Adelheid';
    person1.geburtsjahr = 2001;
    person1.aktuellerArbeitgeber = factory.newRelationship(NS, 'Unternehmen', unternehmen1Id);

    // Eine weitere strahlenexponierte Person erzeugen und einem anderen Unternehmen zuordnen.
    const ahvn13_2 = '2566523572020';
    const person2 = factory.newResource(NS, 'StrahlenexponiertePerson', ahvn13_2);
    person2.nachname = 'Hörndli';
    person2.vorname = 'Guido';
    person2.geburtsjahr = 1966;
    person2.aktuellerArbeitgeber = factory.newRelationship(NS, 'Unternehmen', unternehmen2Id);

    // Dosimeter erzeugen und einer Person zuordnen
    const mac_adresse1 = '01:42:4B:B2:DA:01';
    const dosimeter1 = factory.newResource(NS, 'Dosimeter', mac_adresse1);
    dosimeter1.dosimeterTyp = 'GANZKOERPER';
    dosimeter1.person = person1;

    // Dosimeter erzeugen und einer Person zuordnen
    const mac_adresse2 = '02:42:4B:B2:DA:02';
    const dosimeter2 = factory.newResource(NS, 'Dosimeter', mac_adresse2);
    dosimeter2.dosimeterTyp = 'GANZKOERPER';
    dosimeter2.person = person2;

    // Bundesorgane erzeugen
    const organ1 = factory.newResource(NS, 'Bundesorgan', 'BAG');
    organ1.name = 'Bundesamt für Gesundheit';
    
    const organ2 = factory.newResource(NS, 'Bundesorgan', 'ENSI');
    organ2.name = 'Eidgenössisches Nuklearsicherheitsinspektorat';
 
    // Dosimetriestelle dem Ledger hinzufuegen.
    const dosimetrieStelleRegistry = await getParticipantRegistry(NS + '.DosimetrieStelle');
    await dosimetrieStelleRegistry.addAll([dosimetrieStelle]);

    // Unternehmen dem Ledger hinzufuegen.
    const unternehmenRegistry = await getParticipantRegistry(NS + '.Unternehmen');
    await unternehmenRegistry.addAll([unternehmen1, unternehmen2]);

    // Strahlenexponierte Personen dem Ledger hinzufuegen.
    const personRegistry = await getParticipantRegistry(NS + '.StrahlenexponiertePerson');
    await personRegistry.addAll([person1, person2]);

    // Dosimeter dem Ledger hinzufuegen.
    const dosimeterRegistry = await getParticipantRegistry(NS + '.Dosimeter');
    await dosimeterRegistry.addAll([dosimeter1, dosimeter2]);

    // Bundesorgane dem Ledger hinzufuegen.
    const organRegistry = await getParticipantRegistry(NS + '.Bundesorgan');
    await organRegistry.addAll([organ1, organ2]);

}