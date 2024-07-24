import bpmnCompare from "../../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./../empty.bpmn";
import * as serviceTaskBpmn from "./service_task.bpmn";
import * as externalTaskBpmn from "./changed_external.bpmn";
import * as externalWithErrorTaskBpmn from "./changed_external_error.bpmn";
import * as externalWithInjectionsTaskBpmn from "./changed_external_injections.bpmn";
import * as javaClassTaskBpmn from "./changed_java_class.bpmn";
import * as expressionTaskBpmn from "./changed_expression.bpmn";
import * as delegateExpressionTaskBpmn from "./changed_delegateexpression.bpmn";
import * as connectorTaskBpmn from "./changed_connector.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Service Task: service task added", () => {
    return loadDiff(serviceTaskBpmn.default, emptyBbpmn.default).then((data) =>
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
                        {
                            key: "id",
                            newValue: "Flow_0r55a8q",
                            oldValue: "",
                        },
                    ],
                },
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:ServiceTask",
                            oldValue: "",
                        },
                        { key: "id", newValue: "Activity_164nis1", oldValue: "" },
                    ],
                },
            ],
            changed: [],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Service Task -> External Task: changed to external task", () => {
    return loadDiff(externalTaskBpmn.default, serviceTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "camunda:type",
                            newValue: "external",
                            oldValue: "",
                        },
                        {
                            key: "camunda:topic",
                            newValue: "SomeTopic",
                            oldValue: "",
                        },
                        {
                            key: "camunda:taskPriority",
                            newValue: "SomePriority",
                            oldValue: "",
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("External Task -> External Task With Error: error added", () => {
    return loadDiff(externalWithErrorTaskBpmn.default, externalTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [
                {
                    id: "Error_1xhozfm",
                    name: "Error_00c6a4m",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Error",
                            oldValue: ""
                        },
                        {
                            key: "id",
                            newValue: "Error_1xhozfm",
                            oldValue: ""
                        },
                        {
                            key: "name",
                            newValue: "Error_00c6a4m",
                            oldValue: ""
                        },
                        {
                            key: "errorCode",
                            newValue: "ErrorCode",
                            oldValue: ""
                        },
                        {
                            key: "camunda:errorMessage",
                            newValue: "ErrorMessage",
                            oldValue: ""
                        },
                    ],
                }
            ],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "camunda:errorEventDefinition",
                            newValue: "{\"id\":\"ErrorEventDefinition_1blwolx\",\"errorRef\":\"Error_1xhozfm\",\"expression\":\"ThrowExpression\"}",
                            oldValue: undefined,
                            type: "camunda:errorEventDefinition",
                            subtype: undefined
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("External Task -> External Task With Injections: injections added", () => {
    return loadDiff(externalWithInjectionsTaskBpmn.default, externalTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "injection1",
                            newValue: "stringInjection",
                            oldValue: undefined,
                            subtype: "camunda:string",
                            type: "camunda:field"
                        },
                        {
                            key: "injection2",
                            newValue: "${expressionInjection}",
                            oldValue: undefined,
                            subtype: "camunda:expression",
                            type: "camunda:field"
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Service Task -> Java Class Task: changed to java class", () => {
    return loadDiff(javaClassTaskBpmn.default, serviceTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "camunda:class",
                            newValue: "SomeJavaClass",
                            oldValue: "",
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Service Task -> Expression Task: changed to expression", () => {
    return loadDiff(expressionTaskBpmn.default, serviceTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "camunda:expression",
                            newValue: "${SomeExpression}",
                            oldValue: "",
                        },
                        {
                            key: "camunda:resultVariable",
                            newValue: "SomeResultValue",
                            oldValue: "",
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Service Task -> Delegate Expression Task: changed to delegate expression", () => {
    return loadDiff(delegateExpressionTaskBpmn.default, serviceTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "camunda:delegateExpression",
                            newValue: "SomeDelegateExpression",
                            oldValue: "",
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Service Task -> Connector Task: changed to connector", () => {
    return loadDiff(connectorTaskBpmn.default, serviceTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "connectorInput",
                            newValue: "SomeConnectorInputValue",
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: "camunda:connector"
                        },
                        {
                            key: "listConnectorInput",
                            newValue: [ {
                                $children: [
                                    { $body: "value1", $type: "camunda:value" },
                                    { $body: "value2", $type: "camunda:value" },
                                ],
                                $type: "camunda:list"
                            }],
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: "camunda:connector"
                        },
                        {
                            key: "mapConnectorInput",
                            newValue: [ {
                                $children: [
                                    { key: "key1", $body: "value1", $type: "camunda:entry" },
                                    { key: "key2", $body: "value2", $type: "camunda:entry" },
                                ],
                                $type: "camunda:map"
                            }],
                            oldValue: undefined,
                            type: "camunda:inputParameter",
                            subtype: "camunda:connector"
                        },
                        {
                            key: "connectorOutput",
                            newValue: "SomeConnectorOutputValue",
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: "camunda:connector"
                        },
                        {
                            key: "listConnectorOutput",
                            newValue: [ {
                                $children: [
                                    { $body: "value1", $type: "camunda:value" },
                                    { $body: "value2", $type: "camunda:value" },
                                ],
                                $type: "camunda:list"
                            }],
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: "camunda:connector"
                        },
                        {
                            key: "mapConnectorOutput",
                            newValue: [ {
                                $children: [
                                    { key: "key1", $body: "value1", $type: "camunda:entry" },
                                    { key: "key2", $body: "value2", $type: "camunda:entry" },
                                ],
                                $type: "camunda:map"
                            }],
                            oldValue: undefined,
                            type: "camunda:outputParameter",
                            subtype: "camunda:connector"
                        },
                        {
                            key: "camunda:connectorId",
                            newValue: "SomeConnectorID",
                            oldValue: undefined,
                            type: "camunda:connectorId",
                            subtype: undefined
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});