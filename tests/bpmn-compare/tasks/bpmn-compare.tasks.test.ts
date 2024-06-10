import bpmnCompare from "../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./empty.bpmn";
import * as taskBpmn from "./task.bpmn";
import * as changedContinuationBpmn from "./changed_continuation.bpmn";
import * as changedInputOutput from "./changed_io.bpmn";
import * as extensionPropBpmn from "./extension_props.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Task: task added", () => {
    return loadDiff(taskBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Task",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Activity_164nis1",
                            oldValue: "",
                        },
                    ],
                },
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
            ],
            changed: [],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Task -> Task with continuation: task continuation added", () => {
    return loadDiff(changedContinuationBpmn.default, taskBpmn.default).then(
        (data) =>
            expect(
                bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)
            ).toStrictEqual({
                added: [],
                changed: [
                    {
                        name: undefined,
                        id: "Activity_164nis1",
                        differences: [
                            {
                                key: "camunda:failedJobRetryTimeCycle",
                                newValue: '{"$body":"123"}',
                                oldValue: undefined,
                                type: "camunda:failedJobRetryTimeCycle",
                                subtype: undefined
                            },
                            {
                                key: "camunda:asyncBefore",
                                newValue: "true",
                                oldValue: "",
                            },
                            {
                                key: "camunda:asyncAfter",
                                newValue: "true",
                                oldValue: "",
                            },
                            {
                                key: "camunda:jobPriority",
                                newValue: "test",
                                oldValue: "",
                            },
                        ],
                    },
                ],
                layoutChanged: [],
                removed: [],
            })
    );
});

test("Task -> Task with IO: task input/output added", () => {
    return loadDiff(changedInputOutput.default, taskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "input",
                            newValue: "${testExpression}",
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: undefined
                        },
                        {
                            key: "inputScript",
                            newValue: [
                                {
                                    $body: "testScript();",
                                    $type: "camunda:script",
                                    scriptFormat: "javascript",
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: undefined
                        },
                        {
                            key: "inputScriptExternal",
                            newValue: [
                                {
                                    $type: "camunda:script",
                                    resource: "someResource",
                                    scriptFormat: "groovy",
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: undefined
                        },
                        {
                            key: "inputList",
                            newValue: [
                                {
                                    $type: "camunda:list",
                                    $children: [
                                        {
                                            $type: "camunda:value",
                                            $body: "value1",
                                        },
                                        {
                                            $type: "camunda:value",
                                            $body: "value2",
                                        },
                                    ],
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: undefined
                        },
                        {
                            key: "inputMap",
                            newValue: [
                                {
                                    $type: "camunda:map",
                                    $children: [
                                        {
                                            $type: "camunda:entry",
                                            key: "key1",
                                            $body: "value1",
                                        },
                                        {
                                            $type: "camunda:entry",
                                            key: "key2",
                                            $body: "value2",
                                        },
                                    ],
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: undefined
                        },
                        {
                            key: "output",
                            newValue: "${simpleOutputExpression}",
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: undefined
                        },
                        {
                            key: "outputScript",
                            newValue: [
                                {
                                    $body: "someOutputScript();",
                                    $type: "camunda:script",
                                    scriptFormat: "javascript",
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: undefined
                        },
                        {
                            key: "outputScriptExternal",
                            newValue: [
                                {
                                    resource: "externalJavaClass",
                                    $type: "camunda:script",
                                    scriptFormat: "java",
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: undefined
                        },
                        {
                            key: "outputList",
                            newValue: [
                                {
                                    $type: "camunda:list",
                                    $children: [
                                        {
                                            $type: "camunda:value",
                                            $body: "ouputValue1",
                                        },
                                        {
                                            $type: "camunda:value",
                                            $body: "outputValue2",
                                        },
                                    ],
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: undefined
                        },
                        {
                            key: "outputMap",
                            newValue: [
                                {
                                    $type: "camunda:map",
                                    $children: [
                                        {
                                            $type: "camunda:entry",
                                            key: "outputKey1",
                                            $body: "outputValue1",
                                        },
                                        {
                                            $type: "camunda:entry",
                                            key: "outputKey2",
                                            $body: "outputValue2",
                                        },
                                    ],
                                },
                            ],
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: undefined
                        },
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Task -> Task with extension props: extension props added", () => {
    return loadDiff(extensionPropBpmn.default, taskBpmn.default).then(
        (data) =>
            expect(
                bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)
            ).toStrictEqual({
                added: [],
                changed: [
                    {
                        name: undefined,
                        id: "Activity_164nis1",
                        differences: [
                            {
                                key: "testExtensionProperty",
                                newValue: "testExtensionValue",
                                oldValue: undefined,
                                subtype: undefined,
                                type: "camunda:property"
                            }
                        ],
                    },
                ],
                layoutChanged: [],
                removed: [],
            })
    );
});