/**
 * Hyperledger Composer Transaktonslogik für Projektarbeit HSLU CAS Blockchain 2018.
 */

'use strict';

/**
 * Eine Dosis von einem Dosimeter erhalten.
 * @param {ch.hslu.casblc2018.ionray.DosisMessung} dosisMessung - die DosisMessung Transaktion
 * @transaction
 */
async function dosisMessung(dosisMessung) {  // eslint-disable-line no-unused-vars

    const NS = 'ch.hslu.casblc2018.ionray';

    const factory = getFactory();
    const dosimeter = dosisMessung.dosimeter;
    let isStrahlenEreignis = false;

    console.log('Dosis ' + dosisMessung.dosis + ' wird dem Dosimeter ' + dosimeter.$identifier + ' hinzufuegt!');

    if (dosimeter.dosisMessungen) {
        dosimeter.dosisMessungen.push(dosisMessung);
    } else {
        dosimeter.dosisMessungen = [dosisMessung];
    }

    const person = dosisMessung.dosimeter.person;

    // JahresDosis aktualisieren
    const aktuellesJahr = new Date(dosisMessung.messZeitpunkt).getFullYear();
    if (person.jahresDosis) {
        let foundJahresDosis = false;
        person.jahresDosis.forEach(function(jahresDosis) {
            if (jahresDosis.jahr == aktuellesJahr && jahresDosis.dosimeterTyp == dosimeter.dosimeterTyp) {
                console.log('Aktualisiere bestehende Jahresdosis für Jahr ' + aktuellesJahr);
                jahresDosis.dosis += dosisMessung.dosis;
                isStrahlenEreignis = checkStrahlenEreignis(person, dosimeter, jahresDosis.dosis, aktuellesJahr);
                foundJahresDosis = true;
            }
        });
        if (!foundJahresDosis) {
            console.log('Erstelle JahresDosis für Kombination Jahr ' + aktuellesJahr + ' und Dosimeter-Typ ' + dosimeter.dosimeterTyp);
            const jahresDosis = factory.newConcept(NS, 'JahresDosis');
            jahresDosis.dosimeterTyp = dosimeter.dosimeterTyp;
            jahresDosis.dosis = dosisMessung.dosis;
            jahresDosis.jahr = aktuellesJahr;
            person.jahresDosis.push(jahresDosis);    
            isStrahlenEreignis = checkStrahlenEreignis(person, dosimeter, jahresDosis.dosis, aktuellesJahr);
        }
    } else {
        console.log('Erstelle JahresDosis für Kombination Jahr ' + aktuellesJahr + ' und Dosimeter-Typ ' + dosimeter.dosimeterTyp);
        const jahresDosis = factory.newConcept(NS, 'JahresDosis');
        jahresDosis.dosimeterTyp = dosimeter.dosimeterTyp;
        jahresDosis.dosis = dosisMessung.dosis;
        jahresDosis.jahr = aktuellesJahr;
        person.jahresDosis = [jahresDosis];
        isStrahlenEreignis = checkStrahlenEreignis(person, dosimeter, jahresDosis.dosis, aktuellesJahr);
    } 

    // LebensDosis aktualisieren
    let foundLebensDosis = false;
    if (person.lebensDosis) {
        // Suchen, ob es den DosimeterTyp bereits einmal gibt.
 		person.lebensDosis.forEach(function(lebensDosis) {
            if (lebensDosis.dosimeterTyp == dosimeter.dosimeterTyp) { 
                console.log('Aktualisiere bestehende LebensDosis.');
                // Addere aktuelle Dosis der bestehenden/passenden LebensDosis
                lebensDosis.dosis += dosisMessung.dosis;
                foundLebensDosis = true;
            }
        });
    }
    if (!foundLebensDosis) {
        console.log('Bestehende/passende LebensDosis nicht gefunden, erstelle neuen Eintrag.');
        const lebensDosis = factory.newConcept(NS, 'LebensDosis');
        lebensDosis.dosimeterTyp = dosimeter.dosimeterTyp;
        lebensDosis.dosis = dosisMessung.dosis;
        person.lebensDosis = [lebensDosis];
    }

    // Person bzw. LebensDosis/JahresDosis aktualisieren.
    const personRegistry = await getParticipantRegistry(NS + '.StrahlenexponiertePerson');
    await personRegistry.update(person)

    // Dosismessung dem Dosimeter hinzufuegen.
    const dosimeterRegistry = await getParticipantRegistry(NS + '.Dosimeter');
    await dosimeterRegistry.update(dosimeter);

    // Für jede neue Messung einen Event emitten,
    const neueDosisMessungEvent = getFactory().newEvent(NS, 'NeueDosisMessung');
    neueDosisMessungEvent.dosisMessung = dosisMessung;
    emit(neueDosisMessungEvent);

    if (isStrahlenEreignis) {
        const strahlenEreignisEvent = getFactory().newEvent(NS, 'StrahlenEreignis');
        strahlenEreignisEvent.dosisMessung = dosisMessung;
        emit(strahlenEreignisEvent);
    }

}

/**
 * Hilfsfunktion, welche prüft, ob ein Strahlenereignis vorliegt.
 * @param {*} person 
 * @param {*} dosimeter 
 * @param {*} jahresDosis 
 */
function checkStrahlenEreignis(person, dosimeter, jahresDosis, aktuellesJahr) {
    // Prüfen, ob ein Strahlenereignis vorliegt.
    personAlter = aktuellesJahr - person.geburtsjahr;
    if (dosimeter.dosimeterTyp == 'GANZKOERPER') {
        if (personAlter < 19 && jahresDosis > 6.0) {
            return true;
        }
        if (personAlter >= 19 && jahresDosis > 20.0) {
            return true;
        }
    }
    if (dosimeter.dosimeterTyp == 'EXTREMITAET') {
        if (jahresDosis > 500.0) {
            return true;
        }
    }
    return false;
}
