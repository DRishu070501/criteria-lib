# CriterionMatcher

## Overview
`CriterionMatcher` is a TypeScript class designed to match a set of criteria against packet details. It supports multiple types of criteria, including range checks, equality checks, inclusion/exclusion checks, and priority-based comparisons.

## Features
- Supports different types of criteria:
  - **Range Criterion**: Checks if a value falls within a specified range.
  - **Equal Criterion**: Compares values for strict equality.
  - **Priority Range Criterion**: Uses priority-based limits.
  - **In Criterion**: Ensures a value exists within a predefined set.
  - **Not In Criterion**: Ensures a value does not exist within a predefined set.
  - **Not Equal Criterion**: Ensures a value is different from a specified one.
- Handles various data types (`string`, `number`, `boolean`).
- Implements asynchronous matching logic.

## Installation
To use `CriterionMatcher`, ensure you have TypeScript installed:
```sh
npm install typescript
```

## Usage
### Import and Initialize
```typescript
import { CriterionMatcher, enumForCriterion } from './CriterionMatcher';

const matcher = new CriterionMatcher();
```

### Example Usage
```typescript
const criteria = [
  {
    rangeCriterion: {
      weight: { lowerLimit: 1.0, upperLimit: 2.5 }
    }
  },
  {
    equalCriterion: {
      color: { paramValue: "D" }
    }
  }
];

const packetDetails = [
  { paramName: "weight", paramValue: 1.5 },
  { paramName: "color", paramValue: "D" }
];


async function checkMatch() {
  const result = await matcher.matchDetailsAndCriterion(criteria, packetDetails);
  console.log(result);
}

checkMatch();
```

## Methods
### `matchDetailsAndCriterion(criterion: any[], packetDetails: any[], isVirtual: number[])`
- **Description**: Matches a list of criteria against packet details.
- **Returns**: `Promise<{ bool: boolean | null; isVirtual: number | null; }[]>`

### `matchRangeCriterion(criterion, detailsObject, criteriaKey)`
- **Description**: Checks if a value falls within a specified range.
- **Returns**: `Promise<boolean>`

### `matchAbsCriterion(absCriterion, detailsObject, criterionKey)`
- **Description**: Checks if a value is equal to the specified criterion.
- **Returns**: `Promise<boolean>`

### `matchPriorityRangeCriterion(priorityCriterion, detailsObject, criterionKey)`
- **Description**: Checks a priority-based range criterion.
- **Returns**: `Promise<boolean>`

### `matchInCriterion(inCriterion, detailsObject, criterionKey)`
- **Description**: Checks if a value exists within a predefined set.
- **Returns**: `Promise<boolean>`

### `matchNotInCriterion(notInCriterion, detailsObject, criterionKey)`
- **Description**: Ensures a value is not within a predefined set.
- **Returns**: `Promise<boolean>`

### `matchNotEqualCriterion(notEqualCriterion, detailsObject, criterionKey)`
- **Description**: Ensures a value is different from a specified one.
- **Returns**: `Promise<boolean>`

## License
This project is licensed under the MIT License.

