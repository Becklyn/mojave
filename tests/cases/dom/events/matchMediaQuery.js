import {matchMediaQuery} from "../../../../dom/events";
import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";

const matchQueryList = [];
const realMatchMedia = window.matchMedia;

QUnit.module("dom/events/matchMediaQuery()", {
    beforeEach: () => {
        findOne("#qunit-fixture").innerHTML = `
            <div class="example"></div>
        `;
    },
    afterEach: () => {
        matchQueryList.forEach((callback, index) => {
            callback();

            matchQueryList.splice(index, 1);
        });
    }
});


QUnit.test(
    "matchMediaQuery() on window media query matches without immediate execution",
    (assert) =>
    {
        assert.expect(0);

        const callback = () => {
            assert.ok(false, "Media query matches, but should not.");
        };

        matchQueryList.push(matchMediaQuery(`(min-width: 0px)`, callback, false));
    }
);


QUnit.test(
    "matchMediaQuery() on window media query matches with immediate execution",
    (assert) =>
    {
        const done = assert.async(1);

        assert.expect(1);

        const callback = (matches) => {
            assert.ok(matches, "Media query matches.");
            done();
        };

        matchQueryList.push(matchMediaQuery(`(min-width: 0px)`, callback));
    }
);


QUnit.test(
    "matchMediaQuery() on window media query doesn't match without immediate execution",
    (assert) =>
    {
        assert.expect(0);

        const callback = (matches) => {
            assert.notOk(matches, "Media query does not match.");
        };

        matchQueryList.push(matchMediaQuery(`(min-width: ${window.innerWidth + 1}px)`, callback, false));
    }
);


QUnit.test(
    "matchMediaQuery() on window media query doesn't match with immediate execution",
    (assert) =>
    {
        const done = assert.async(1);

        assert.expect(1);

        const callback = (matches) => {
            assert.notOk(matches, "Media query does not match.");
            done();
        };

        matchQueryList.push(matchMediaQuery(`(min-width: ${window.innerWidth + 1}px)`, callback));
    }
);


QUnit.test(
    "matchMediaQuery() window.matchMedia was called correctly",
    (assert) =>
    {
        assert.expect(1);

        window.matchMedia = (query) => {
            assert.strictEqual(query, "screen and (min-width: 400px)");

            return {
                matches: true,
                addListener: () => {},
            };
        };

        matchMediaQuery("screen and (min-width: 400px)", () => {});

        window.matchMedia = realMatchMedia;
    }
);


QUnit.test(
    "matchMediaQuery() listener was called immediately and correctly",
    (assert) =>
    {
        assert.expect(1);

        window.matchMedia = () => {
            return {
                matches: true,
                addListener: () => {},
            };
        };

        matchMediaQuery("screen and (min-width: 400px)", (matches) => {
            assert.ok(matches, "The listener was called with a matching query.");
        });

        window.matchMedia = realMatchMedia;
    }
);


QUnit.test(
    "matchMediaQuery() addListener was called immediately and correctly",
    (assert) =>
    {
        assert.expect(1);

        window.matchMedia = () => {
            return {
                matches: true,
                addListener: (eventHandler) => {
                    eventHandler({matches: true});
                },
            };
        };

        matchMediaQuery("screen and (min-width: 400px)", (matches) => {
            assert.ok(matches, "The listener was called with a matching query.");
        }, false);

        window.matchMedia = realMatchMedia;
    }
);


QUnit.test(
    "matchMediaQuery() addEventListener was called immediately and correctly",
    (assert) =>
    {
        assert.expect(2);

        window.matchMedia = () => {
            return {
                matches: true,
                addEventListener: (eventType, eventHandler) => {
                    assert.strictEqual(eventType, "change");
                    eventHandler({matches: true});
                },
            };
        };

        matchMediaQuery("screen and (min-width: 400px)", (matches) => {
            assert.ok(matches, "The listener was called with a matching query.");
        }, false);

        window.matchMedia = realMatchMedia;
    }
);
