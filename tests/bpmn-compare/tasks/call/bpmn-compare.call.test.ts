import bpmnCompare from "../../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./../empty.bpmn";
import * as callBpmnTaskBpmn from "./call_bpmn.bpmn";
import * as callCmmnTaskBpmn from "./call_cmmn.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Call BPMN Task: call BPMN task added", () => {
    return loadDiff(callBpmnTaskBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:CallActivity",
                            oldValue: "",
                        },
                        { 
                            key: "id", 
                            newValue: "Activity_164nis1", 
                            oldValue: "" },
                        {
                            key: "calledElement",
                            newValue: "SomeCalledElement",
                            oldValue: "",
                        },
                        {
                            key: "camunda:in",
                            newValue: "{\"businessKey\":\"#{execution.processBusinessKey}\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:in (1)",
                            newValue: "{\"local\":\"true\",\"variables\":\"all\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:in (2)",
                            newValue: "{\"source\":\"inMappingSource\",\"target\":\"targetMapping\",\"local\":\"true\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:in (3)",
                            newValue: "{\"sourceExpression\":\"inMappingExpression\",\"target\":\"targetMappingExpression\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:out",
                            newValue: "{\"local\":\"true\",\"variables\":\"all\"}",
                            oldValue: undefined,
                            type: "camunda:out",
                            subtype: undefined
                        },
                        {
                            key: "camunda:out (1)",
                            newValue: "{\"source\":\"outMappingSource\",\"target\":\"targetMappingSource\",\"local\":\"true\"}",
                            oldValue: undefined,
                            type: "camunda:out",
                            subtype: undefined
                        },
                        {
                            key: "camunda:out (2)",
                            newValue: "{\"sourceExpression\":\"outMappingExpression\",\"target\":\"targetMappingExpression\"}",
                            oldValue: undefined,
                            type: "camunda:out",
                            subtype: undefined
                        },
                        {
                            key: "camunda:calledElementTenantId",
                            newValue: "SomeTenantID",
                            oldValue: "",
                        },
                        {
                            key: "camunda:variableMappingClass",
                            newValue: "SomeDelegateClass",
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
                        {
                            key: "id",
                            newValue: "Flow_0r55a8q",
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

test("Empty -> Call CMMN Task: call CMMN task added", () => {
    return loadDiff(callCmmnTaskBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [
                {
                    name: undefined,
                    id: "Activity_164nis1",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:CallActivity",
                            oldValue: "",
                        },
                        { 
                            key: "id", 
                            newValue: "Activity_164nis1", 
                            oldValue: "" 
                        },
                        {
                            key: "camunda:in",
                            newValue: "{\"businessKey\":\"#{execution.processBusinessKey}\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:in (1)",
                            newValue: "{\"local\":\"true\",\"variables\":\"all\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:in (2)",
                            newValue: "{\"source\":\"inMappingSource\",\"target\":\"targetMapping\",\"local\":\"true\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:in (3)",
                            newValue: "{\"sourceExpression\":\"inMappingExpression\",\"target\":\"targetMappingExpression\"}",
                            oldValue: undefined,
                            type: "camunda:in",
                            subtype: undefined
                        },
                        {
                            key: "camunda:out",
                            newValue: "{\"local\":\"true\",\"variables\":\"all\"}",
                            oldValue: undefined,
                            type: "camunda:out",
                            subtype: undefined
                        },
                        {
                            key: "camunda:out (1)",
                            newValue: "{\"source\":\"outMappingSource\",\"target\":\"targetMappingSource\",\"local\":\"true\"}",
                            oldValue: undefined,
                            type: "camunda:out",
                            subtype: undefined
                        },
                        {
                            key: "camunda:out (2)",
                            newValue: "{\"sourceExpression\":\"outMappingExpression\",\"target\":\"targetMappingExpression\"}",
                            oldValue: undefined,
                            type: "camunda:out",
                            subtype: undefined
                        },
                        {
                            key: "camunda:caseRef",
                            newValue: "SomeCaseRef",
                            oldValue: "",
                        },
                        {
                            key: "camunda:caseTenantId",
                            newValue: "SomeTenantID",
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
                        {
                            key: "id",
                            newValue: "Flow_0r55a8q",
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