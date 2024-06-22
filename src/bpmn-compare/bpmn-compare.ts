import _, { values } from "lodash";

export interface BpmnDiff {
    added: ModifiedElement[];
    changed: ModifiedElement[];
    removed: ModifiedElement[];
    layoutChanged: MovedElement[];
}

export interface ElementChange {
    id: string;
}

export interface MovedElement extends ElementChange {}

export interface ModifiedElement extends ElementChange {
    differences: ElementPropertyDiff[];
    name?: string;
}

export interface ElementPropertyDiff {
    key: string;
    type?: string;
    subtype?: string;
    newValue?: any;
    oldValue?: any;
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

const ignoredElements = [
    "bpmndi:BPMNShape",
    "bpmndi:BPMNEdge"
]

const extensionElementsKey = "extensionElements";
const eventDefinitionsKey = "eventDefinitions";
const conditionExpressionKey = "conditionExpression";
const bpmnDocumentationKey = "documentation";

function adjustPropName(itemName: string, object: any) {
    let i = 0;
    let name = itemName;
    while (object[name]) {
        name = `${itemName} (${++i})`;
    }
    return name;
}

function mapInputOutputParameters(item: any, subtype?: any | null) : any {
    if(!item.$children) return {
        name: item.name,
        type: item.$type,
        subtype: subtype,
        value: item.$body,
    };

    return {
        name: item.name,
        type: item.$type,
        subtype: subtype,
        value: item.$children,
    };
}

function mapConnectorProperties(item: any) : any {
    return item.$children.reduce((arr, child) => {
        switch(child.$type){
            case "camunda:inputOutput":
                arr = arr.concat(child.$children.map(x => mapNestedExtensionProperty(x, item.$type)));
                break;
            default:
                arr.push({
                    name: child.$type,
                    type: child.$type,
                    value: child.$body,
                })
        }
        return arr;
    }, []);
}

function mapNestedExtensionProperty(item: any, subtype?: any | null) : any {
    switch(item.$type){
        case "camunda:inputParameter":
        case "camunda:outputParameter":
            return mapInputOutputParameters(item, subtype);
        case "camunda:string":
        case "camunda:expression":
            return {
                name: item.$parent.name,
                type: item.$parent.$type,
                subtype: item.$type,
                value: item.$body,
            }
        case "camunda:formField":
            return {
                name: item.id,
                type: item.$type,
                subtype: item.type,
                value: item,
            };
        case "camunda:property":
            return {
                name: item.name,
                type: item.$type,
                value: item.value,
            }
        default:
            return {
                name: item.name,
                type: item.$type,
                value: item.$body,
            };
    }
}

function mapExtensionProperties(object: any[]): any[] {
    return object
        ? (object as any[])
              .map((x) => {
                  // check if property has nested fields but not for exectutionListener
                  if (x.$children && x.$type != "camunda:executionListener") {
                      if (x.$type == "camunda:connector")
                        return mapConnectorProperties(x);

                      return x.$children.map((item) => {
                          return mapNestedExtensionProperty(item);
                      });
                  }
                  // if not - map all property fields as a value
                  let { $type: type, ...properties } = x;
                  return [
                      {
                          name: type,
                          type: type,
                          value: JSON.stringify(properties),
                      },
                  ];
              })
              .flat(1)
              .reduce((obj, item) => {
                  let name = adjustPropName(item.name, obj);

                  obj[name] = {
                      type: item.type,
                      subtype: item.subtype,
                      value: item.value,
                  };
                  return obj;
              }, {})
        : {};
}

const getExtensionElementsDiff = (obj1, obj2) => {
    const newProperties = mapExtensionProperties(obj1.values);
    const oldProperties = mapExtensionProperties(obj2.values);
    
    return getElementPropertiesDiff(
        newProperties,
        oldProperties,
        (o1, o2) => o1?.value === o2?.value
    ).map((x) => {
        x.type = x.newValue?.type ? x.newValue.type : x.oldValue?.type;
        x.subtype = x.newValue?.subtype ? x.newValue.subtype : x.oldValue?.subtype;
        x.newValue = x.newValue?.value;
        x.oldValue = x.oldValue?.value;
        return x;
    });
};

function addPropertyChange(
    result: ElementPropertyDiff[],
    key,
    obj1: any | null,
    obj2: any | null,
    func: (obj: any) => any
) {
    result.push({
        key,
        newValue: obj1 ? func(obj1) : "",
        oldValue: obj2 ? func(obj2) : "",
    });
}

function propertyExistsOnAny(property, key, obj1, obj2) : boolean {
    if(obj1 && obj1[key] && obj1[key].hasOwnProperty(property)) return true;
    if(obj2 && obj2[key] && obj2[key].hasOwnProperty(property)) return true;
    return false;
}

function mapProperty(
    result: ElementPropertyDiff[],
    key: string,
    obj1?: any | null,
    obj2?: any | null
) {
    switch (key) {
        case extensionElementsKey:
            result.push(
                ...getExtensionElementsDiff(
                    obj1 ? obj1[key] : { values: null },
                    obj2 ? obj2[key] : { values: null }
                )
            );
            break;
        case eventDefinitionsKey:
            addPropertyChange(result, key, obj1, obj2, (o) =>
                o[key].map((x) => x.id)
            );
            break;
        case conditionExpressionKey:
            if(propertyExistsOnAny("language", key, obj1, obj2))
                addPropertyChange(result, "language", obj1, obj2, (o) => o[key]?.language);
            addPropertyChange(result, key, obj1, obj2, (o) => o[key].body);
            break;
        case bpmnDocumentationKey:
            addPropertyChange(result, key, obj1, obj2, (o) =>
                o[key].map(x => x.text)
            );
            break;
        default:
            addPropertyChange(result, key, obj1, obj2, (o) => o[key]);
            break;
    }
}

function addAttributes(obj: any) : any {
    if(!obj?.$attrs) return obj;
    return Object.entries(obj.$attrs).reduce((obj, [key,value]) => {
        if(!key.includes("xmlns:"))
            obj[key] = value;
        return obj;
    }, obj);
}

const mapAdditionalObjectProperties = (obj: any) : any => {
    obj = addAttributes(obj);
    switch (obj?.$type) {
        case "bpmn:ExclusiveGateway":
        case "bpmn:InclusiveGateway":
        case "bpmn:ComplexGateway":
            return { default: obj.default?.id, ...obj };
        case "bpmn:ReceiveTask":
            return { messageRef: obj.messageRef?.id, ...obj };
        case "bpmn:SignalEventDefinition":
            return { signalRef: obj.signalRef?.id, ...obj };
        case "bpmn:EscalationEventDefinition":
            return { escalationRef: obj.escalationRef?.id, ...obj }
        default:
            return obj;
    }
}

const getElementPropertiesDiff = (
    obj1: any,
    obj2: any,
    comparer: (o1, o2) => boolean = (a, b) =>
        JSON.stringify(a) === JSON.stringify(b)
) : ElementPropertyDiff[] => {
    obj1 = mapAdditionalObjectProperties(obj1);
    obj2 = mapAdditionalObjectProperties(obj2);
    return Object.keys(obj1)
        .reduce((result, key) => {
            if (ignoredProperties.includes(key)) return result;
            if (!obj2.hasOwnProperty(key)) {
                mapProperty(result, key, obj1);
            } else if (
                !ignoredProperties.includes(key) &&
                !comparer(obj1[key], obj2[key])
            ) {
                mapProperty(result, key, obj1, obj2);
            }
            return result;
        }, new Array<ElementPropertyDiff>())
        .concat(
            Object.keys(obj2).reduce((result, key) => {
                if (ignoredProperties.includes(key)) return result;
                if (!obj1.hasOwnProperty(key)) {
                    mapProperty(result, key, null, obj2);
                }
                return result;
            }, new Array<ElementPropertyDiff>())
        );
};

const getElementsDiff = (obj1, obj2, inverse = false): ModifiedElement[] => {
    if (!obj1) return [];
    return Object.keys(obj1).reduce((result, key) => {
        if (ignoredElements.includes(obj1[key]?.$type)) return result;
        if (!obj2.hasOwnProperty(key)) {
            const element = obj1[key];
            const diff = getElementPropertiesDiff(
                inverse ? {} : element,
                inverse ? element : {}
            );
            result.push({
                id: element.id,
                differences: diff,
                name: element.name,
            });
        }
        return result;
    }, new Array<ModifiedElement>());
};

const getMovedElements = (obj1, obj2): MovedElement[] => {
    if (!obj1?.elementsById) return [];
    return Object.keys(obj1.elementsById).reduce((result, key) => {
        if (obj2.elementsById.hasOwnProperty(key)) {
            const newElement = obj1.elementsById[key];
            const oldElement = obj2.elementsById[key];
            if (!_.isEqual(newElement.bounds, oldElement.bounds)) {
                result.push({ id: newElement.bpmnElement.id });
            }
        }
        return result;
    }, new Array<MovedElement>());
};

const getModifiedElements = (obj1, obj2): ModifiedElement[] => {
    if (!obj1?.elementsById) return [];
    return Object.keys(obj1.elementsById).reduce((result, key) => {
        if (ignoredElements.includes(obj1[key]?.$type)) return result;
        if (obj2.elementsById.hasOwnProperty(key)) {
            const newElement = obj1.elementsById[key];
            const oldElement = obj2.elementsById[key];
            const diff = getElementPropertiesDiff(newElement, oldElement);
            if (diff.length > 0)
                result.push({
                    id: newElement.id,
                    name: newElement.name,
                    differences: diff,
                });
        }
        return result;
    }, new Array<ModifiedElement>());
};

const bpmnCompare = (newBpmn, oldBpmn): BpmnDiff => {
    return {
        added: getElementsDiff(newBpmn.elementsById, oldBpmn.elementsById),
        removed: getElementsDiff(
            oldBpmn.elementsById,
            newBpmn.elementsById,
            true
        ),
        changed: getModifiedElements(newBpmn, oldBpmn),
        layoutChanged: getMovedElements(newBpmn, oldBpmn),
    };
};

export default bpmnCompare;
