import bpmnCompare from "../../../src/bpmn-compare/bpmn-compare";

import BpmnModdle from "bpmn-moddle";

import * as emptyBbpmn from "./empty.bpmn";
import * as changedTtlBpmn from "./changed_ttl.bpmn";
import * as changedVersionBpmn from "./changed_version.bpmn";

const loadDiff = async (bpmn1, bpmn2) => {
    const moddle = new BpmnModdle();
    const bpmn1Moddle = await moddle.fromXML(bpmn1);
    const bpmn2Moddle = await moddle.fromXML(bpmn2);
    return { bpmn1Moddle, bpmn2Moddle };
};

test("Empty -> Changed TTL: changed process TTL", () => {
    return loadDiff(changedTtlBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    id: "Process_0clpc7w",
                    name: undefined,
                    differences: [
                        {
                            key: "timeToLive",
                            newValue: "30",
                            oldValue: "180"
                        }
                    ]
                }
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});

test("Empty -> Changed version: changed process version", () => {
    return loadDiff(changedVersionBpmn.default, emptyBbpmn.default).then((data) =>
        expect(bpmnCompare(data.bpmn1Moddle, data.bpmn2Moddle)).toStrictEqual({
            added: [],
            changed: [
                {
                    id: "Process_0clpc7w",
                    name: undefined,
                    differences: [
                        {
                            key: "version",
                            newValue: "1.1.1",
                            oldValue: undefined
                        }
                    ]
                }
            ],
            layoutChanged: [],
            removed: [],
        })
    );
});