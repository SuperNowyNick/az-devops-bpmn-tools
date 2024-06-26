import bpmnCompare from "../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./empty.bpmn";
import * as startOnlyBpmn from "./start_only.bpmn";
import * as nameChangedBpmn from "./name_change.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> empty: no differences", () => {
    return loadDiff(emptyBbpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Start Only: start added", () => {
    return loadDiff(startOnlyBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [
                {
                    name: "Name",
                    id: "StartEvent_1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:StartEvent",
                            oldValue: "",
                        },
                        { key: "id", newValue: "StartEvent_1", oldValue: "" },
                        { key: "name", newValue: "Name", oldValue: "" },
                    ],
                },
            ],
            changed: [],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Start Only -> Empty: start removed", () => {
    return loadDiff(emptyBbpmn.default, startOnlyBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [],
            layoutChanged: [],
            removed: [
                {
                    name: "Name",
                    id: "StartEvent_1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "",
                            oldValue: "bpmn:StartEvent",
                        },
                        { key: "id", newValue: "", oldValue: "StartEvent_1" },
                        { key: "name", newValue: "", oldValue: "Name" },
                    ],
                },
            ],
        })
    );
});

test("Start Only -> Name change: name changed", () => {
    return loadDiff(nameChangedBpmn.default, startOnlyBpmn.default).then(
        (data) =>
            expect(
                bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)
            ).toStrictEqual({
                added: [],
                changed: [
                    {
                        differences: [
                            {
                                key: "name",
                                newValue: "New name",
                                oldValue: "Name",
                            },
                        ],
                        id: "StartEvent_1",
                        name: "New name",
                    },
                ],
                layoutChanged: [],
                removed: [],
            })
    );
});

test("Name change -> Start only: name changed", () => {
    return loadDiff(startOnlyBpmn.default, nameChangedBpmn.default).then(
        (data) =>
            expect(
                bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)
            ).toStrictEqual({
                added: [],
                changed: [
                    {
                        differences: [
                            {
                                key: "name",
                                newValue: "Name",
                                oldValue: "New name",
                            },
                        ],
                        id: "StartEvent_1",
                        name: "Name",
                    },
                ],
                layoutChanged: [],
                removed: [],
            })
    );
});
