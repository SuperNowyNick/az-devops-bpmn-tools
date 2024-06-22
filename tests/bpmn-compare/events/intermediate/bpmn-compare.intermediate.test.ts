import bpmnCompare from "../../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./../empty.bpmn";
import * as IntermediateBpmn from "./intermediate.bpmn";
import * as signalCatchBpmn from "./signal_catch.bpmn";
import * as signalThrowBpmn from "./signal_throw.bpmn";
import * as compensationBpmn from "./compensation.bpmn";
import * as conditionalBpmn from "./conditional.bpmn";
import * as conditionalScriptBpmn from "./conditional-script.bpmn";
import * as escalationBpmn from "./escalation.bpmn";
import * as linkCatchBpmn from "./link_catch.bpmn";
import * as linkThrowBpmn from "./link_throw.bpmn";
import * as messageCatchBpmn from "./message_catch.bpmn";
import * as messageThrowBpmn from "./message_throw.bpmn";
import * as messageThrowExternalBpmn from "./message_throw-external.bpmn";
import * as messageThrowJavaClassBpmn from "./message_throw-javaclass.bpmn";
import * as messageThrowExpressionBpmn from "./message_throw-expression.bpmn";
import * as messageThrowDelegateExpressionBpmn from "./message_throw-delegate-expression.bpmn";
import * as messageThrowConnectorBpmn from "./message_throw-connector.bpmn";
import * as timerBpmn from "./timer.bpmn";
import * as timerDateBpmn from "./timer-date.bpmn";
import * as timerDurationBpmn from "./timer-duration.bpmn";
import * as timerCycleBpmn from "./timer-cycle.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Intermediate: end event set to intermediate", () => {
    return loadDiff(IntermediateBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateThrowEvent",
                            oldValue: "bpmn:EndEvent",
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Intermediate Signal Catch: start event set to intermediate signal catch", () => {
    return loadDiff(signalCatchBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "SignalEventDefinition_1miuf7v",
                    differences: [
                        {
                            key: "signalRef",
                            newValue: "Signal_37v85j4",
                            oldValue: "",
                        },
                        {
                            key: "$type",
                            newValue: "bpmn:SignalEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "SignalEventDefinition_1miuf7v",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Signal_37v85j4",
                    id: "Signal_37v85j4",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Signal",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Signal_37v85j4",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Signal_37v85j4",
                            oldValue: "",
                        }
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateCatchEvent",
                            oldValue: "bpmn:StartEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["SignalEventDefinition_1miuf7v"],
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

test("Empty -> Intermediate Signal Throw: end event set to intermediate signal throw", () => {
    return loadDiff(signalThrowBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "SignalEventDefinition_16pevcy",
                    differences: [
                        {
                            key: "signalRef",
                            newValue: "Signal_3aqg1qn",
                            oldValue: "",
                        },
                        {
                            key: "$type",
                            newValue: "bpmn:SignalEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "SignalEventDefinition_16pevcy",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Signal_3aqg1qn",
                    id: "Signal_3aqg1qn",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Signal",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Signal_3aqg1qn",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Signal_3aqg1qn",
                            oldValue: "",
                        }
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateThrowEvent",
                            oldValue: "bpmn:EndEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["SignalEventDefinition_16pevcy"],
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

test("Empty -> Intermediate Compensation: end event set to intermediate compensation", () => {
    return loadDiff(compensationBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "CompensateEventDefinition_1dn9tir",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:CompensateEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "CompensateEventDefinition_1dn9tir",
                            oldValue: "",
                        },
                        {
                            key: "waitForCompletion",
                            newValue: false,
                            oldValue: "",
                        }
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateThrowEvent",
                            oldValue: "bpmn:EndEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["CompensateEventDefinition_1dn9tir"],
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

test("Empty -> Intermediate Conditional Catch: start event set to intermediate conditional catch", () => {
    return loadDiff(conditionalBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "ConditionalEventDefinition_10spwc8",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:ConditionalEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "ConditionalEventDefinition_10spwc8",
                            oldValue: "",
                        },
                        {
                            key: "condition",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "${someCondition}"
                            },
                            oldValue: "",
                        },
                        {
                            key: "camunda:variableName",
                            newValue: "someVariable",
                            oldValue: "",
                        },
                        {
                            key: "camunda:variableEvents",
                            newValue: "someEvents",
                            oldValue: "",
                        },
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateCatchEvent",
                            oldValue: "bpmn:StartEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["ConditionalEventDefinition_10spwc8"],
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

test("Intermediate Conditional Catch -> Intermediate Conditional Script Catch: changed intermediate conditional catch to script", () => {
    return loadDiff(conditionalScriptBpmn.default, conditionalBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["ConditionalEventDefinition_10spwc8"],
                            oldValue: ["ConditionalEventDefinition_10spwc8"]
                        }
                    ],
                },
                {
                    id: "ConditionalEventDefinition_10spwc8",
                    name: undefined,
                    differences: [
                        {
                            key: "condition",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "someFunction();",
                                language: "javascript",
                            },
                            oldValue: {
                                $type: "bpmn:FormalExpression",
                                body: "${someCondition}"
                            },
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Intermediate Escalation Throw: end event set to intermediate escalation throw", () => {
    return loadDiff(escalationBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "EscalationEventDefinition_1414tmo",
                    differences: [
                        {
                            key: "escalationRef",
                            newValue: "Escalation_193im8u",
                            oldValue: "",
                        },
                        {
                            key: "$type",
                            newValue: "bpmn:EscalationEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "EscalationEventDefinition_1414tmo",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Escalation_193im8u",
                    id: "Escalation_193im8u",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Escalation",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Escalation_193im8u",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Escalation_193im8u",
                            oldValue: "",
                        },
                        {
                            key: "escalationCode",
                            newValue: "someCode",
                            oldValue: "",
                        }
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateThrowEvent",
                            oldValue: "bpmn:EndEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["EscalationEventDefinition_1414tmo"],
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

test("Empty -> Intermediate Link Catch: start event set to intermediate link catch", () => {
    return loadDiff(linkCatchBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: "someLinkName",
                    id: "LinkEventDefinition_114rd5g",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:LinkEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "LinkEventDefinition_114rd5g",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "someLinkName",
                            oldValue: "",
                        },
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateCatchEvent",
                            oldValue: "bpmn:StartEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["LinkEventDefinition_114rd5g"],
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

test("Empty -> Intermediate Link Throw: end event set to intermediate link throw", () => {
    return loadDiff(linkThrowBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: "someLinkName",
                    id: "LinkEventDefinition_0lycmyj",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:LinkEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "LinkEventDefinition_0lycmyj",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "someLinkName",
                            oldValue: "",
                        },
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateThrowEvent",
                            oldValue: "bpmn:EndEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["LinkEventDefinition_0lycmyj"],
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

test("Empty -> Intermediate Message Catch: start event set to intermediate message catch", () => {
    return loadDiff(messageCatchBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "MessageEventDefinition_0yft8b5",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:MessageEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "MessageEventDefinition_0yft8b5",
                            oldValue: "",
                        },
                    ],
                },
                {
                    name: "Message_1rsimj7",
                    id: "Message_1rsimj7",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Message",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Message_1rsimj7",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Message_1rsimj7",
                            oldValue: "",
                        },
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateCatchEvent",
                            oldValue: "bpmn:StartEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["MessageEventDefinition_0yft8b5"],
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

test("Empty -> Intermediate Message Throw: end event set to intermediate message throw", () => {
    return loadDiff(messageThrowBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "MessageEventDefinition_0dzofdv",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:MessageEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "MessageEventDefinition_0dzofdv",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Message_14b0hja",
                    id: "Message_14b0hja",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Message",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Message_14b0hja",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Message_14b0hja",
                            oldValue: "",
                        },
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateThrowEvent",
                            oldValue: "bpmn:EndEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["MessageEventDefinition_0dzofdv"],
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

test("Intermediate Message Throw -> Intermediate Message External Throw: intermediate message throw changed to external", () => {
    return loadDiff(messageThrowExternalBpmn.default, messageThrowBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_0dzofdv",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:type",
                            newValue: "external",
                            oldValue: "",
                        },
                        {
                            key: "camunda:topic",
                            newValue: "someExternalTopic",
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

test("Intermediate Message Throw -> Intermediate Message Java Class Throw: intermediate message throw changed to java class", () => {
    return loadDiff(messageThrowJavaClassBpmn.default, messageThrowBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_0dzofdv",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:class",
                            newValue: "javaclass",
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

test("Intermediate Message Throw -> Intermediate Message Expression Throw: intermediate message throw changed to expression", () => {
    return loadDiff(messageThrowExpressionBpmn.default, messageThrowBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_0dzofdv",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:expression",
                            newValue: "${someExpression}",
                            oldValue: "",
                        },
                        {
                            key: "camunda:resultVariable",
                            newValue: "someVariable",
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

test("Intermediate Message Throw -> Intermediate Message Delegate Expression Throw: intermediate message throw changed to delegate expression", () => {
    return loadDiff(messageThrowDelegateExpressionBpmn.default, messageThrowBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_0dzofdv",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:delegateExpression",
                            newValue: "${someExpression}",
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

test("Intermediate Message Throw -> Intermediate Message Connector Throw: intermediate message throw changed to connector", () => {
    return loadDiff(messageThrowConnectorBpmn.default, messageThrowBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["MessageEventDefinition_0dzofdv"],
                            oldValue: ["MessageEventDefinition_0dzofdv"],
                        }
                    ],
                },
                {
                    id: "MessageEventDefinition_0dzofdv",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:connectorId",
                            newValue: "someConnectorID",
                            oldValue: undefined,
                            type: "camunda:connectorId"
                        }
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Intermediate Timer Catch: start event set to intermediate timer catch", () => {
    return loadDiff(timerBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "TimerEventDefinition_1iiyrzp",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:TimerEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "TimerEventDefinition_1iiyrzp",
                            oldValue: "",
                        },
                    ],
                }
            ],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:IntermediateCatchEvent",
                            oldValue: "bpmn:StartEvent",
                        },
                        {
                            key: "eventDefinitions",
                            newValue: ["TimerEventDefinition_1iiyrzp"],
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

test("Intermediate Timer Catch -> Intermediate Timer Date Catch: intermediate event timer catch changed to date", () => {
    return loadDiff(timerDateBpmn.default, timerBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["TimerEventDefinition_1iiyrzp"],
                            oldValue: ["TimerEventDefinition_1iiyrzp"],
                        }
                    ],
                },
                {
                    id: "TimerEventDefinition_1iiyrzp",
                    name: undefined,
                    differences: [
                        {
                            key: "timeDate",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "2011-09-11T12:00:00Z"
                            },
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

test("Intermediate Timer Catch -> Intermediate Timer Duration Catch: intermediate event timer catch changed to duration", () => {
    return loadDiff(timerDurationBpmn.default, timerBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["TimerEventDefinition_1iiyrzp"],
                            oldValue: ["TimerEventDefinition_1iiyrzp"],
                        }
                    ],
                },
                {
                    id: "TimerEventDefinition_1iiyrzp",
                    name: undefined,
                    differences: [
                        {
                            key: "timeDuration",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "PT15S"
                            },
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

test("Intermediate Timer Catch -> Intermediate Timer Cycle Catch: intermediate event timer catch changed to cycle", () => {
    return loadDiff(timerCycleBpmn.default, timerBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["TimerEventDefinition_1iiyrzp"],
                            oldValue: ["TimerEventDefinition_1iiyrzp"],
                        }
                    ],
                },
                {
                    id: "TimerEventDefinition_1iiyrzp",
                    name: undefined,
                    differences: [
                        {
                            key: "timeCycle",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "0 0 9-17 * * MON-FRI"
                            },
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