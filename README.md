# sequelize-common
A common set of models and functions that we use throughout most of our Sequelize projects

## Installation
```
npm i @teamhive/sequelize-common
```

## Peer Dependencies
There are a few peer dependencies of this project. Once you install this package you will need to follow up and ensure the follow dependencies are installed:

```
npm i sequelize sequelize-typescript
```

## Dev Dependencies
There are also dev dependencies that you may want to add in order for typescript to compile correctly:

```
npm i --save-dev @types/sequelize
```

## `updateOneToMany`/`updateManyToMany`
This function should be used when updating associations for a single parent object to either a join table or a 1-M association.  `updateOneToMany` takes in an array of existing associated records and deletes records that are no longer associated, updates those that already exist, and creates associations that did not exist.  The only difference with `updateManyToMany` is that is fetches the existing records from the join table instead of requiring that those existing records are passed in.

To determine what associations existed, there is a comparison function that compares old associations with the new children.  This should return the index of the existing association, or a negative number if the association did not exist.  There is also a fill function that takes the newChild to be created or updated and returns a record in the shape of the associated.

These functions take three generic types, `T`, the model of the associated table, `AuthenticatedUserType`, the type of authenticated user to pass into fill functions, and `NewChildrenType`, the type of the objects that are used to create or update the association.

### Use Cases

- Specific fields for each record
  - In the fill function, you can pull specific fields off of the `newChild` and map those to the result of each record
- Specific fields on a create
  - If you need to add specific fields only on a create, check if the fill function returns an `existingChild`.  If the existing child doesn't exist, you can add those create only fields.

#### Tips

##### To create a comparison function that compares a column on the join table to an associated record, a function similar to the following expression should suffice.

```typescript
(existingJoinTableRecords, associatedRecord) => 
    existingJoinTableRecords.findIndex(existingJoinTableRecord =>
        existingJoinTableRecord.loopRecordId === associatedRecord.id),
```

#### Options
```typescript
export interface UpdateOneToManyAssociationsOptions<
    T extends JoinTableEntity | CreatedByEntity<T>,
    AuthenticatedUserType extends AuthenticatedUser = AuthenticatedUser,
    NewChildrenType = any
    > {
    /**
     * The user updating the association
     */
    user: AuthenticatedUserType;
    /**
     * The sequelize model of the child table.
     */
    childTableModel: ModelCtor<T>;
    /**
     * The existing children
     */
    currentChildren: T[];
    /**
     * These records are compare with existing records to determine
     * if creates/updates/deletes are necessary and they are used to
     * fill the associated table records.
     */
    newChildren: NewChildrenType[];
    /**
     * This function will compare a new child with the set of existing records
     * that have not been matched. It should return the index of the existing record
     * if there is a match. If there is no match, a negative number should be returned.
     */
    comparisonFunction: (existingRecords: T[], newChild: NewChildrenType) => number;
    /**
     * This function will be called to create the values that will be written to the
     * child table.
     * @param newChild The child to create/update
     * @param index Index of newChild in the newChildren array (use this for sort order)
     * @param existingRecord If there was a match, the existing record will be included
     */
    fillFunction: (user: AuthenticatedUserType, newChild: NewChildrenType, index: number, existingRecord?: T) => AttributesOf<T>;
    /**
     * The transaction to run the update in
     */
    transaction?: Transaction;
}
```

#### Example

```typescript
const records = await updateOneToManyAssociations<TaskQuestion, AuthenticatedUser, ContentTaskQuestionDto>({
    childTableModel: TaskQuestion,
    user,
    transaction,
    // ensure that the identity of the existing question matches the dto
    comparisonFunction: (existingQuestions, newQuestion) => existingQuestions.findIndex(question =>
        question.identity === newQuestion.identity),
    currentChildren: options.existingQuestions,
    newChildren: contentTaskQuestionDtos,
    fillFunction: (authenticatedUser, taskQuestion, index) => {
        const newAssignmentTaskQuestion: AttributesOf<TaskQuestion> = {
            loopTaskRevisionId: taskRevision.id,
            title: taskQuestion.title,
            sortOrder: index,
            questionType: taskQuestion.questionType,
            updatedById: authenticatedUser.id,
            tenantId: authenticatedUser.tenantId
        };
        if (taskQuestion.identity) {
            newAssignmentTaskQuestion.identity = taskQuestion.identity;
        } else {
            newAssignmentTaskQuestion.createdById = authenticatedUser.id;
        }
        return newAssignmentTaskQuestion;
    }
});
```


### Distribution
```
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_