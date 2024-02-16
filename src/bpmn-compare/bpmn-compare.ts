import _ from "lodash";

export interface BpmnDiff {
    added: AddedElement[];
    changed: ModifiedElement[];
    removed: RemovedElement[];
    layoutChanged: MovedElement[];
}

export interface ElementChange {
    id: string;
}

export interface MovedElement extends ElementChange {}

export interface AddedElement extends ElementChange {
    newValue: any;
}

export interface RemovedElement extends ElementChange {
    oldValue: any;
}

export interface ModifiedElement extends ElementChange {
    differences: ElementPropertyDiff[];
}

export interface ElementPropertyDiff {
    key: string,
    type?: string,
    newValue?: any,
    oldValue?: any
}

const ignoredProperties = [
    "bounds",
    "label",
    "planeElement",
    "plane",
    "rootElements",
    "flowElements",
    "diagrams",
    "waypoint",
];

const getExtensionElementsDiff = (obj1, obj2) => {
    const newProperties = obj1.values
        ? (obj1.values as any[])
              .flatMap((x) => x.$children)
              .reduce((obj, item) => {
                  obj[item.name] = {
                      type: item.$type,
                      value: item.$body,
                  };
                  return obj;
              }, {})
        : {};

    const oldProperties = obj2.values
        ? (obj2.values as any[])
              .flatMap((x) => x.$children)
              .reduce((obj, item) => {
                  obj[item.name] = {
                      type: item.$type,
                      value: item.$body,
                  };
                  return obj;
              }, {})
        : {};

    return getElementPropertiesDiff(newProperties, oldProperties, (o1, o2) => o1.value === o2.value).map(x => {
        x.type = x.newValue?.type ? x.newValue.type : x.oldValue?.type;
        x.newValue = x.newValue?.value;
        x.oldValue = x.oldValue?.value;
        return x;
    })
};

const getElementPropertiesDiff = (
    obj1: any,
    obj2: any,
    comparer: (o1, o2) => boolean = (a, b) => a === b
) =>
    Object.keys(obj1)
        .reduce((result, key) => {
            if (!obj2.hasOwnProperty(key)) {
                if (key == "extensionElements") {
                    result = result.concat(
                        getExtensionElementsDiff(obj1[key], { values: null })
                    );
                } else {
                    result.push({ key, newValue: obj1[key] });
                }
            } else if (
                !ignoredProperties.includes(key) &&
                !comparer(obj1[key], obj2[key])
            ) {
                if (key == "extensionElements") {
                    result = result.concat(
                        getExtensionElementsDiff(obj1[key], obj2[key])
                    );
                } else {
                    result.push({
                        key,
                        newValue: obj1[key],
                        oldValue: obj2[key],
                    });
                }
            }
            return result;
        }, new Array<ElementPropertyDiff>())
        .concat(
            Object.keys(obj2).reduce((result, key) => {
                if (!obj1.hasOwnProperty(key)) {
                    if (key == "extensionElements") {
                        result = result.concat(
                            getExtensionElementsDiff(obj1[key], { values: null })
                        );
                    } else {
                        result.push({ key, oldValue: obj2[key] });
                    }
                }
                return result;
            }, new Array<ElementPropertyDiff>())
        );

const getObjectDiff = (obj1, obj2) =>
    Object.keys(obj1).reduce((result, key) => {
        if (!obj2.hasOwnProperty(key)) {
            result.push({ key, value: obj1[key] });
        }
        return result;
    }, new Array<any>());

const getMovedElements = (obj1, obj2) =>
    Object.keys(obj1.elementsById).reduce((result, key) => {
        if (obj2.elementsById.hasOwnProperty(key)) {
            const newElement = obj1.elementsById[key];
            const oldElement = obj2.elementsById[key];
            if (!_.isEqual(newElement.bounds, oldElement.bounds)) {
                result.push({ id: newElement.bpmnElement.id });
            }
        }
        return result;
    }, new Array<MovedElement>());

const getModifiedElements = (obj1, obj2) =>
    Object.keys(obj1.elementsById).reduce((result, key) => {
        if (obj2.elementsById.hasOwnProperty(key)) {
            const newElement = obj1.elementsById[key];
            const oldElement = obj2.elementsById[key];
            const diff = getElementPropertiesDiff(newElement, oldElement);
            if (diff.length > 0)
                result.push({ id: newElement.id, differences: diff });
        }
        return result;
    }, new Array<ModifiedElement>());

const bpmnCompare = (newBpmn, oldBpmn): BpmnDiff => {
    return {
        added: getObjectDiff(newBpmn.elementsById, oldBpmn.elementsById),
        removed: getObjectDiff(oldBpmn.elementsById, newBpmn.elementsById),
        changed: getModifiedElements(newBpmn, oldBpmn),
        layoutChanged: getMovedElements(newBpmn, oldBpmn),
    };
};

export default bpmnCompare;
