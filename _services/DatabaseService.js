import { jsonMapping } from './jsonMapping';
import { jsonMappingPerguntas } from './jsonMappingPerguntas';

export function getDataBase(arrayTags) {
    let resultArr = [];
    const hasAll = arrayTags.some(tag => tag.toLowerCase() === "todos");

    if (hasAll) {
        // Se 'todos' estiver nos tags, incluir todos os arquivos JSON
        for (const key in jsonMapping) {
            if (jsonMapping.hasOwnProperty(key)) {
                resultArr = [...resultArr, ...jsonMapping[key]];
            }
        }
    } else {
        // Incluir apenas os arquivos JSON correspondentes aos tags fornecidos
        arrayTags.forEach(tag => {
            const lowerTag = tag.toLowerCase();
            if (jsonMapping.hasOwnProperty(lowerTag)) {
                resultArr = [...resultArr, ...jsonMapping[lowerTag]];
            }
        });
    }

    return resultArr;
}



export function getDataBaseQuestions(arrayTags) {
    let resultArr = [];
    const hasAll = arrayTags.some(tag => tag.toLowerCase() === "todos");

    if (hasAll) {
        // Se 'todos' estiver nos tags, incluir todos os arquivos JSON
        for (const key in jsonMappingPerguntas) {
            if (jsonMappingPerguntas.hasOwnProperty(key)) {
                resultArr = [...resultArr, ...jsonMappingPerguntas[key]];
            }
        }
    } else {
        // Incluir apenas os arquivos JSON correspondentes aos tags fornecidos
        arrayTags.forEach(tag => {
            const lowerTag = tag.toLowerCase();
            if (jsonMappingPerguntas.hasOwnProperty(lowerTag)) {
                resultArr = [...resultArr, ...jsonMappingPerguntas[lowerTag]];
            }
        });
    }

    return resultArr;
}