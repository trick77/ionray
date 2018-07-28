/**
 * Eine Dosis von einem Dosimeter erhalten.
 * @param {ch.hslu.casblc2018.ionray.DosisReading} dosisMessung - die DosisMessung Transaktion
 * @transaction
 */
async function dosisMessung(dosis) {  // eslint-disable-line no-unused-vars

    const shipment = temperatureReading.shipment;

    console.log('Dosis hinzufuegen ' + dosis + ' zum Dosimeter ' + dosis);

    // Dosismessing dem Dosimeter hinzufuegen.
    const dosimeterRegistry = await getAssetRegistry('ch.hslu.casblc1028.ionray.Dosimeter');
    await dosimeterRegistry.update(dosis);
}

/**
 * Fuer Demozwecke benoetigte Participants/Assets initialisieren..
 * @param {org.acme.shipping.perishable.SetupDemo} setupDemo - die SetupDemo Transaktion
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'ch.hslu.casblc2018.ionray';

    // Die Dosimetriestelle Suva erzeugen 
    const dosimetrieStelle = factory.newResource(NS, 'DosimetrieStelle', '1-11');
    dosimetrieStelle.name = "Suva";

    // Ein Unternehmen erzeugen.
    const unternehmen = factory.newResource(NS, 'Unternehmen', '2-22');
    unternehmen.name = 'Kantonsspital Luzern'
    unternehmen.dosimetrieStelle = factory.newRelationship(NS, 'DosimetrieStelle', '1-11');

    // Dosimetriestelle dem Ledger hinzufuegen.
    const growerRegistry = await getParticipantRegistry(NS + '.DosimetrieStelle');
    await growerRegistry.addAll([dosimetrieStelle]);

    // Unternehmen dem Ledger hinzufuegen.
    const importerRegistry = await getParticipantRegistry(NS + '.Unternehmen');
    await importerRegistry.addAll([unternehmen]);
}