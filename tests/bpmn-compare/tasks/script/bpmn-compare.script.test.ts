import bpmnCompare from "../../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./empty.bpmn";
import * as scriptExternalBpmn from "./script_external.bpmn";
import * as scriptInlineBpmn from "./script_inline.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> External Script: external script added", () => {
    return loadDiff(scriptExternalBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [
                {
                    name: undefined,
                    id: "Flow_0r55a8q",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:SequenceFlow",
                            oldValue: "",
                        },
                        { key: "id", newValue: "Flow_0r55a8q", oldValue: "" },
                    ],
                },
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:ScriptTask",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Activity_164nis1",
                            oldValue: "",
                        },
                        {
                            key: "scriptFormat",
                            newValue: "javascript",
                            oldValue: "",
                        },
                        {
                            key: "camunda:resultVariable",
                            newValue: "someVariable",
                            oldValue: "",
                        },
                        {
                            key: "camunda:resource",
                            newValue: "externalResource",
                            oldValue: "",
                        },
                    ],
                },
            ],
            changed: [],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Inline Script: inline script added", () => {
    return loadDiff(scriptInlineBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [
                {
                    name: undefined,
                    id: "Flow_0r55a8q",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:SequenceFlow",
                            oldValue: "",
                        },
                        { key: "id", newValue: "Flow_0r55a8q", oldValue: "" },
                    ],
                },
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:ScriptTask",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Activity_164nis1",
                            oldValue: "",
                        },
                        {
                            key: "scriptFormat",
                            newValue: "groovy",
                            oldValue: "",
                        },
                        {
                            key: "script",
                            newValue: "someFunction();",
                            oldValue: "",
                        },
                        {
                            key: "camunda:resultVariable",
                            newValue: "someVariable",
                            oldValue: "",
                        },
                    ],
                },
            ],
            changed: [],
            layoutChanged: [],
            removed: [],
        })
    );
});
