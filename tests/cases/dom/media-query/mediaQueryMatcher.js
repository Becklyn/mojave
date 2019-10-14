import {mediaQueryMatcher} from "../../../../dom/media-query";
import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";

const realMatchMedia = window.matchMedia;

QUnit.module("dom/events/mediaQueryMatcher()", {
    beforeEach: () => {
        findOne("#qunit-fixture").innerHTML = `
            <div class="example"></div>
        `;
    },
    afterEach: () => {
        window.matchMedia = realMatchMedia;
    }
});





QUnit.test(
    "mediaQueryMatcher() window.matchMedia was called correctly – legacy",
    (assert) =>
    {
        assert.expect(3);

        window.matchMedia = (query) => {
            assert.strictEqual(query, "screen and (min-width: 400px)");

            return {
                matches: true,
                addListener: () => {
                    assert.ok(true, "registered");
                },
                removeListener: () => {
                    assert.ok(true, "unregistered");
                }
            };
        };

        let matcher = mediaQueryMatcher("screen and (min-width: 400px)");
        matcher.destroy();
    }
);


QUnit.test(
    "mediaQueryMatcher() window.matchMedia was called correctly – modern",
    (assert) =>
    {
        assert.expect(3);

        window.matchMedia = (query) => {
            assert.strictEqual(query, "screen and (min-width: 400px)");

            return {
                matches: true,
                addEventListener: (event) => {
                    assert.strictEqual(event, "change", "registered");
                },
                removeEventListener: (event) => {
                    assert.strictEqual(event, "change", "unregistered");
                },
            };
        };

        let matcher = mediaQueryMatcher("screen and (min-width: 400px)");
        matcher.destroy();
    }
);


QUnit.test(
    "mediaQueryMatcher() window.matchMedia was called correctly – both",
    (assert) =>
    {
        assert.expect(3);

        window.matchMedia = (query) => {
            assert.strictEqual(query, "screen and (min-width: 400px)");

            return {
                matches: true,
                addEventListener: (event) => {
                    assert.strictEqual(event, "change", "registered");
                },
                removeEventListener: (event) => {
                    assert.strictEqual(event, "change", "unregistered");
                },
                addListener: () => {
                    assert.notOk(true, "the legacy listener should not be called, if the modern one is present.");
                },
                removeListener: () => {
                    assert.notOk(true, "the legacy listener should not be called, if the modern one is present.");
                }
            };
        };

        let matcher = mediaQueryMatcher("screen and (min-width: 400px)");
        matcher.destroy();
    }
);


QUnit.test(
    "mediaQueryMatcher() onOff()",
    (assert) =>
    {
        assert.expect(2);
        let domEventTrigger = null;
        let externalCallback = () => {
            assert.ok(true, "Callback called.");
        };

        window.matchMedia = () => {
            return {
                matches: true,
                addEventListener: (event, param) => {
                    domEventTrigger = param;
                },
            };
        };

        let matcher = mediaQueryMatcher("");

        assert.ok(null !== domEventTrigger, "add event listener correctly called");

        // should not trigger callback
        domEventTrigger({matches: true});

        // register callback
        let off = matcher.onOff(externalCallback);

        // should trigger callback
        domEventTrigger({matches: true});

        // unregister
        off();

        // should NOT trigger callback
        domEventTrigger({matches: true});
    }
);
