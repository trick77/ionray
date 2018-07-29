/**
 * Hyperledger Composer Transaktonslogik für Projektarbeit HSLU CAS Blockchain 2018.
 */

'use strict';

const NS = 'ch.hslu.casblc2018.ionray';

/**
 * Eine Dosis von einem Dosimeter erhalten.
 * @param {ch.hslu.casblc2018.ionray.DosisMessung} dosisMessung - die DosisMessung Transaktion
 * @transaction
 */
async function dosisMessung(dosisMessung) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const dosimeter = dosisMessung.dosimeter;

    console.log('Dosis ' + dosisMessung.dosis + ' wird dem Dosimeter ' + dosimeter.$identifier + ' hinzufuegt!');

    if (dosimeter.dosisMessungen) {
        dosimeter.dosisMessungen.push(dosisMessung);
    } else {
        dosimeter.dosisMessungen = [dosisMessung];
    }

    const person = dosisMessung.dosimeter.person;

    // JahresDosis aktualisieren
    let foundJahresDosis = 0;
    const currentYear = new Date(dosisMessung.messZeitpunkt).getFullYear();
    if (person.jahresDosis) {
        person.jahresDosis.forEach(function(jahresDosis) {
            if (jahresDosis.jahr == currentYear) {
                jahresDosis.dosis += dosisMessung.dosis;
                foundJahresDosis = 1;
            }
        });
    }
    if (foundJahresDosis === 0) {
        console.log('Bisher unbekanntes Jahr, erstelle neue JahresDosis');
        const jahresDosis = factory.newConcept(NS, 'JahresDosis');
        jahresDosis.dosimeterTyp = dosimeter.dosimeterTyp;
        jahresDosis.dosis = dosisMessung.dosis;
        jahresDosis.jahr = currentYear;
        person.jahresDosis = [jahresDosis];
    } 

    // LebensDosis aktualisieren
    let foundLebensDosis = 0;
    if (person.lebensDosis) {
        // Suchen, ob es den DosimeterTyp bereits einmal gibt.
 		person.lebensDosis.forEach(function(lebensDosis) {
            if (lebensDosis.dosimeterTyp == dosimeter.dosimeterTyp) { 
                console.log('Aktualisiere bestehende LebensDosis.');
                // Addere aktuelle Dosis der bestehenden/passenden LebensDosis
                lebensDosis.dosis += dosisMessung.dosis;
                foundLebensDosis = 1;
            }
        });
    }
    if (foundLebensDosis === 0) {
        console.log('Bestehende/passende LebensDosis nicht gefunden, erstelle neuen Eintrag.');
        const lebensDosis = factory.newConcept(NS, 'LebensDosis');
        lebensDosis.dosimeterTyp = dosimeter.dosimeterTyp;
        lebensDosis.dosis = dosisMessung.dosis;
        person.lebensDosis = [lebensDosis];
    }

    // Person bzw. LebensDosis aktualisieren.
    const personRegistry = await getParticipantRegistry(NS + '.StrahlenexponiertePerson');
    await personRegistry.update(person)

    // Dosismessung dem Dosimeter hinzufuegen.
    const dosimeterRegistry = await getParticipantRegistry(NS + '.Dosimeter');
    await dosimeterRegistry.update(dosimeter);
}

/**
 * Fuer Demozwecke benoetigte Participants/Assets initialisieren.
 * @param {ch.hslu.casblc2018.ionray.SetupDemo} setupDemo - die SetupDemo Transaktion
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

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
    person1.aktuellerArbeitgeber = factory.newRelationship(NS, 'Unternehmen', unternehmen1Id);

    // Eine weitere strahlenexponierte Person erzeugen und einem anderen Unternehmen zuordnen.
    const ahvn13_2 = '2566523572020';
    const person2 = factory.newResource(NS, 'StrahlenexponiertePerson', ahvn13_2);
    person2.nachname = 'Hörndli';
    person2.vorname = 'Guido';
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