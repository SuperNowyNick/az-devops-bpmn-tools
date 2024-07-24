import * as React from "react";

import { Panel } from "azure-devops-ui/Panel";
import { ScrollableList } from "azure-devops-ui/List";
import { ContentSize } from "azure-devops-ui/Callout";

import { getChangeItemProvider, renderRow } from "./BpmnDiffChange";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { BpmnDiff } from "../bpmn-compare/bpmn-compare";

const BpmnDiffDetailsPanel = (props: { onClose: () => void, changes : BpmnDiff | undefined, focusOn: (id: string, removed?: boolean) => void }) => {

    let addedItemProvider = props.changes
        ? getChangeItemProvider(props.changes.added)
        : new ArrayItemProvider([]);
    
    let changedItemProvider = props.changes
        ? getChangeItemProvider(props.changes.changed)
        : new ArrayItemProvider([]);

    let removedItemProvider = props.changes
        ? getChangeItemProvider(props.changes.removed)
        : new ArrayItemProvider([]);

    return (
        <Panel
            onDismiss={() => props.onClose()}
            titleProps={{ text: "Change details" }}
            modal={false}
            size={ContentSize.ExtraLarge}
            lightDismiss={false}
        >
            <div className="">
            <span className="title-s">Added:</span>
            <ScrollableList
                ariaLabel="Tree"
                renderRow={renderRow}
                width="100%"
                onSelect={(e, row) => props.focusOn(row.data.id)}
                itemProvider={addedItemProvider}
            />
            <span className="title-s">Changed:</span>
            <ScrollableList
                ariaLabel="Tree"
                renderRow={renderRow}
                width="100%"
                onSelect={(e, row) => props.focusOn(row.data.id)}
                itemProvider={changedItemProvider}
            />
            <span className="title-s">Removed:</span>
            <ScrollableList
                ariaLabel="Tree"
                renderRow={renderRow}
                width="100%"
                onSelect={(e, row) => props.focusOn(row.data.id, true)}
                itemProvider={removedItemProvider}
            />
            </div>
        </Panel>
    );
};

export default BpmnDiffDetailsPanel;