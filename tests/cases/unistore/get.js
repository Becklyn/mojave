import QUnit from "qunit";
import {get} from "../../../unistore";


QUnit.module("unistore/get");


QUnit.test(
    "several test cases",
    (assert) =>
    {
        const data = {
            firstName: "John",
            lastName: "Smith",
            age: 25,
            address: {
                streetAddress: "21 2nd Street",
                city: "New York",
                state: "NY",
                postalCode: "10021",
            },
            phoneNumber: [
                {
                    type: "home",
                    number: "212 555-1234",
                },
                {
                    type: "fax",
                    number: "646 555-4567",
                },
            ],
            gender: {
                type: "male",
            },
        };

        const cases = [
            {
                // multiple items
                accessor: get`firstName,lastName`,
                expected: {
                    firstName: "John",
                    lastName: "Smith",
                },
            },
            {
                // missing key
                accessor: get`missing`,
                expected: {
                    missing: null,
                },
            },
            {
                // nested selector
                accessor: get`address.city`,
                expected: {
                    city: "New York",
                },
            },
            {
                // aliasing
                accessor: get`first_name:firstName`,
                expected: {
                    //eslint-disable-next-line
                    first_name: "John",
                },
            },
            {
                // invalid nested selector
                accessor: get`age.missing`,
                expected: {
                    missing: null,
                },
            },
            {
                // last access wins
                accessor: get`name:firstName,name:lastName`,
                expected: {
                    name: "Smith",
                },
            },
            {
                // multiple matches
                accessor: get`address.city,age`,
                expected: {
                    city: "New York",
                    age: 25,
                },
            },
            {
                // renamed
                accessor: get`prop1:address.city,prop2:age`,
                expected: {
                    prop1: "New York",
                    prop2: 25,
                },
            },
            {
                // spaces don't matter (aliased)
                accessor: get`prop1   :    address   .   city  ,   prop2  :   age`,
                expected: {
                    prop1: "New York",
                    prop2: 25,
                },
            },
            {
                // spaces don't matter
                accessor: get`    address   .   city  ,      age`,
                expected: {
                    city: "New York",
                    age: 25,
                },
            },
            {
                // Array access is supported, too
                accessor: get`phoneNumber.1.type`,
                expected: {
                    type: "fax",
                },
            },
            {
                // call as regular function
                accessor: get("firstName,lastName"),
                expected: {
                    firstName: "John",
                    lastName: "Smith",
                },
            },
            {
                // non-scalar return type
                accessor: get("gender"),
                expected: {
                    gender: {
                        type: "male",
                    },
                },
            },
            {
                // automatic array keys
                accessor: get("phoneNumber.1"),
                expected: {
                    1: {
                        type: "fax",
                        number: "646 555-4567",
                    },
                },
            },
        ];

        cases.forEach((testCase, index) => {
            const accessor = testCase.accessor;
            const actual = accessor(data);

            assert.deepEqual(actual, testCase.expected, `TestCase #${index}`);
        });
    }
);
