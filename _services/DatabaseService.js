import * as FrasesN5 from '../_database/frases/frases_n5.json';
import * as FrasesN5AdverbosFrequencia from '../_database/frases/frases_n5_adverbos_frequencia.json';
import * as FrasesN5Adjetivos from '../_database/frases/frases_n5_adjetivos.json';
import * as FrasesN5VocabAnimais from '../_database/frases/frases_n5_vocabulario_animais.json';
import * as FrasesN5VocabContagem  from '../_database/frases/frases_n5_vocabulario_contagem.json';
import * as FrasesN5VocabEscolar  from '../_database/frases/frases_n5_vocabulario_escolar.json';
import * as FrasesN5VocabFamiliar  from '../_database/frases/frases_n5_vocabulario_familia.json';
import * as FrasesN5VocabHospital from '../_database/frases/frases_n5_vocabulario_hospital.json';
import * as FrasesN5VocabProfissoes from '../_database/frases/frases_n5_vocabulario_profissoes.json';
import * as FrasesN5VocabRestaurante from '../_database/frases/frases_n5_vocabulario_restaurante.json';
import * as KissInTokyo from '../_database/frases/kissintokyo.json';
import * as FormaTa from '../_database/frases/frases_forma_ta.json';
import * as FormaTe from '../_database/frases/frases_forma_te.json';

export function getDataBase(arrayTags){
    var resultArr = [];
    var hasAll = arrayTags.some(res => res.toLowerCase() == "todos");
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "n5")){
        resultArr = [...resultArr, ...FrasesN5.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "adverbios")){
        resultArr = [...resultArr, ...FrasesN5AdverbosFrequencia.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "adjetivos")){
        resultArr = [...resultArr, ...FrasesN5Adjetivos.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "animais")){
        resultArr = [...resultArr, ...FrasesN5VocabAnimais.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "contagem")){
        resultArr = [...resultArr, ...FrasesN5VocabContagem.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "escola")){
        resultArr = [...resultArr, ...FrasesN5VocabEscolar.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "familia")){
        resultArr = [...resultArr, ...FrasesN5VocabFamiliar.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "hospital")){
        resultArr = [...resultArr, ...FrasesN5VocabHospital.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "profissoes")){
        resultArr = [...resultArr, ...FrasesN5VocabProfissoes.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "restaurante")){
        resultArr = [...resultArr, ...FrasesN5VocabRestaurante.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "kissintokyo")){
        resultArr = [...resultArr, ...KissInTokyo.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "forma ta")){
        resultArr = [...resultArr, ...FormaTa.default]
    }
    if(hasAll || arrayTags.some(res => res.toLowerCase() == "forma te")){
        resultArr = [...resultArr, ...FormaTe.default]
    }

    return resultArr;
}
