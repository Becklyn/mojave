import {mediaQuery} from "../../../../dom/events";
import QUnit from "qunit";
import {findOne} from "../../../../dom/traverse";
import {createElement} from "../../../../dom/manipulate";
import {setStyles} from "../../../../dom/css";

const matchQueryList = [];

QUnit.module("dom/events/mediaQuery()", {
    beforeEach: () => {
        findOne("#qunit-fixture").innerHTML = `
            <div class="example"></div>
        `;
    },
    afterEach: () => {
        matchQueryList.forEach((element, index) => {
            if (undefined !== element.mediaQuery)
            {
                if (undefined !== element.mediaQuery.remove)
                {
                    element.remove();
                }

                if (undefined !== element.mediaQuery.targetWindow)
                {
                    element.targetWindow.close();
                }
            }

            matchQueryList.splice(index, 1);
        });
    }
});


QUnit.test(
    "mediaQuery() on window media query matches without immediate execution",
    (assert) =>
    {
        assert.expect(0);

        const callback = (matches) => {
            assert.ok(matches, "Media query matches.");
        };

        matchQueryList.push(mediaQuery(`(min-width: ${window.innerWidth}px)`, callback));
    }
);


QUnit.test(
    "mediaQuery() on window media query matches with immediate execution",
    (assert) =>
    {
        const done = assert.async(1);

        assert.expect(1);

        const callback = (matches) => {
            assert.ok(matches, "Media query matches.");
            done();
        };

        matchQueryList.push(mediaQuery(`(min-width: ${window.innerWidth}px)`, callback, true));
    }
);


QUnit.test(
    "mediaQuery() on window media query not matching without immediate execution",
    (assert) =>
    {
        assert.expect(0);

        const callback = (matches) => {
            assert.notOk(matches, "Media query does not match.");
        };

        matchQueryList.push(mediaQuery(`(min-width: ${window.innerWidth + 1}px)`, callback));
    }
);


QUnit.test(
    "mediaQuery() on window media query not matching with immediate execution",
    (assert) =>
    {
        const done = assert.async(1);

        assert.expect(1);

        const callback = (matches) => {
            assert.notOk(matches, "Media query does not match.");
            done();
        };

        matchQueryList.push(mediaQuery(`(min-width: ${window.innerWidth + 1}px)`, callback, true));
    }
);

QUnit.test(
    "mediaQuery() on window media query matching without immediate execution and window size changing",
    (assert) =>
    {
        const done = assert.async(1);
        assert.expect(1);

        const element = createElement("iframe", {css: {
            width: "100px",
            height: "100px",
        }});

        findOne(".example").append(element);

        const callback = (matches) => {
            matches ? assert.ok(matches, "Media query matches.") : assert.notOk(matches, "Media query doesn't match.");
            done();
        };

        matchQueryList.push(mediaQuery(`(min-width: 100px)`, callback, false, element.contentWindow));

        // we need to use setTimeout to make render steps in between
        setTimeout(() => {
            setStyles(element, {
                width: "10px",
            });

            setTimeout(() => {
                setStyles(element, {
                    width: "90px",
                });

                setTimeout(() => {
                    setStyles(element, {
                        width: "1000px",
                    });
                });
            });
        });
    }
);

QUnit.test(
    "mediaQuery() on window media query matching with immediate execution and window size changing",
    (assert) =>
    {
        const done = assert.async(2);
        assert.expect(2);

        const element = createElement("iframe", {css: {
            width: "100px",
            height: "100px",
        }});

        findOne(".example").append(element);

        const callback = (matches) => {
            matches ? assert.ok(matches, "Media query matches.") : assert.notOk(matches, "Media query doesn't match.");
            done();
        };

        matchQueryList.push(mediaQuery(`(min-width: 100px)`, callback, true, element.contentWindow));

        setStyles(element, {
            width: "10px",
        });

        setTimeout(() => {
            setStyles(element, {
                width: "1000px",
            });
        });
    }
);

QUnit.test(
    "mediaQuery() with empty media query",
    (assert) =>
    {
        assert.expect(1);

        const callback = () => {
            assert.ok(true, "Media query matches.");
        };

        let currentMediaQuery = mediaQuery("", callback, true);

        if (null === currentMediaQuery)
        {
            assert.ok(true, "Media was not created.");
        }

        matchQueryList.push(currentMediaQuery || {});
    }
);
