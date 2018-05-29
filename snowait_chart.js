/**
 * SnowChart V0.1 - Snowait
 */

import {transposition} from "../tools/transposition";
import UIkit from "uikit";

const default_ns = 'http://www.w3.org/2000/svg';

export function init() {

    $('[snowait_chart]').each(function () {

        // Récupération des arguments
        const values = $(this).data('values').split("|");
        const categories = $(this).data('categories').split("|");

        // Paramètres du container SVG
        const svgWidth = '100%';
        const svgHeight = '190px';
        const etiquettesX = [0, categories.length - 1];
        const etiquettesY = [0, 7];
        const padding = {top: 5, right: 5, bottom: 16, left: 8};

        // Génération du container SVG
        const svg = newContainer({parent: $(this)[0], width: svgWidth, height: svgHeight});

        // -------------------------------------------------------------------------------------------------------------

        // Transposition dynamique de l'échelle globale
        let rW = [0, $(this).width()];
        let rH = [0, $(this).height()];
        let dR = [0, 100];

        /**
         * Obtenir une transposition à partir d'un interval bravo prédéfini
         * @param {array} type Interval alpha
         * @param {int|float} value Valeur à transposer
         * @returns {int|float}
         */
        const t = (type, value) => transposition(type, dR, value);

        // Transposition dynamique des niveaux de l'axe X
        let rSx = [t(rW, padding.left + 5), t(rW, 100 - padding.right - 5)];
        let dSx = [0, etiquettesX[1]];

        // Transposition dynamique des niveaux de l'axe Y
        let rSy = [t(rH, 100 - padding.bottom), t(rH, padding.top + 5)];
        let dSy = [0, etiquettesY[1]];

        // -------------------------------------------------------------------------------------------------------------

        // Création d'une définition d'objets graphiques
        const defs = newDefs(svg);

        // Création d'un marqueur "flêche"
        const markerArrow = newMarkerArrow(defs);

        // Création de l'axe X
        let axeX = document.createElementNS(default_ns, 'line');
        axeX.setAttributeNS(null, 'stroke', '#36373b');
        axeX.setAttributeNS(null, 'x1', t(rW, padding.left).toString());
        axeX.setAttributeNS(null, 'y1', t(rH, 100 - padding.bottom).toString());
        axeX.setAttributeNS(null, 'x2', t(rW, 100 - padding.right).toString());
        axeX.setAttributeNS(null, 'y2', t(rH, 100 - padding.bottom).toString());
        axeX.setAttributeNS(null, 'stroke-width', '1');
        axeX.setAttributeNS(null, 'marker-end', `url(#${markerArrow.getAttributeNS(null, 'id')})`);
        svg.appendChild(axeX);

        // Création de l'axe Y
        let axeY = document.createElementNS(default_ns, 'line');
        axeY.setAttributeNS(null, 'stroke', '#36373b');
        axeY.setAttributeNS(null, 'x1', t(rW, padding.left).toString());
        axeY.setAttributeNS(null, 'y1', t(rH, 100 - padding.bottom).toString());
        axeY.setAttributeNS(null, 'x2', t(rW, padding.left).toString());
        axeY.setAttributeNS(null, 'y2', t(rH, padding.top).toString());
        axeY.setAttributeNS(null, 'stroke-width', '1');
        axeY.setAttributeNS(null, 'marker-end', `url(#${markerArrow.getAttributeNS(null, 'id')})`);
        svg.appendChild(axeY);

        // Création des étiquettes de l'axe X
        for (let i = etiquettesX[0]; i <= etiquettesX[1]; i++) {

            let level = transposition(rSx, dSx, i);

            // Texte
            let etiquette = document.createElementNS(default_ns, 'text');
            etiquette.setAttributeNS(null, 'stroke', 'none');
            etiquette.setAttributeNS(null, 'x', level + 2);
            etiquette.setAttributeNS(null, 'y', t(rH, (100 - padding.bottom + 3)).toString());
            etiquette.setAttributeNS(null, 'text-anchor', 'end');
            etiquette.setAttributeNS(null, 'transform', `rotate(-90, ${level + 2}, ${t(rH, 100 - padding.bottom + 3)})`);

            if (categories[i].length > 4) {
                categories[i] = categories[i].substr(0, 3) + '.';
            }

            etiquette.appendChild(document.createTextNode(categories[i]));
            etiquette.style.fontFamily = 'Open sans';
            etiquette.style.fontSize = '11px';
            etiquette.style.fill = '#565f66';
            etiquette.style.pointerEvents = 'none';
            svg.appendChild(etiquette);

            // Trait
            let trait = document.createElementNS(default_ns, 'line');
            trait.setAttributeNS(null, 'stroke', '#565f66');
            trait.setAttributeNS(null, 'x1', level);
            trait.setAttributeNS(null, 'y1', t(rH, 100 - padding.bottom - 1).toString());
            trait.setAttributeNS(null, 'x2', level);
            trait.setAttributeNS(null, 'y2', t(rH, 100 - padding.bottom + 1).toString());
            trait.setAttributeNS(null, 'stroke-width', '1');
            svg.appendChild(trait);
        }

        // Création des étiquettes de l'axe Y
        for (let i = etiquettesY[0]; i <= etiquettesY[1]; i++) {

            let level = transposition(rSy, dSy, i);

            // Texte
            let etiquette = document.createElementNS(default_ns, 'text');
            etiquette.setAttributeNS(null, 'stroke', 'none');
            etiquette.setAttributeNS(null, 'x', t(rW, padding.left - 5).toString());
            etiquette.setAttributeNS(null, 'y', level + 3);
            etiquette.setAttributeNS(null, 'text-anchor', 'middle');
            etiquette.appendChild(document.createTextNode(i));
            etiquette.style.fontFamily = 'Open sans';
            etiquette.style.fontSize = '11px';
            etiquette.style.fill = '#565f66';
            etiquette.style.pointerEvents = 'none';
            svg.appendChild(etiquette);

            // Trait
            let trait = document.createElementNS(default_ns, 'line');
            trait.setAttributeNS(null, 'stroke', '#565f66');
            trait.setAttributeNS(null, 'x1', t(rW, padding.left - 1).toString());
            trait.setAttributeNS(null, 'y1', level);
            trait.setAttributeNS(null, 'x2', t(rW, padding.left + 1).toString());
            trait.setAttributeNS(null, 'y2', level);
            trait.setAttributeNS(null, 'stroke-width', '1');
            svg.appendChild(trait);
        }

        // Génération des coordonnées des points
        let buffer_1 = [];
        for (const [i, value] of values.entries()) {
            buffer_1.push([categories[i], value, transposition(rSx, dSx, i), transposition(rSy, dSy, value)]);
        }

        // Création de la polyline
        const polyline_1 = newPolyline({
            container: svg,
            stroke: '#229c51',
            points: buffer_1
        });
    });

    return true;
}

/**
 * Génération d'un container SVG
 * @param args Paramètres
 * @param {HTMLElement} args.parent Parent qui va accueillir le container SVG
 * @param {int|float|string} args.width Largeur du container
 * @param {int|float|string} args.height Hauteur du container
 * @param {string} ns Namespace
 * @returns {SVGElement} args.parent Le container SVG
 */
let newContainer = (args, ns = default_ns) => {

    // Génération d'un élement 'svg'
    let container = document.createElementNS(ns, 'svg');

    // Ajout des attributs
    container.setAttributeNS(null, 'width', args.width);
    container.setAttributeNS(null, 'height', args.height);
    container.setAttributeNS(null, 'viewbox', `0 0 100 100`);
    container.setAttributeNS(null, 'preserveAspectRatio', 'none');

    // Insertion de l'élement dans le parent
    args.parent.appendChild(container);

    // Retour de la référence de l'élement 'svg'
    return container;
};

/**
 * Génération d'une définition d'objets graphiques
 * @param {SVGElement} container Container SVG
 * @param {string} ns Namespace
 * @returns {SVGDefsElement} Référence de la définition
 */
let newDefs = (container, ns = default_ns) => {
    let defs = document.createElementNS(ns, 'defs');
    container.appendChild(defs);
    return defs;
};

/**
 * Génération d'un marqueur "flêche"
 * @param {SVGDefsElement} defs Définition d'objets graphiques
 * @param {string} ns Namespace
 * @returns {HTMLElement} Référence du marqueur
 */
let newMarkerArrow = (defs, ns = default_ns) => {

    // Génération d'un élement 'marker'
    let markerArrow = document.createElementNS(ns, 'marker');

    // Ajout des attributs
    markerArrow.setAttributeNS(null, 'id', '_' + Math.random().toString(36).substr(2, 9)); // Génération d'un ID
    markerArrow.setAttributeNS(null, 'markerWidth', '10');
    markerArrow.setAttributeNS(null, 'markerHeight', '10');
    markerArrow.setAttributeNS(null, 'refX', '0');
    markerArrow.setAttributeNS(null, 'refY', '4');
    markerArrow.setAttributeNS(null, 'orient', 'auto');
    markerArrow.setAttributeNS(null, 'markerUnits', 'strokeWidth');

    // Insertion de l'élement dans la définition d'objets graphiques
    defs.appendChild(markerArrow);

    // Génération d'un élement 'path'
    let marker_path = document.createElementNS(ns, 'path');

    // Ajout des attributs
    marker_path.setAttributeNS(null, 'd', 'M0,0 L0,8 L6,4 z');
    marker_path.setAttributeNS(null, 'fill', '#565f66');

    // Insertion de l'élement dans le marqueur
    markerArrow.appendChild(marker_path);

    // Retour de la référence de l'élement 'marker'
    return markerArrow;
};

/**
 * Génération d'une polyline
 * @param args Paramètres
 * @param {SVGElement} args.container Container SVG
 * @param {string} args.stroke Couleur de la ligne
 * @param {array} args.points Coordonnées des points
 * @param {string} ns Namespace
 */
let newPolyline = (args, ns = default_ns) => {

    // Génération d'un élement 'polyline'
    let polyline = document.createElementNS(ns, 'polyline');

    // Aggrégation des coordonnées
    let coordonnees = args.points.map(a => `${a[2]},${a[3]}`).join(' ');

    // Ajout des attributs
    polyline.setAttributeNS(null, 'stroke', args.stroke);
    polyline.setAttributeNS(null, 'stroke-width', '3');
    polyline.setAttributeNS(null, 'fill', 'none');
    polyline.setAttributeNS(null, 'points', coordonnees);

    // Insertion de l'élement dans le container SVG
    args.container.appendChild(polyline);

    // Création des points
    const points = args.points.map(a => newCircle({
        container: args.container,
        popup: `${a[0]} ${new Date().getFullYear()} : ${parseFloat(a[1]).toFixed(2)}€`,
        point: [a[2],a[3]]
    }));

    // Retour de la référence de l'élement 'polyline'
    return polyline;
};

/**
 * Génération d'un point
 * @param args Paramètres
 * @param {SVGElement} args.container Container SVG
 * @param {string} args.popup Texte de la popup
 * @param {array} args.point Coordonnées du point
 * @param {string} ns Namespace
 */
let newCircle = (args, ns = default_ns) => {

    // Génération d'un élement 'polyline'
    let circle = document.createElementNS(ns, 'circle');

    // Ajout des attributs
    circle.setAttributeNS(null, 'cx', args.point[0]);
    circle.setAttributeNS(null, 'cy', args.point[1]);
    circle.setAttributeNS(null, 'r', '4');
    circle.setAttributeNS(null, 'fill', '#000');
    circle.setAttributeNS(null, 'stroke', '#FFF');
    circle.setAttributeNS(null, 'stroke-width', '1');

    // Insertion de l'élement dans le container SVG
    args.container.appendChild(circle);

    if(typeof circle['uikit'] !== 'undefined') {
        circle['uikit'].$destroy();
    }

    circle['uikit'] = UIkit.tooltip(circle, {
        title: args.popup,
        pos: 'bottom',
        delay: 0,
        cls: 'uk-active snowait_chart'
    });

    // Retour de la référence de l'élement 'polyline'
    return circle;
};
