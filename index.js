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
var Taln = /** @class */ (function () {
    /**
     * Creates an instance of Taln.
     * @author Jérémie Lopez
     * @param {string[]} phrase Phrase découpée par mot
     * @param {any} dictionnaire Liste de règle pour l'analyseur
     * @memberof Taln
     */
    function Taln(phrase, dictionnaire) {
        this.phrase = phrase;
        this.dictionnaire = dictionnaire;
    }
    /**
     * @description Lit une phrase et dis si elle est bien agencée
     * @author Jérémie Lopez
     * @public
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litPhrase = function () {
        var _this = this;
        var phrase = this.phrase;
        var errors = [];
        var groupes = [];
        var currentGroupe = [];
        // ---------------------------------------------
        // Verification mot à mot et création des groupes
        // ---------------------------------------------
        phrase.forEach(function (mot, i) {
            // S'il y a une erreur, sort de la boucle
            if (errors.length > 0) {
                return;
            }
            // ADJECTIF
            if (_this.litMot(mot, WordType.ADJECTIF)) {
                console.info(mot + " est un adjectif.", "Il doit \u00EAtre pr\u00E9c\u00E9d\u00E9 par un nom commun.");
                // Cas où l'adjectif est mal placé
                if (currentGroupe.length === 0) {
                    var error = 'On ne commence pas un groupe par un adjectif';
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
            if (_this.litMot(mot, WordType.ADVERBE)) {
                console.info(mot + " est un adverbe.", "Il est libre de se placer n'importe o\u00F9.");
                groupes.push(['adverbe']);
                return;
            }
            // ARTICLE
            if (_this.litMot(mot, WordType.ARTICLE_DEFINI) || _this.litMot(mot, WordType.ARTICLE_UNDEFINI)) {
                console.info(mot + " est un article.", "Il doit pr\u00E9c\u00E9d\u00E9 un nom commun.");
                if (currentGroupe.length !== 0) {
                    // Cas où l'article est mal placé
                    var error = 'On doit commencer par un article dans un groupe nominal';
                    errors.push(error);
                    console.error(error);
                    return;
                }
                if (!phrase[i + 1] || !_this.litMot(phrase[i + 1], WordType.NOM_COMMUN)) {
                    // Cas où l'article est mal placé
                    var error = 'Un nom commun doit succéder à l\'article dans un groupe nominal';
                    errors.push(error);
                    console.error(error);
                    return;
                }
                // Cas où l'adjectif est bien placé
                if (_this.litMot(mot, WordType.ARTICLE_DEFINI)) {
                    currentGroupe.push(WordType.ARTICLE_DEFINI);
                }
                else {
                    currentGroupe.push(WordType.ARTICLE_UNDEFINI);
                }
                return;
            }
            // NOM COMMUN
            if (_this.litMot(mot, WordType.NOM_COMMUN)) {
                console.info(mot + " est un nom commun.", "Il doit \u00EAtre pr\u00E9c\u00E9d\u00E9 par un article et/ou \u00EAtre succ\u00E9d\u00E9 par un adjectif");
                // Cas où le nom commun est mal placé
                if (currentGroupe.length === 0) {
                    var error = 'On ne commence pas un groupe par un nom commun';
                    errors.push(error);
                    console.error(error);
                    return;
                }
                // Cas où le nom commun est bien placé
                if (currentGroupe[currentGroupe.length - 1] === WordType.ARTICLE_DEFINI || currentGroupe[currentGroupe.length - 1] === WordType.ARTICLE_UNDEFINI) {
                    currentGroupe.push(WordType.NOM_COMMUN);
                    if (phrase[i + 1] && !_this.litMot(phrase[i + 1], WordType.ADJECTIF)) {
                        groupes.push(currentGroupe);
                        currentGroupe.splice(0, currentGroupe.length);
                    }
                }
                return;
            }
            // NOM PROPRE
            if (_this.litMot(mot, WordType.NOM_PROPRE)) {
                console.info(mot + " est un nom propre.", "Il se place ou il veut.", "Il se positionne comme un groupe nominal.");
                // Cas où le nom propre est mal placé
                if (currentGroupe.length !== 0) {
                    var error = 'Aucun élément d\'un groupe nominal ne doit précéder un nom propre';
                    errors.push(error);
                    console.error(error);
                }
                groupes.push([WordType.NOM_PROPRE]);
                return;
            }
            // PRONOM PERSONNEL
            if (_this.litMot(mot, WordType.PRONOM_PERSONNEL)) {
                console.info(mot + " est un pronom personnel.", "Il doit pr\u00E9c\u00E9d\u00E9 un verbe mais est facultatif.");
                if (currentGroupe.length !== 0) {
                    var error = 'Aucun élément d\'un groupe verbal ne doit précéder un pronom personnel';
                    errors.push(error);
                    console.error(error);
                }
                if (!_this.litMot(phrase[i + 1], WordType.VERBE)) {
                    var error = 'Un pronom personnel doit précéder un verbe.';
                    errors.push(error);
                    console.error(error);
                }
                currentGroupe.push(WordType.PRONOM_PERSONNEL);
                return;
            }
            // VERBE
            if (_this.litMot(mot, WordType.VERBE)) {
                console.info(mot + " est un verbe.", "Il peut \u00EAtre pr\u00E9c\u00E9d\u00E9 par un pronom personnel");
                if (currentGroupe.length !== 0 && currentGroupe[currentGroupe.length - 1] !== WordType.PRONOM_PERSONNEL) {
                    var error = 'Seul un pronom personnel peut précéder un verbe dans un groupe nominal';
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
        groupes.forEach(function (groupe, i) {
            // S'il y a une erreur, sort de la boucle
            if (errors.length > 0) {
                return;
            }
            // GROUPE NOMINAL
            if (_this.litGroupeNominal(groupe)) {
                if (currentGroupe.length === 0 || currentGroupe[currentGroupe.length - 1] === GroupeType.VERBAL) {
                    currentGroupe.push(GroupeType.NOMINAL);
                    return;
                }
                else {
                    var error = 'Un groupe nominal ne peut pas en suivre un autre';
                    errors.push(error);
                    console.error(error);
                }
            }
            // GROUPE VERBAL
            if (_this.litGroupeVerbal(groupe)) {
                if (currentGroupe.length === 0 || currentGroupe[currentGroupe.length - 1] === GroupeType.NOMINAL) {
                    currentGroupe.push(GroupeType.VERBAL);
                    return;
                }
                else {
                    var error = 'Un groupe verbal ne peut pas en suivre un autre';
                    errors.push(error);
                    console.error(error);
                }
            }
        });
        console.log();
        console.log("Phrase: " + phrase.join(' '));
        console.info(errors.length === 0 ? "Conclusion: cette phrase est correcte !" : "Conclusion: cette phrase est incorrecte !");
        return errors.length === 0;
    };
    /**
     * @description Retourne vrai si le mot est bien du type demandé
     * @author Jérémie Lopez
     * @protected
     * @param {string} mot
     * @param {WordType} type
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litMot = function (mot, type) {
        var _a;
        if (!this.dictionnaire[mot]) {
            console.error(mot + " n'existe pas dans le dictionnaire fournit");
            return false;
        }
        return !!((_a = this.dictionnaire[mot][type]) === null || _a === void 0 ? void 0 : _a.find(function (element) { return element === mot; }));
    };
    /**
     * @description Retourne vrai s'il sagit d'un groupe nominal
     * @author Jérémie Lopez
     * @protected
     * @param {string} groupeNominal
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litGroupeNominal = function (groupeNominal) {
        var _a, _b, _c;
        var enable = true;
        if (groupeNominal.length === 1 && ((_a = this.dictionnaire[groupeNominal[0]]) === null || _a === void 0 ? void 0 : _a.pronomPersonnel) === [groupeNominal[0]]) {
            return true;
        }
        var _loop_1 = function (i) {
            var element = groupeNominal[i];
            enable = ((_c = (_b = this_1.dictionnaire[element]) === null || _b === void 0 ? void 0 : _b.groupeNominal) === null || _c === void 0 ? void 0 : _c.findIndex(function (type) { return type === element; })) === i;
        };
        var this_1 = this;
        for (var i = 0; i < groupeNominal.length; i++) {
            _loop_1(i);
        }
        return enable;
    };
    /**
     * @description Retourne vrai s'il sagit d'un groupe verbal
     * @author Jérémie Lopez
     * @protected
     * @param {string} groupeVerbal
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litGroupeVerbal = function (groupeVerbal) {
        var _a, _b, _c;
        var enable = true;
        if (groupeVerbal.length === 1 && ((_a = this.dictionnaire[groupeVerbal[0]]) === null || _a === void 0 ? void 0 : _a.verbe) === [groupeVerbal[0]]) {
            return true;
        }
        var _loop_2 = function (i) {
            var element = groupeVerbal[i];
            enable = ((_c = (_b = this_2.dictionnaire[element]) === null || _b === void 0 ? void 0 : _b.groupeVerbal) === null || _c === void 0 ? void 0 : _c.findIndex(function (type) { return type === element; })) === i;
        };
        var this_2 = this;
        for (var i = 0; i < groupeVerbal.length; i++) {
            _loop_2(i);
        }
        return enable;
    };
    return Taln;
}());
var dictionnaire = {
    le: {
        article: ['articleDefini'],
        articleDefini: ['le'],
        groupeNominal: ['article', 'nomCommun', 'adjectif'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal']
    },
    lion: {
        nomCommun: ['lion'],
        groupeNominal: ['article', 'nomCommun', 'adjectif'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal']
    },
    ne: {
        adverbe: ['ne'],
        raccourci: ['n\'']
    },
    se: {
        pronomPersonnel: ['se'],
        raccourci: ['s\'']
    },
    associe: {
        verbe: ['associe'],
        groupeVerbal: ['pronomPersonnel', 'verbe'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal']
    },
    pas: {
        adverbe: ['pas']
    },
    avec: {
        adverbe: ['avec']
    },
    cafard: {
        nomCommun: ['cafard'],
        groupeNominal: ['article', 'nomCommun', 'adjectif'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal']
    }
};
var phrase = ['le', 'lion', 'ne', 'se', 'associe', 'avec', 'le', 'cafard'];
var taln = new Taln(phrase, dictionnaire);
taln.litPhrase();
