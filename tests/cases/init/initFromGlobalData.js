import QUnit from "qunit";
import {initFromGlobalData} from "../../../init";

QUnit.module("init/initFromGlobalData()");

QUnit.test(
    "initial data",
    (assert) =>
    {
        assert.expect(1);
        window.TestKey = {data: {a: 5}, init: function (data) { this.data = data; }};

        let handler = {
            init(data)
            {
                assert.equal(5, data.a);
            }
        };

        initFromGlobalData("TestKey", handler);
    }
);


QUnit.test(
    "called after multiple times data",
    (assert) =>
    {
        // both steps + verify steps
        assert.expect(3);
        window.TestKey = {data: {a: "5"}, init: function (data) { this.data = data; }};

        let handler = {
            init(data)
            {
                assert.step(data.a);
            }
        };

        initFromGlobalData("TestKey", handler);
        window.TestKey.init({a: "7"});
        assert.verifySteps(["5", "7"]);
    }
);



QUnit.test(
    "multiple handlers",
    (assert) =>
    {
        // 2x both steps + verify steps
        assert.expect(5);
        window.TestKey = {data: {a: "5"}, init: function (data) { this.data = data; }};

        let firstHandler = {
            init(data)
            {
                assert.step(`first: ${data.a}`);
            }
        };

        let secondHandler = {
            init(data)
            {
                assert.step(`second: ${data.a}`);
            }
        };

        initFromGlobalData("TestKey", firstHandler);
        initFromGlobalData("TestKey", secondHandler);
        window.TestKey.init({a: "7"});
        assert.verifySteps(["first: 5", "second: 5", "first: 7", "second: 7"]);
    }
);

