var WordType;
(function (WordType) {
    WordType["ARTICLE_DEFINI"] = "articleDefini";
    WordType["ARTICLE_UNDEFINI"] = "articleUndefini";
    WordType["ADJECTIF"] = "adjectif";
    WordType["ADVERBE"] = "adverbe";
    WordType["NOM_COMMUN"] = "nomCommun";
    WordType["NOM_PROPRE"] = "nomPropre";
    WordType["PRONOM_PERSONNEL"] = "pronomPersonnel";
    WordType["VERBE"] = "verbe";
})(WordType || (WordType = {}));
var GroupeType;
(function (GroupeType) {
    GroupeType["NOMINAL"] = "groupeNominal";
    GroupeType["VERBAL"] = "groupeVerbal";
})(GroupeType || (GroupeType = {}));
/**
 * @description Analyseur de texte
 * @author Jérémie Lopez
 * @class Taln
 */
class Taln {
    /**
     * Creates an instance of Taln.
     * @author Jérémie Lopez
     * @param {string[]} phrase
     * @param {*} dictionnaire
     * @memberof Taln
     */
    constructor(phrase, dictionnaire, translation) {
        this.phrase = phrase;
        this.dictionnaire = dictionnaire;
        this.translation = translation;
    }
    /**
     * @description Lit une phrase et dis si elle est bien agencée
     * @author Jérémie Lopez
     * @public
     * @return {*}  {boolean}
     * @memberof Taln
     */
    litPhrase() {
        const phrase = this.phrase;
        const errors = [];
        const groupes = [];
        let currentGroupe = [];
        // ---------------------------------------------
        // Verification mot à mot et création des groupes
        // ---------------------------------------------
        phrase.forEach((mot, i) => {
            // S'il y a une erreur, sort de la boucle
            if (errors.length > 0) {
                return;
            }
            // ADJECTIF
            if (this.litMot(mot, WordType.ADJECTIF)) {
                console.info(`${mot} est un adjectif.`, `Il doit être précédé par un nom commun.`);
                // Cas où l'adjectif est mal placé
                if (currentGroupe.length === 0) {
                    const error = 'On ne commence pas un groupe par un adjectif';
                    errors.push(error);
                    console.error(error);
                    return;
                }
                // Cas où l'adjectif est bien placé
                if (currentGroupe[currentGroupe.length - 1] === WordType.NOM_COMMUN) {
                    currentGroupe.push(WordType.ADJECTIF);
                    groupes.push(currentGroupe);
                    currentGroupe.splice(0, currentGroupe.length);
                }
                return;
            }
            // ADVERBE
            if (this.litMot(mot, WordType.ADVERBE)) {
                console.info(`${mot} est un adverbe.`, `Il est libre de se placer n'importe où.`);
                if (this.dictionnaire[mot].raccourci && this.commenceParUneVoyelle(phrase[i + 1])) {
                    phrase[i] = this.dictionnaire[mot].raccourci[0];
                }
                groupes.push(['adverbe']);
                return;
            }
            // ARTICLE
            if (this.litMot(mot, WordType.ARTICLE_DEFINI) || this.litMot(mot, WordType.ARTICLE_UNDEFINI)) {
                console.info(`${mot} est un article.`, `Il doit précédé un nom commun.`);
                if (currentGroupe.length !== 0) {
                    // Cas où l'article est mal placé
                    const error = 'On doit commencer par un article dans un groupe nominal';
                    errors.push(error);
                    console.error(error);
                    return;
                }
                if (!phrase[i + 1] || !this.litMot(phrase[i + 1], WordType.NOM_COMMUN)) {
                    // Cas où l'article est mal placé
                    const error = 'Un nom commun doit succéder à l\'article dans un groupe nominal';
                    errors.push(error);
                    console.error(error);
                    return;
                }
                // Cas où l'adjectif est bien placé
                if (this.litMot(mot, WordType.ARTICLE_DEFINI)) {
                    currentGroupe.push(WordType.ARTICLE_DEFINI);
                }
                else {
                    currentGroupe.push(WordType.ARTICLE_UNDEFINI);
                }
                return;
            }
            // NOM COMMUN
            if (this.litMot(mot, WordType.NOM_COMMUN)) {
                console.info(`${mot} est un nom commun.`, `Il doit être précédé par un article et/ou être succédé par un adjectif`);
                // Cas où le nom commun est mal placé
                if (currentGroupe.length === 0) {
                    const error = 'On ne commence pas un groupe par un nom commun';
                    errors.push(error);
                    console.error(error);
                    return;
                }
                // Cas où le nom commun est bien placé
                if (currentGroupe[currentGroupe.length - 1] === WordType.ARTICLE_DEFINI || currentGroupe[currentGroupe.length - 1] === WordType.ARTICLE_UNDEFINI) {
                    currentGroupe.push(WordType.NOM_COMMUN);
                    if (phrase[i + 1] && !this.litMot(phrase[i + 1], WordType.ADJECTIF)) {
                        groupes.push(currentGroupe);
                        currentGroupe.splice(0, currentGroupe.length);
                    }
                }
                return;
            }
            // NOM PROPRE
            if (this.litMot(mot, WordType.NOM_PROPRE)) {
                console.info(`${mot} est un nom propre.`, `Il se place ou il veut.`, `Il se positionne comme un groupe nominal.`);
                // Cas où le nom propre est mal placé
                if (currentGroupe.length !== 0) {
                    const error = 'Aucun élément d\'un groupe nominal ne doit précéder un nom propre';
                    errors.push(error);
                    console.error(error);
                }
                groupes.push([WordType.NOM_PROPRE]);
                return;
            }
            // PRONOM PERSONNEL
            if (this.litMot(mot, WordType.PRONOM_PERSONNEL)) {
                console.info(`${mot} est un pronom personnel.`, `Il doit précédé un verbe mais est facultatif.`);
                if (currentGroupe.length !== 0) {
                    const error = 'Aucun élément d\'un groupe verbal ne doit précéder un pronom personnel';
                    errors.push(error);
                    console.error(error);
                }
                if (!this.litMot(phrase[i + 1], WordType.VERBE)) {
                    const error = 'Un pronom personnel doit précéder un verbe.';
                    errors.push(error);
                    console.error(error);
                }
                if (this.dictionnaire[mot].raccourci && this.commenceParUneVoyelle(phrase[i + 1])) {
                    phrase[i] = this.dictionnaire[mot].raccourci[0];
                }
                currentGroupe.push(WordType.PRONOM_PERSONNEL);
                return;
            }
            // VERBE
            if (this.litMot(mot, WordType.VERBE)) {
                console.info(`${mot} est un verbe.`, `Il peut être précédé par un pronom personnel`);
                if (currentGroupe.length !== 0 && currentGroupe[currentGroupe.length - 1] !== WordType.PRONOM_PERSONNEL) {
                    const error = 'Seul un pronom personnel peut précéder un verbe dans un groupe nominal';
                    errors.push(error);
                    console.error(error);
                }
                currentGroupe.push(WordType.VERBE);
                groupes.push(currentGroupe);
                currentGroupe.splice(0, currentGroupe.length);
                return;
            }
        });
        // -------------------------------
        // Vérification des groupes de mot
        // -------------------------------
        groupes.forEach((groupe, i) => {
            // S'il y a une erreur, sort de la boucle
            if (errors.length > 0) {
                return;
            }
            // GROUPE NOMINAL
            if (this.litGroupeNominal(groupe)) {
                if (currentGroupe.length === 0 || currentGroupe[currentGroupe.length - 1] === GroupeType.VERBAL) {
                    currentGroupe.push(GroupeType.NOMINAL);
                    return;
                }
                else {
                    const error = 'Un groupe nominal ne peut pas en suivre un autre';
                    errors.push(error);
                    console.error(error);
                }
            }
            // GROUPE VERBAL
            if (this.litGroupeVerbal(groupe)) {
                if (currentGroupe.length === 0 || currentGroupe[currentGroupe.length - 1] === GroupeType.NOMINAL) {
                    currentGroupe.push(GroupeType.VERBAL);
                    return;
                }
                else {
                    const error = 'Un groupe verbal ne peut pas en suivre un autre';
                    errors.push(error);
                    console.error(error);
                }
            }
        });
        console.log();
        console.log(`Phrase: ${phrase.join(' ')}`);
        console.log(`Traduction: The lion does not associate with the cockroach`);
        console.info(errors.length === 0 ? `Conclusion: cette phrase est correcte !` : `Conclusion: cette phrase est incorrecte !`);
        return errors.length === 0;
    }
    /**
     * @description Retourne vrai si le mot est bien du type demandé
     * @author Jérémie Lopez
     * @protected
     * @param {string} mot
     * @param {WordType} type
     * @return {*}  {boolean}
     * @memberof Taln
     */
    litMot(mot, type) {
        var _a;
        if (!this.dictionnaire[mot]) {
            console.error(`${mot} n'existe pas dans le dictionnaire fournit`);
            return false;
        }
        return !!((_a = this.dictionnaire[mot][type]) === null || _a === void 0 ? void 0 : _a.find(element => element === mot));
    }
    /**
     * @description Retourne vrai s'il sagit d'un groupe nominal
     * @author Jérémie Lopez
     * @protected
     * @param {string} groupeNominal
     * @return {*}  {boolean}
     * @memberof Taln
     */
    litGroupeNominal(groupeNominal) {
        var _a, _b, _c;
        let enable = true;
        if (groupeNominal.length === 1 && ((_a = this.dictionnaire[groupeNominal[0]]) === null || _a === void 0 ? void 0 : _a.pronomPersonnel) === [groupeNominal[0]]) {
            return true;
        }
        for (let i = 0; i < groupeNominal.length; i++) {
            const element = groupeNominal[i];
            enable = ((_c = (_b = this.dictionnaire[element]) === null || _b === void 0 ? void 0 : _b.groupeNominal) === null || _c === void 0 ? void 0 : _c.findIndex(type => type === element)) === i;
        }
        return enable;
    }
    /**
     * @description Retourne vrai s'il sagit d'un groupe verbal
     * @author Jérémie Lopez
     * @protected
     * @param {string} groupeVerbal
     * @return {*}  {boolean}
     * @memberof Taln
     */
    litGroupeVerbal(groupeVerbal) {
        var _a, _b, _c;
        let enable = true;
        if (groupeVerbal.length === 1 && ((_a = this.dictionnaire[groupeVerbal[0]]) === null || _a === void 0 ? void 0 : _a.verbe) === [groupeVerbal[0]]) {
            return true;
        }
        for (let i = 0; i < groupeVerbal.length; i++) {
            const element = groupeVerbal[i];
            enable = ((_c = (_b = this.dictionnaire[element]) === null || _b === void 0 ? void 0 : _b.groupeVerbal) === null || _c === void 0 ? void 0 : _c.findIndex(type => type === element)) === i;
        }
        return enable;
    }
    /**
     * @description Vérifie si le mot commence par une voyelle
     * @author Jérémie Lopez
     * @protected
     * @param {string} mot
     * @return {*}  {boolean}
     * @memberof Taln
     */
    commenceParUneVoyelle(mot) {
        return mot.toLocaleLowerCase().startsWith('a') ||
            mot.toLocaleLowerCase().startsWith('à') ||
            mot.toLocaleLowerCase().startsWith('â') ||
            mot.toLocaleLowerCase().startsWith('ä') ||
            mot.toLocaleLowerCase().startsWith('e') ||
            mot.toLocaleLowerCase().startsWith('é') ||
            mot.toLocaleLowerCase().startsWith('è') ||
            mot.toLocaleLowerCase().startsWith('ê') ||
            mot.toLocaleLowerCase().startsWith('ë') ||
            mot.toLocaleLowerCase().startsWith('i') ||
            mot.toLocaleLowerCase().startsWith('ï') ||
            mot.toLocaleLowerCase().startsWith('o') ||
            mot.toLocaleLowerCase().startsWith('ô') ||
            mot.toLocaleLowerCase().startsWith('u') ||
            mot.toLocaleLowerCase().startsWith('ù') ||
            mot.toLocaleLowerCase().startsWith('û') ||
            mot.toLocaleLowerCase().startsWith('ü');
    }
}
// Dictionnaire avec les traductions mot à mot
const dictionnaire = {
    le: {
        article: ['articleDefini'],
        articleDefini: ['le'],
        groupeNominal: ['article', 'nomCommun', 'adjectif'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal'],
        translation: {
            eng: 'the'
        }
    },
    lion: {
        nomCommun: ['lion'],
        groupeNominal: ['article', 'nomCommun', 'adjectif'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal'],
        translation: {
            eng: 'lion'
        }
    },
    ne: {
        adverbe: ['ne'],
        raccourci: ['n\''],
        translation: {
            eng: ''
        }
    },
    se: {
        pronomPersonnel: ['se'],
        raccourci: ['s\''],
        translation: {
            eng: 'itself'
        }
    },
    associe: {
        verbe: ['associe'],
        groupeVerbal: ['pronomPersonnel', 'verbe'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal'],
        translation: {
            eng: 'associate',
            groupeVerbal: ['verbe', 'pronomPersonnel'],
        }
    },
    pas: {
        adverbe: ['pas'],
        translation: {
            eng: ''
        }
    },
    avec: {
        adverbe: ['avec'],
        translation: {
            eng: 'with'
        }
    },
    cafard: {
        nomCommun: ['cafard'],
        groupeNominal: ['article', 'nomCommun', 'adjectif'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal'],
        translation: {
            eng: 'cockroach'
        }
    }
};
const phrase = ['le', 'lion', 'ne', 'se', 'associe', 'pas', 'avec', 'le', 'cafard'];
const taln = new Taln(phrase, dictionnaire, true);
taln.litPhrase();
// Objectif de traduction :
// The lion does not associate with the cockroach
//# sourceMappingURL=index.js.map