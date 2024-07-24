import { Icon, IconSize } from "azure-devops-ui/Icon";
import { IListItemDetails, ListItem } from "azure-devops-ui/List";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import React from "react";
import { ModifiedElement } from "../bpmn-compare/bpmn-compare";
import { JSONTree } from 'react-json-tree';

const parseAttributesChanges = (attrs) => {
    let attributes = [] as any[];
    let attribute: keyof typeof attrs;
    for(attribute in attrs)
        {
            if(attribute === "extensionElements")
            {
                if(attrs[attribute].newValue)
                {
                    attributes = attributes.concat(parseModelExtensionChanges(attrs[attribute].newValue));
                }
                if(attrs[attribute].oldValue)
                {
                    attributes = attributes.concat(parseModelExtensionChanges(attrs[attribute].newValue));
                }
            }
            else
                attributes.push({
                    name: attribute,
                    oldValue: attrs[attribute].newValue,
                    newValue: attrs[attribute].oldValue
            });
        }
    
    return attributes;
}

const parseModelExtensionChanges = (extensionElements) => {
    if(!extensionElements) return [];
    let changes = [] as Array<any>;
    const values = extensionElements.values as Array<any>;
    values.forEach(x => {
        if(!x.$children) return;
        const children = x.$children as Array<any>;
        children.forEach(c => {
            changes.push({ name: c.name, type: c.$type, newValue: c.$body ? c.$body : "" });
        })
    });

    return changes;
}

export const getChangeItemProvider = (changes : ModifiedElement[]) => {
    return new ArrayItemProvider(changes);
}

const getIconFromType = (type) => {
    switch(type) {
        case "camunda:inputParameter":
            return "Forward";
        case "camunda:outputParameter":
            return "Back";
        default:
            return "Embed";
    }
}

const theme = {
    base00: '#00000000',
}

const renderValue = (value: string, className: string) => {
    try{
        let jsonData = typeof(value) == "string" ? JSON.parse(value) : value;
        return (<div className={className}><JSONTree data={jsonData} hideRoot={true} theme={theme}
            labelRenderer={([key]) => <strong className={className}>{key}</strong>}
            valueRenderer={(raw) => <em className={className}>{raw}</em>}
        /></div>)
    }
    catch
    {
        if(typeof(value) == "string")
            return (<span className={className}>{value}</span>)
    }
}

const AttributeChangeDetails = ({ attributeChange }) => {
    return (
    <div className="flex-row flex-start">
        <Icon className="margin-4" iconName={getIconFromType(attributeChange.type)} size={IconSize.small}/>
        <div className="fontSizeMS font-size-ms secondary-text wrap-text">
            <span className="margin-4">{attributeChange.key}:</span>
            {attributeChange.newValue && renderValue(attributeChange.newValue, "margin-4 property-added")}
            {attributeChange.oldValue && renderValue(attributeChange.oldValue, "margin-4 property-removed")}
        </div>
    </div>
);
}

export const renderRow = (
    index: number,
    item: ModifiedElement,
    details: IListItemDetails<ModifiedElement>,
    key?: string
) => {
    return (<ListItem key={key || "list-item" + index} index={index} details={details}>
    <div className="list-example-row flex-row h-scroll-hidden">
        <div
            style={{ marginLeft: "10px", padding: "10px 0px" }}
            className="flex-column h-scroll-hidden"
        >
        <span className="wrap-text">{item.id}</span>
        {item.name && <span className="wrap-text">{item.name}</span>}
            {item.differences.map((x, i) => <AttributeChangeDetails key={i} attributeChange={x}/>)}
        </div>
    </div>
</ListItem>)
};
