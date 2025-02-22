export enum enumForCriterion {
    rangeCriterion = "rangeCriterion",
    equalCriterion = "equalCriterion",
    priorityRangeCriterion = "priorityRangeCriterion",
    notInCriterion = "notInCriterion",
    inCriterion = "inCriterion",
    notEqualCriterion = "notEqualCriterion"
}

export class CriterionMatcher {
    constructor() { }

    async matchDetailsAndCriterion(criterion: any[],packetDetails: any[],isVirtual: number[] = []) {
        let j = 0;
        const matchResult = await Promise.all(
            criterion.map(async (criteria) => {
                let criterionTypes = Object.keys(criteria);
                let matchObj = { bool: null as boolean | null, isVirtual: null as number | null };
                for (let i = 0; i < criterionTypes.length; i++) {
                    const criterionKeys = Object.keys(criteria[criterionTypes[i]]);
                    let matchContinuityFlag = true;

                    for (let criteriaKey of criterionKeys) {

                        for (let detailsObject of packetDetails) {
                            if (
                                criterionTypes[i] === enumForCriterion.rangeCriterion &&
                                detailsObject.paramName.toLowerCase() === criteriaKey.toLowerCase()
                            ) {
                                const rangeCriterionNotSatisfied = await this.matchRangeCriterion(
                                    criteria[criterionTypes[i]],
                                    detailsObject,
                                    criteriaKey
                                );
                                if (rangeCriterionNotSatisfied) {
                                    matchContinuityFlag = false;
                                    break;
                                }
                            } else if (
                                criterionTypes[i] === enumForCriterion.equalCriterion &&
                                detailsObject.paramName.toLowerCase() === criteriaKey.toLowerCase()
                            ) {
                                const absCriterionNotSatisfied = await this.matchAbsCriterion(
                                    criteria[criterionTypes[i]],
                                    detailsObject,
                                    criteriaKey
                                );
                                if (absCriterionNotSatisfied) {
                                    matchContinuityFlag = false;
                                    break;
                                }
                            } else if (
                                criterionTypes[i] === enumForCriterion.notInCriterion &&
                                detailsObject.paramName.toLowerCase() === criteriaKey.toLowerCase()
                            ) {
                                const notInCriterionNotSatisfied = await this.matchNotInCriterion(
                                    criteria[criterionTypes[i]],
                                    detailsObject,
                                    criteriaKey
                                );
                                if (notInCriterionNotSatisfied) {
                                    matchContinuityFlag = false;
                                    break;
                                }
                            } else if (
                                criterionTypes[i] === enumForCriterion.inCriterion &&
                                detailsObject.paramName.toLowerCase() == criteriaKey.toLowerCase()
                            ) {
                                const inCriterionNotSatisfied = await this.matchInCriterion(
                                    criteria[criterionTypes[i]],
                                    detailsObject,
                                    criteriaKey
                                );
                                if (inCriterionNotSatisfied) {
                                    matchContinuityFlag = false;
                                } else {
                                    matchContinuityFlag = true;
                                    break;
                                }
                            } else if (
                                criterionTypes[i] === enumForCriterion.notEqualCriterion &&
                                detailsObject.paramName.toLowerCase() === criteriaKey.toLowerCase()
                            ) {
                                const notEqualCriterionNotSatisfied = await this.matchNotEqualCriterion(
                                    criteria[criterionTypes[i]],
                                    detailsObject,
                                    criteriaKey
                                );
                                if (notEqualCriterionNotSatisfied) {
                                    matchContinuityFlag = false;
                                    break;
                                }
                            }
                        }
                        if (matchContinuityFlag === false) break;
                    }

                    matchObj.bool = matchContinuityFlag;
                    if (matchContinuityFlag === false) break;
                }

                matchObj.isVirtual = isVirtual[j];
                j++;
                return matchObj;
            })
        );
        return matchResult;
    }

    async matchRangeCriterion(criterion : any, detailsObject : any, criteriaKey : any) {
        const paramValue = detailsObject.paramIValue || detailsObject.paramDValue || detailsObject.paramValue;
        const rangeObj = criterion[criteriaKey];
        const { upperLimit, lowerLimit } = rangeObj;
        if (!upperLimit && !lowerLimit) {
            return false;
        }
        if (paramValue < lowerLimit || paramValue > upperLimit) {
            return true;
        } else {
            return false;
        }
    }

    async matchAbsCriterion(absCriterion : any, detailsObject : any, criterionKey : any) {
        const paramValue = detailsObject.paramSValue || detailsObject.paramIValue || detailsObject.paramDValue || detailsObject.paramValue;

        if (typeof (paramValue) === 'string' && Number.isNaN(parseInt(paramValue))) {
            const criterionValue = absCriterion[criterionKey].paramValue.toLowerCase();
            if (paramValue.toLowerCase() === criterionValue) {
                return false;
            } else {
                return true;
            }
        } else {
            if (paramValue == absCriterion[criterionKey].paramValue) {
                return false;
            } else {
                return true;
            }
        }
    }

    
    async matchInCriterion(inCriterion : any, detailsObject : any, criterionKey : any) {
        const paramValue = detailsObject.paramIValue
            || detailsObject.paramDValue
            || detailsObject.paramSValue
            || detailsObject.paramBValue
            || detailsObject.paramValue;
        const criterionArr: any[] = inCriterion[criterionKey].values || inCriterion[criterionKey].value;
        if (!criterionArr.length) {
            return false;
        }
        for (let i = 0; i < criterionArr.length; i++) {
            
                if (typeof (paramValue) === "string" && Number.isNaN(parseInt(paramValue))) {
                    if (criterionArr[i].toLowerCase() === paramValue.toLowerCase()) {
                        return false;
                    }
                } else {
                    if (criterionArr[i] == paramValue) {
                        return false;
                    }
                }
            
        }
        return true;
    }

    async matchNotInCriterion(notInCriterion : any, detailsObject : any, criterionKey : any) {
        const paramValue = detailsObject.paramIValue
            || detailsObject.paramDValue
            || detailsObject.paramSValue
            || detailsObject.paramBValue
            || detailsObject.paramValue;
        const criterionArr = notInCriterion[criterionKey].values;
        for (let i = 0; i < criterionArr.length; i++) {
            if (typeof (paramValue) === 'string') {
                if (paramValue.toLowerCase() === criterionArr[i].toLowerCase()) {
                    return true;
                }
            } else {
                if (criterionArr[i] == paramValue) {
                    return true;
                }
            }
        }
        return false;
    }

    async matchNotEqualCriterion(notEqualCriterion : any, detailsObject : any, criterionKey : any) {
        const paramValue = detailsObject.paramSValue || detailsObject.paramIValue || detailsObject.paramDValue || detailsObject.paramValue;
        if (typeof (paramValue) === 'string') {
            const criterionValue = notEqualCriterion[criterionKey].paramValue;
            if (paramValue.toLowerCase() === criterionValue) {
                return true;
            } else {
                return false;
            }
        } else {
            if (paramValue == notEqualCriterion[criterionKey].paramValue) {
                return true;
            } else {
                return false;
            }
        }
    }
}
