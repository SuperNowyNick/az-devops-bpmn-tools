import bpmnCompare from "../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./empty.bpmn";
import * as collaborationBpmn from "./collaboration.bpmn";
import * as collaborationEmptyBpmn from "./collaboration_empty.bpmn";
import * as collaborationAddLaneBpmn from "./collaboration_add_lane.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Collaboration: collaboration added", () => {
    return loadDiff(collaborationBpmn.default, emptyBbpmn.default).then(
        (data) =>
            expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
                added: [
                    {
                        name: undefined,
                        id: "Collaboration_1i62cgp",
                        differences: [
                            {
                                key: "$type",
                                newValue: "bpmn:Collaboration",
                                oldValue: "",
                            },
                            {
                                key: "id",
                                newValue: "Collaboration_1i62cgp",
                                oldValue: "",
                            },
                            {
                                key: "participants",
                                newValue: [
                                    {
                                        $type: "bpmn:Participant",
                                        id: "Participant_1fi10g4",
                                    },
                                ],
                                oldValue: "",
                            },
                        ],
                    },
                    {
                        name: undefined,
                        id: "Participant_1fi10g4",
                        differences: [
                            {
                                key: "processRef",
                                newValue: "Process_0clpc7w",
                                oldValue: "",
                            },
                            {
                                key: "$type",
                                newValue: "bpmn:Participant",
                                oldValue: "",
                            },
                            {
                                key: "id",
                                newValue: "Participant_1fi10g4",
                                oldValue: "",
                            }
                        ],
                    },
                ],
                changed: [],
                layoutChanged: [],
                removed: [],
            })
    );
});

test("Collaboration -> Add Lane: collaboration lane added", () => {
    return loadDiff(
        collaborationAddLaneBpmn.default,
        collaborationBpmn.default
    ).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [
                {
                    name: undefined,
                    id: "LaneSet_103d2ga",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:LaneSet",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "LaneSet_103d2ga",
                            oldValue: "",
                        },
                        {
                            key: "lanes",
                            newValue: [
                                {
                                    $type: "bpmn:Lane",
                                    id: "Lane_127z9db",
                                },
                                {
                                    $type: "bpmn:Lane",
                                    id: "Lane_0ggdu8y",
                                },
                            ],
                            oldValue: "",
                        },
                    ],
                },
                {
                    name: undefined,
                    id: "Lane_127z9db",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Lane",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Lane_127z9db",
                            oldValue: "",
                        },
                    ],
                },
                {
                    name: undefined,
                    id: "Lane_0ggdu8y",
                    differences: [
                        {
                            key: "$type",
                            newValue: "bpmn:Lane",
                            oldValue: "",
                        },
                        {
                            key: "id",
                            newValue: "Lane_0ggdu8y",
                            oldValue: "",
                        },
                    ],
                },
            ],
            changed: [
                {
                    id: "Process_0clpc7w",
                    name: undefined,
                    differences: [
                        {
                            key: "laneSets",
                            newValue: [
                                {
                                    $type: "bpmn:LaneSet",
                                    id: "LaneSet_103d2ga",
                                    lanes: [
                                        {
                                            $type: "bpmn:Lane",
                                            id: "Lane_127z9db",
                                        },
                                        {
                                            $type: "bpmn:Lane",
                                            id: "Lane_0ggdu8y",
                                        },
                                    ],
                                },
                            ],
                            oldValue: "",
                        },
                    ],
                },
            ],
            layoutChanged: [
                {
                    id: "Participant_1fi10g4",
                },
            ],
            removed: [],
        })
    );
});

test("Collaboration -> Empty Collaboration: collaboration lanes removed", () => {
    return loadDiff(
        collaborationEmptyBpmn.default,
        collaborationBpmn.default
    ).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toEqual({
            added: [],
            changed: [
                {
                    id: "Participant_1fi10g4",
                    name: undefined,
                    differences: [
                        {
                            key: "processRef",
                            newValue: undefined,
                            oldValue: "Process_0clpc7w"
                        }
                    ]
                }],
            layoutChanged: [],
            removed: [
                {
                    id: "Process_0clpc7w",
                    name: undefined,
                    differences: [
                        {
                            key: "$type",
                            newValue: "",
                            oldValue: "bpmn:Process"
                        },
                        {
                            key: "id",
                            newValue: "",
                            oldValue: "Process_0clpc7w"
                        },
                        {
                            key: "isExecutable",
                            newValue: "",
                            oldValue: true
                        },
                        {
                            key: "camunda:historyTimeToLive",
                            newValue: "",
                            oldValue: "180"
                        }
                    ]
                }
            ],
        })
    );
});
