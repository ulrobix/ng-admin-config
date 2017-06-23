
function defaultComparator(value1, value2) {
    value1 = value1.toString();
    value2 = value2.toString();
    if (value1 > value2) return 1;
    else if (value1 < value2) return -1;
    else return 0;
}

function standardComparator(value1, value2) {
    if (value1 > value2) return 1;
    else if (value1 < value2) return -1;
    else return 0;
}

function dateTimeComparator(value1, value2) {
    value1 = value1.getTime();
    value2 = value2.getTime();
    if (value1 > value2) return 1;
    else if (value1 < value2) return -1;
    else return 0;
}

function createChoiceComparator(choiceOrder) {
    return function(value1, value2) {
        value1 = choiceOrder[value1];
        value2 = choiceOrder[value2];
        if (value1 > value2) return 1;
        else if (value1 < value2) return -1;
        else return 0;
    }
}

function createSortDirComparator(field, comparator) {
    let sortDir = field.sortDir();
    let direction = sortDir == 'ASC'  ? 1 : -1;
    return function(value1, value2) {
        return comparator(value1, value2) * direction;
    }
}


export default class FieldComparatorFactory {


    create(field, datastore) {
        function createNoSortDir() {
            let type = field.type();
            switch (type) {
                case 'boolean':
                case 'string':
                case 'text':
                case 'email':
                case 'file':
                case 'number':
                case 'float':
                    return standardComparator;
                case 'date':
                case 'datetime':
                    return dateTimeComparator;
                case 'reference':
                case 'reference_many':
                    let referenceOrder = datastore.getReferenceChoicesById(field);
                    return createChoiceComparator(referenceOrder);
                case 'choice':
                case 'choices':
                    let choiceOrder = {};
                    let choices = field.choices();
                    if (choices) {
                        for(let i = 0; i < choices.length; i++) {
                            choiceOrder[choices[i]] = i;
                        }
                    }
                    return createChoiceComparator(choiceOrder);
                default:
                    return defaultComparator;
            }
        }

        return createSortDirComparator(field, createNoSortDir());
    }

}
