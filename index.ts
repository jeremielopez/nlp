enum WordType {
    ARTICLE = "article",
    ADJECTIF = "adjectif",
    ADVERBE = "adverbe",
    NOM_COMMUN = "nomCommun",
    NOM_PROPRE = "nomPropre",
    PRONOM_PERSONNEL = "pronomPersonnel",
    VERBE = "verbe"
}


/**
 * @description Analyseur de texte
 * @author Jérémie Lopez
 * @class Taln
 */
class Taln {
    /**
     * Creates an instance of Taln.
     * @author Jérémie Lopez
     * @param {string[]} phrase Phrase découpée par mot
     * @param {any} dictionnaire Liste de règle pour l'analyseur
     * @memberof Taln
     */
    constructor(
        protected phrase: string[],
        protected dictionnaire: any,
    ) { }


    /**
     * @description Lit une phrase et dis si elle est bien agencée
     * @author Jérémie Lopez
     * @public
     * @return {*}  {boolean}
     * @memberof Taln
     */
    public litPhrase(): boolean {
        const phrase = this.phrase;
        const errors = [];

        phrase.forEach((mot: string, i: number) => {
            if (this.litMot(mot, WordType.ADJECTIF)) {
                console.info(`${mot} est un adjectif.`, `Il doit être précédé par un nom commun.`);
                return;
            }

            if (this.litMot(mot, WordType.ADVERBE)) {
                console.info(`${mot} est un adverbe.`, `Il est libre de se placer n'importe où.`);
                return;
            }

            if (this.litMot(mot, WordType.ADVERBE)) {
                console.info(`${mot} est un article.`, `Il doit précédé un nom commun.`);
                return;
            }

            if (this.litMot(mot, WordType.NOM_COMMUN)) {
                console.info(`${mot} est un nom commun.`, `Il doit être précédé par un article et/ou être succédé par un adjectif`);
                return;
            }

            if (this.litMot(mot, WordType.NOM_PROPRE)) {
                console.info(`${mot} est un nom propre.`, `Il se place ou il veut.`, `Il se positionne comme un groupe nominal.`);
                return;
            }

            if (this.litMot(mot, WordType.VERBE)) {
                console.info(`${mot} est un verbe.`, `Il peut être précédé par un pronom personnel`);
                return
            }
        });

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
    protected litMot(mot: string, type: WordType): boolean {
        if (!this.dictionnaire[mot]) {
            console.error(`${mot} n'existe pas dans le dictionnaire fournit`);
            return false;
        }

        return !!this.dictionnaire[mot][type]?.find(element => element === mot);
    }


    /**
     * @description Retourne vrai s'il sagit d'un groupe nominal
     * @author Jérémie Lopez
     * @protected
     * @param {string} groupeNominal
     * @return {*}  {boolean}
     * @memberof Taln
     */
    protected litGroupeNominal(groupeNominal: string): boolean {
        let enable = true;

        for (let i = 0; i < groupeNominal.length; i++) {
            const element = groupeNominal[i];

            enable = this.dictionnaire[element]?.groupeNominal?.indexOf(element) === i;
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
    protected litGroupeVerbal(groupeVerbal: string[]): boolean {
        let enable = true;

        for (let i = 0; i < groupeVerbal.length; i++) {
            const element = groupeVerbal[i];

            enable = this.dictionnaire[element]?.groupeVerbal?.indexOf(element) === i;
        }

        return enable;
    }
}


const dictionnaire = {
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


const phrase = ['le', 'lion', 'ne', 'se', 'associe', 'pas', 'avec', 'le', 'cafard'];
const taln = new Taln(phrase, dictionnaire);