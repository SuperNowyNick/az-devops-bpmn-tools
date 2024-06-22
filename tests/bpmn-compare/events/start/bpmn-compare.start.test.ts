import bpmnCompare from "../../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./../empty.bpmn";
import * as conditionalBpmn from "./conditional.bpmn";
import * as conditionalScriptBpmn from "./conditional-script.bpmn";
import * as signalBpmn from "./signal.bpmn";
import * as timerBpmn from "./timer.bpmn";
import * as timerDateBpmn from "./timer-date.bpmn";
import * as timerDurationBpmn from "./timer-duration.bpmn";
import * as timerCycleBpmn from "./timer-cycle.bpmn";
import * as messageBpmn from "./message.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Conditional Start: start set to conditional", () => {
    return loadDiff(conditionalBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "ConditionalEventDefinition_11k0g2m",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:ConditionalEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "ConditionalEventDefinition_11k0g2m",
                            oldValue: "",
                        },
                        {
                            key: "condition",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "${someExpression}",
                            },
                            oldValue: "",
                        },
                        {
                            key: "camunda:variableName",
                            newValue: "someVariable",
                            oldValue: "",
                        },
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["ConditionalEventDefinition_11k0g2m"],
                            oldValue: "",
                        },
                        {
                            key: "camunda:initiator",
                            newValue: "someInitiator",
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

test("Conditional start -> Conditional start with script: start changed to conditional script", () => {
    return loadDiff(
        conditionalScriptBpmn.default,
        conditionalBpmn.default
    ).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["ConditionalEventDefinition_11k0g2m"],
                            oldValue: ["ConditionalEventDefinition_11k0g2m"],
                        },
                    ],
                },
                {
                    id: "ConditionalEventDefinition_11k0g2m",
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
                                body: "${someExpression}",
                            },
                        },
                    ],
                },
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Signal Start: start set to signal", () => {
    return loadDiff(signalBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "SignalEventDefinition_1hsrpyu",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:SignalEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "SignalEventDefinition_1hsrpyu",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Signal_35jg4dq",
                    id: "Signal_35jg4dq",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Signal",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Signal_35jg4dq",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Signal_35jg4dq",
                            oldValue: "",
                        }
                    ],
                },
            ],
            changed: [
                {
                    id: "Event_1tje9bn",
                    name: undefined,
                    differences: [
                        {
                            key: "eventDefinitions",
                            newValue: ["SignalEventDefinition_1hsrpyu"],
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

test("Empty -> Timer Start: start set to timer", () => {
    return loadDiff(timerBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "TimerEventDefinition_17v7s7p",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:TimerEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "TimerEventDefinition_17v7s7p",
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
                            key: "eventDefinitions",
                            newValue: ["TimerEventDefinition_17v7s7p"],
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

test("Timer Start -> Timer Date Start: start set to date timer", () => {
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
                            newValue: ["TimerEventDefinition_17v7s7p"],
                            oldValue: ["TimerEventDefinition_17v7s7p"],
                        }
                    ],
                },
                {
                    id: "TimerEventDefinition_17v7s7p",
                    name: undefined,
                    differences: [
                        {
                            key: "timeDate",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "2019-10-01T12:00:00Z"
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

test("Timer Start -> Timer Duration Start: start set to duration timer", () => {
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
                            newValue: ["TimerEventDefinition_17v7s7p"],
                            oldValue: ["TimerEventDefinition_17v7s7p"],
                        }
                    ],
                },
                {
                    id: "TimerEventDefinition_17v7s7p",
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

test("Timer Start -> Timer Cycle Start: start set to cycle timer", () => {
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
                            newValue: ["TimerEventDefinition_17v7s7p"],
                            oldValue: ["TimerEventDefinition_17v7s7p"],
                        }
                    ],
                },
                {
                    id: "TimerEventDefinition_17v7s7p",
                    name: undefined,
                    differences: [
                        {
                            key: "timeCycle",
                            newValue: {
                                $type: "bpmn:FormalExpression",
                                body: "R/P1D"
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

test("Empty -> Message Start: start set to message", () => {
    return loadDiff(messageBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "MessageEventDefinition_055dud7",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:MessageEventDefinition",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "MessageEventDefinition_055dud7",
                            oldValue: "",
                        }
                    ],
                },
                {
                    name: "Message_3m3ekk9",
                    id: "Message_3m3ekk9",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Message",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Message_3m3ekk9",
                            oldValue: "",
                        },
                        {
                            key: "name",
                            newValue: "Message_3m3ekk9",
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
                            key: "eventDefinitions",
                            newValue: ["MessageEventDefinition_055dud7"],
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