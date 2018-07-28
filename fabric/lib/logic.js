/**
 * Hyperledger Composer Chaincode für Projektarbeit HSLU CAS Blockchain 2018.
 */

/**
 * Eine Dosis von einem Dosimeter erhalten.
 * @param {ch.hslu.casblc2018.ionray.dosisMessung} dosisMessung - die DosisMessung Transaktion
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
    const dosimetrieStelleBagId = '1-11';
    const dosimetrieStelle = factory.newResource(NS, 'DosimetrieStelle', dosimetrieStelleBagId);
    dosimetrieStelle.name = "Suva";

    // Ein Unternehmen erzeugen.
    const unternehmen = factory.newResource(NS, 'Unternehmen', '2-22');
    unternehmen.name = 'Kantonsspital Luzern'
    unternehmen.dosimetrieStelle = factory.newRelationship(NS, 'DosimetrieStelle', dosimetrieStelleBagId);

    // Dosimetriestelle dem Ledger hinzufuegen.
    const dosimetrieStelleRegistry = await getParticipantRegistry(NS + '.DosimetrieStelle');
    await dosimetrieStelleRegistry.addAll([dosimetrieStelle]);

    // Unternehmen dem Ledger hinzufuegen.
    const unternehmenRegistry = await getParticipantRegistry(NS + '.Unternehmen');
    await unternehmenRegistry.addAll([unternehmen]);
}