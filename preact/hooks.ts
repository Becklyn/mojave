import {useEffect, useState} from "preact/hooks";
import {MediaQueryMatcher} from "../dom/media-query";


/**
 * Hook that automatically updates the value when the media query state changes
 */
export function useMediaQueryMatcher (matcher: MediaQueryMatcher) : boolean
{
    let [matches, setMatches] = useState(matcher.matches());
    useEffect(() => matcher.onOff(setMatches), []);
    return matches;
}
