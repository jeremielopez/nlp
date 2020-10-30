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
     * @description Lit un mot et en definie son utilité
     * @author Jérémie Lopez
     * @protected
     * @param {string} mot
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litMot = function (mot) {
        return true;
    };
    /**
     * @description Lit une phrase et dis si elle est bien agancée
     * @author Jérémie Lopez
     * @public
     * @param {string} phrase
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litPhrase = function (phrase) {
        return true;
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
        return true;
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
        return true;
    };
    /**
     * @description Retourne vrai s'il sagit d'un article
     * @author Jérémie Lopez
     * @protected
     * @param {string} article
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litArticle = function (article) {
        return true;
    };
    /**
     * @description Retourne vrai s'il sagit d'un adverbe
     * @author Jérémie Lopez
     * @protected
     * @param {string} adverbe
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litAdverbe = function (adverbe) {
        var _a, _b;
        return !!((_b = (_a = this.dictionnaire[adverbe]) === null || _a === void 0 ? void 0 : _a.adverbe) === null || _b === void 0 ? void 0 : _b.find(function (element) { return element === adverbe; }));
    };
    /**
     * @description Retourne vrai s'il sagit d'un nom commun
     * @author Jérémie Lopez
     * @protected
     * @param {string} nomCommun
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litNomCommun = function (nomCommun) {
        return true;
    };
    /**
     * @description Retourne vrai s'il sagit d'un adjectif
     * @author Jérémie Lopez
     * @protected
     * @param {string} adjectif
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litAdjectif = function (adjectif) {
        return true;
    };
    /**
     * @description Retourne vrai s'il sagit d'un nom propre
     * @author Jérémie Lopez
     * @protected
     * @param {string} nomPropre
     * @return {*}  {boolean}
     * @memberof Taln
     */
    Taln.prototype.litNomPropre = function (nomPropre) {
        return true;
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
        adverbe: ['ne']
    },
    se: {
        pronomPersonnel: ['se']
    },
    associe: {
        verbe: ['associe'],
        groupeVerbal: ['pronomPersonnel', 'verbe'],
        phrase: ['groupeNominal', 'groupeVerbal', 'groupeNominal']
    },
    pas: {
        adverbe: ['ne']
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
var phrase = ['le', 'lion', 'ne', 'se', 'associe', 'pas', 'avec', 'le', 'cafard'];
var taln = new Taln(phrase, dictionnaire);
console.log(taln.litAdverbe('ne'));
