// ==UserScript==
// @name         Geoguessr Return to Map Link 2
// @version      1.0
// @description  Adds a link to game results to return to the map page
// @author       @nombrekeff
// @match        https://www.geoguessr.com/game/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        none
// @downloadURL  https://github.com/nombrekeff/Tampermonkey-Scripts/blob/main/geoguessr/game-results-map-link.js
// @updateURL    https://github.com/nombrekeff/Tampermonkey-Scripts/blob/main/geoguessr/game-results-map-link.js
// @copyright    2023, nombrekeff (https://github.com/miraclewhips)
// ==/UserScript==

const arrowIconUrl = '/_next/static/images/arrow-left-ddddc174f6fd632247f5bf1d712df280.svg';
const slantedMapLink = (label, mapId, mapName) =>
`<a class="slanted-map_link" title="Go back to map: ${mapName}" style="color: var(--ds-color-white);text-decoration: none" href="/maps/${mapId}"><div class="slanted-wrapper_root__2eaEs slanted-wrapper_variantGrayTransparent__aufaF">
<div class="slanted-wrapper_start__Kl7rv slanted-wrapper_right__G0JWR"></div>
<div class="round-indicator_roundIndicatorContent__GcI_m" style="color: var(--ds-color-white); display: flex; align-items: center; justify-content: center; padding-right: 18px">
<span class="button_icon__a2L5l" style="width: 13px; color: white; margin: 0 8px"><img src="${arrowIconUrl}"></span>
${label}
</div>
<div class="slanted-wrapper_end__cD1Qu slanted-wrapper_right__G0JWR"></div>
</div>
</a>`;

const DATA = {
    gameData: {},
};


const getGameId = () => {
    return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
}

const queryGeoguessrGameData = async (id) => {
    let apiUrl = `https://www.geoguessr.com/api/v3/games/${getGameId()}`;

    if(location.pathname.startsWith("/challenge/")) {
        apiUrl = `https://www.geoguessr.com/api/v3/challenges/${id}/game`;
    }

    return await fetch(apiUrl).then(res => res.json());
}


const createDiv = () => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '20px';
    div.id = 'maplink';
    return div;
}

const addMapLink = (parent) => {
    const data = DATA.gameData;
    const divWrapper = createDiv();
    divWrapper.innerHTML = slantedMapLink(data.mapName, data.map, data.mapName);
    parent.append(divWrapper);
};


const checkState = () => {
    const resultLayout = document.querySelector("#__next div.result-layout_topNew__RNAJ4 > div.round-indicator_roundIndicator__ogZIY");
    const mapLinkElAlreadyExists = document.getElementById('maplink');

    if(resultLayout && !mapLinkElAlreadyExists) {
        console.log('add link');
        addMapLink(resultLayout);
    }
}

const init = async () => {
    const data = await queryGeoguessrGameData();
    DATA.gameData = data;

    const observer = new MutationObserver(() => {
        checkState();
    });

    observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
}
init();
