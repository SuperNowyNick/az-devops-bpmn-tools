import bpmnCompare from "../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as initBpmn from "./init.bpmn";
import * as exclusiveGatewayBpmn from "./exclusive_gateway.bpmn";
import * as changeConditionExpressionBpmn from "./change_condition_expression.bpmn";
import * as changeDefaultBpmn from "./change_default.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Init -> Exclusive gateway: exclusive gateway added", () => {
    return loadDiff(exclusiveGatewayBpmn.default, initBpmn.default).then(
        (data) =>
            expect(
                bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)
            ).toStrictEqual({
                added: [
                    {
                        differences: [
                            {
                                key: "default",
                                newValue: "Flow_0w5oqcf",
                                oldValue: "",
                            },
                            {
                                key: "$type",
                                newValue: "bpmn:ExclusiveGateway",
                                oldValue: "",
                            },
                            {
                                key: "id",
                                newValue: "Gateway_1k1wrjt",
                                oldValue: "",
                            },
                        ],
                        id: "Gateway_1k1wrjt",
                        name: undefined,
                    },
                    {
                        differences: [
                            {
                                key: "$type",
                                newValue: "bpmn:SequenceFlow",
                                oldValue: "",
                            },
                            {
                                key: "id",
                                newValue: "Flow_07tw8ab",
                                oldValue: "",
                            },
                            {
                                key: "language",
                                newValue: "javascript",
                                oldValue: ""
                            },
                            {
                                key: "conditionExpression",
                                newValue: 'test == "true"',
                                oldValue: "",
                            },
                        ],
                        id: "Flow_07tw8ab",
                        name: undefined,
                    },
                    {
                        differences: [
                            {
                                key: "$type",
                                newValue: "bpmn:SequenceFlow",
                                oldValue: "",
                            },
                            {
                                key: "id",
                                newValue: "Flow_0w5oqcf",
                                oldValue: "",
                            },
                        ],
                        id: "Flow_0w5oqcf",
                        name: undefined,
                    },
                ],
                changed: [],
                layoutChanged: [],
                removed: [],
            })
    );
});

test("Exclusive gateway -> Change Condition Expression: condition changed from javascript to expression", () => {
    return loadDiff(changeConditionExpressionBpmn.default, exclusiveGatewayBpmn.default).then(
        (data) =>
            expect(
                bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)
            ).toStrictEqual({
                added: [],
                changed: [
                    {
                        id: "Flow_07tw8ab",
                        name: undefined,
                        differences: [
                            {
                                key: "language",
                                newValue: undefined,
                                oldValue: "javascript"
                            },
                            {
                                key: "conditionExpression",
                                newValue: "${newExpression}",
                                oldValue: "test == \"true\""
                            }
                        ]
                    }
                ],
                layoutChanged: [],
                removed: [],
            })
    );
});

test("Exclusive gateway -> Change Default: default flow changed", () => {
    return loadDiff(changeDefaultBpmn.default, exclusiveGatewayBpmn.default).then(
        (data) =>
            expect(
                bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)
            ).toStrictEqual({
                added: [],
                changed: [
                    {
                        id: "Gateway_1k1wrjt",
                        name: undefined,
                        differences: [
                            {
                                key: "default",
                                newValue: "Flow_07tw8ab",
                                oldValue: "Flow_0w5oqcf"
                            }
                        ]
                    },
                    {
                        id: "Flow_07tw8ab",
                        name: undefined,
                        differences: [
                            {
                                key: "language",
                                newValue: "",
                                oldValue: "javascript"
                            },
                            {
                                key: "conditionExpression",
                                newValue: "",
                                oldValue: "test == \"true\""
                            }
                        ]
                    }
                ],
                layoutChanged: [],
                removed: [],
            })
    );
});
