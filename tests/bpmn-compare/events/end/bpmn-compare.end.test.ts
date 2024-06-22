import bpmnCompare from "../../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./../empty.bpmn";
import * as signalBpmn from "./signal.bpmn";
import * as errorBpmn from "./error.bpmn";
import * as messageBpmn from "./message.bpmn";
import * as messageExternalBpmn from "./message-external.bpmn";
import * as messageJavaClassBpmn from "./message-javaclass.bpmn";
import * as messageExpressionBpmn from "./message-expression.bpmn";
import * as messageDelegateExpressionBpmn from "./message-delegate-expression.bpmn";
import * as messageConnectorBpmn from "./message-connector.bpmn";
import * as terminateBpmn from "./terminate.bpmn";
import * as compensationBpmn from "./compensation.bpmn";
import * as escalationBpmn from "./escalation.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Signal End: end set to signal", () => {
    return loadDiff(signalBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "SignalEventDefinition_1p619hu",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:SignalEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "SignalEventDefinition_1p619hu",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Signal_3949uu4",
                    id: "Signal_3949uu4",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Signal",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Signal_3949uu4",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Signal_3949uu4",
                            oldValue: "",
                        }
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["SignalEventDefinition_1p619hu"],
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

test("Empty -> Error End: end set to error", () => {
    return loadDiff(errorBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "ErrorEventDefinition_0j4dhfy",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:ErrorEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "ErrorEventDefinition_0j4dhfy",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Error_2h7gqoj",
                    id: "Error_17g08ke",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Error",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Error_17g08ke",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Error_2h7gqoj",
                            oldValue: "",
                        },
                        {
                            key: "errorCode",
                            newValue: "someCode",
                            oldValue: "",
                        },
                        {
                            key: "camunda:errorMessage",
                            newValue: "someMessage",
                            oldValue: "",
                        }
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["ErrorEventDefinition_0j4dhfy"],
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

test("Empty -> Message End: end set to message", () => {
    return loadDiff(messageBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "MessageEventDefinition_1f6zbbu",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:MessageEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "MessageEventDefinition_1f6zbbu",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Message_301cpdm",
                    id: "Message_301cpdm",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Message",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Message_301cpdm",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Message_301cpdm",
                            oldValue: "",
                        }
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["MessageEventDefinition_1f6zbbu"],
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

test("Message End -> Message External End: end message set to external", () => {
    return loadDiff(messageExternalBpmn.default, messageBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_1f6zbbu",
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

test("Message End -> Message Java Class End: end message set to java class", () => {
    return loadDiff(messageJavaClassBpmn.default, messageBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_1f6zbbu",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:class",
                            newValue: "someClass",
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

test("Message End -> Message Expression End: end message set to expression", () => {
    return loadDiff(messageExpressionBpmn.default, messageBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_1f6zbbu",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:expression",
                            newValue: "someExpression",
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

test("Message End -> Message Delegate Expression End: end message set to delegate expression", () => {
    return loadDiff(messageDelegateExpressionBpmn.default, messageBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "MessageEventDefinition_1f6zbbu",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:delegateExpression",
                            newValue: "someExpression",
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

test("Message End -> Message Connector End: end message set to connector", () => {
    return loadDiff(messageConnectorBpmn.default, messageBpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["MessageEventDefinition_1f6zbbu"],
                            oldValue: ["MessageEventDefinition_1f6zbbu"]
                        },
                    ],
                },
                {
                    id: "MessageEventDefinition_1f6zbbu",
                    name: undefined,
                    differences: [
                        {
                            key: "camunda:connectorId",
                            newValue: "someConnector",
                            type: "camunda:connectorId"
                        },
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Terminate End: end set to terminate", () => {
    return loadDiff(terminateBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "TerminateEventDefinition_1cm2ga3",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:TerminateEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "TerminateEventDefinition_1cm2ga3",
                            oldValue: "",
                        }
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["TerminateEventDefinition_1cm2ga3"],
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

test("Empty -> Compensation End: end set to compensation", () => {
    return loadDiff(compensationBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "CompensateEventDefinition_1t5neti",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:CompensateEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "CompensateEventDefinition_1t5neti",
                            oldValue: "",
                        }
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["CompensateEventDefinition_1t5neti"],
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

test("Empty -> Escalation End: end set to escalation", () => {
    return loadDiff(escalationBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "EscalationEventDefinition_05orc6h",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:EscalationEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "EscalationEventDefinition_05orc6h",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Escalation_21lfj3v",
                    id: "Escalation_21lfj3v",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Escalation",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Escalation_21lfj3v",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Escalation_21lfj3v",
                            oldValue: "",
                        },
                        {
                            key: "escalationCode",
                            newValue: "someCode",
                            oldValue: "",
                        }
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_034t8qp",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["EscalationEventDefinition_05orc6h"],
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