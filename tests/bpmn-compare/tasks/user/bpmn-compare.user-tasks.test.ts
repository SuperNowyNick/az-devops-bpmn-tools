import bpmnCompare from "../../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./../empty.bpmn";
import * as userTaskBpmn from "./user_task.bpmn";
import * as userTaskCamundaFormBpmn from "./user_task_form_camunda.bpmn";
import * as userTaskExternalFormBpmn from "./user_task_form_external.bpmn";
import * as userTaskGeneratedFormBpmn from "./user_task_form_generated.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> User Task: user task added", () => {
    return loadDiff(userTaskBpmn.default, emptyBbpmn.default).then((data) =>
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
                        }
                    ],
                },
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:UserTask",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Activity_164nis1",
                            oldValue: "",
                        },
                        {
                            key: "camunda:assignee",
                            newValue: "SomeAssignee",
                            oldValue: "",
                        },
                        {
                            key: "camunda:candidateUsers",
                            newValue: "SomeCandidateUsers",
                            oldValue: "",
                        },
                        {
                            key: "camunda:candidateGroups",
                            newValue: "SomeCandidateGroups",
                            oldValue: "",
                        },
                        {
                            key: "camunda:dueDate",
                            newValue: "2024-05-17T04:20:00",
                            oldValue: "",
                        },
                        {
                            key: "camunda:followUpDate",
                            newValue: "2025-06-17T04:20:00",
                            oldValue: "",
                        },
                        {
                            key: "camunda:priority",
                            newValue: "SomePriority",
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

test("User Task -> Camunda Form: changed to Camunda form", () => {
    return loadDiff(userTaskCamundaFormBpmn.default, userTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "camunda:formRef",
                            newValue: "SomeFormReference",
                            oldValue: "",
                        },
                        {
                            key: "camunda:formRefBinding",
                            newValue: "version",
                            oldValue: "",
                        },
                        {
                            key: "camunda:formRefVersion",
                            newValue: "someVersion",
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

test("User Task -> External Form: changed to external form", () => {
    return loadDiff(userTaskExternalFormBpmn.default, userTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "camunda:formKey",
                            newValue: "someFormKey",
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

test("User Task -> Generated Form: changed to generated form", () => {
    return loadDiff(userTaskGeneratedFormBpmn.default, userTaskBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "someBooleanFieldID",
                            newValue: {
                                $children: [
                                    {
                                        $children: [
                                            {
                                                $type: "camunda:property",
                                                id: "SomeProperty1",
                                                value: "SomeProperty1Value"
                                            }
                                        ],
                                        $type: "camunda:properties"
                                    },
                                    {
                                        $children: [
                                            {
                                                $type: "camunda:constraint",
                                                config: "SomeConfig",
                                                name: "Constraint1"
                                            }
                                        ],
                                        $type: "camunda:validation",
                                    },
                                ],
                                $type: "camunda:formField",
                                defaultValue: "true",
                                id: "someBooleanFieldID",
                                label: "someBooleanFieldLabel",
                                type: "boolean"
                            },
                            oldValue: undefined,
                            subtype: "boolean",
                            type: "camunda:formField"
                        },
                        {
                            key: "someDateFieldID",
                            newValue: {
                                $children: [
                                    {
                                        $type: "camunda:properties",
                                    },
                                    {
                                        $type: "camunda:validation",
                                    },
                                ],
                                $type: "camunda:formField",
                                defaultValue: "someDefaultDate",
                                id: "someDateFieldID",
                                label: "someDateFieldLabel",
                                type: "date"
                            },
                            oldValue: undefined,
                            subtype: "date",
                            type: "camunda:formField"
                        },
                        {
                            key: "someEnumFieldID",
                            newValue: {
                                $children: [
                                    {
                                        $type: "camunda:value",
                                        id: "enumValue1",
                                        name: "enumValue1Name"
                                    },
                                    {
                                        $type: "camunda:value",
                                        id: "enumValue2",
                                        name: "enumValue2Name"
                                    },
                                ],
                                $type: "camunda:formField",
                                defaultValue: "defaultEnumValue",
                                id: "someEnumFieldID",
                                label: "someEnumFieldLabel",
                                type: "enum"
                            },
                            oldValue: undefined,
                            subtype: "enum",
                            type: "camunda:formField"
                        },
                        {
                            key: "someLongFieldID",
                            newValue: {
                                $type: "camunda:formField",
                                defaultValue: "defaultLongValue",
                                id: "someLongFieldID",
                                label: "someLongFieldLabel",
                                type: "long"
                            },
                            oldValue: undefined,
                            subtype: "long",
                            type: "camunda:formField"
                        },
                        {
                            key: "someStringFieldID",
                            newValue: {
                                $type: "camunda:formField",
                                defaultValue: "defaultStringValue",
                                id: "someStringFieldID",
                                label: "someStringFieldLabel",
                                type: "string"
                            },
                            oldValue: undefined,
                            subtype: "string",
                            type: "camunda:formField"
                        },
                        {
                            key: "someCustomFieldID",
                            newValue: {
                                $type: "camunda:formField",
                                defaultValue: "defaultCutomTypeValue",
                                id: "someCustomFieldID",
                                label: "someCustomFieldLabel",
                                type: "someCustomType"
                            },
                            oldValue: undefined,
                            subtype: "someCustomType",
                            type: "camunda:formField"
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

