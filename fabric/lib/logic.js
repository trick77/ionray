/**
 * Hyperledger Composer Chaincode für Projektarbeit HSLU CAS Blockchain 2018.
 */

/**
 * Eine Dosis von einem Dosimeter erhalten.
 * @param {ch.hslu.casblc2018.ionray.DosisMessung} dosisMessung - die DosisMessung Transaktion
 * @transaction
 */
async function dosisMessung(dosisMessung) {  // eslint-disable-line no-unused-vars

    const dosimeter = dosisMessung.dosimeter;

    console.log('Dosis ' + dosisMessung.dosis + ' wird dem Dosimeter ' + dosismeter.$identifier + ' hinzufuegt!');

    if (dosimeter.dosisMessungen) {
        dosimeter.dosisMessungen.push(dosisMessung);
    } else {
        dosimeter.dosisMessungen = [dosisMessung];
    }

    // Dosismessung dem Dosimeter hinzufuegen.
    const dosimeterRegistry = await getAssetRegistry('ch.hslu.casblc1028.ionray.Dosimeter');
    await dosimeterRegistry.update(dosimeter);
}

/**
 * Fuer Demozwecke benoetigte Participants/Assets initialisieren.
 * @param {ch.hslu.casblc2018.ionray.SetupDemo} setupDemo - die SetupDemo Transaktion
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'ch.hslu.casblc2018.ionray';

    // Die Dosimetriestelle Suva erzeugen.
    const dosimetrieStelleBagId = 'dosi1';
    const dosimetrieStelle = factory.newResource(NS, 'DosimetrieStelle', dosimetrieStelleBagId);
    dosimetrieStelle.name = "Suva";

    // Ein Unternehmen erzeugen und die Dosimetriestelle Suva zuordnen.
    const unternehmenId = 'CHE-123.456.789';
    const unternehmen = factory.newResource(NS, 'Unternehmen', unternehmenId);
    unternehmen.name = 'Kantonsspital Luzern';
    unternehmen.dosimetrieStelle = factory.newRelationship(NS, 'DosimetrieStelle', dosimetrieStelleBagId);

    // Eine strahlenexponierte Person erzeugen und einem Unternehmen zuordnen.
    const ahvn13 = '7566523572040';
    const person = factory.newResource(NS, 'StrahlenexponiertePerson', ahvn13);
    person.ahvn13 = ahvn13;
    person.nachname = 'Hörndli';
    person.vorname = 'Guido';
    person.aktuellerArbeitgeber = factory.newRelationship(NS, 'Unternehmen', unternehmenId);

    // Dosimetriestelle dem Ledger hinzufuegen.
    const dosimetrieStelleRegistry = await getParticipantRegistry(NS + '.DosimetrieStelle');
    await dosimetrieStelleRegistry.addAll([dosimetrieStelle]);

    // Unternehmen dem Ledger hinzufuegen.
    const unternehmenRegistry = await getParticipantRegistry(NS + '.Unternehmen');
    await unternehmenRegistry.addAll([unternehmen]);

    // Strahlenexponierte Person dem Ledger hinzufuegen.
    const personRegistry = await getParticipantRegistry(NS + '.StrahlenexponiertePerson');
    await personRegistry.addAll([person]);

}